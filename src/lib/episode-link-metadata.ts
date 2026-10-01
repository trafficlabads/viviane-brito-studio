export type EpisodePlatform =
  | "youtube"
  | "youtube_music"
  | "spotify"
  | "soundcloud"
  | "apple_music"
  | "amazon_music"
  | "unknown";

export type EpisodeLinkMetadata = {
  title: string;
  description: string;
  cover_url: string | null;
  platform: EpisodePlatform;
  normalizedUrl: string;
};

const URL_FIELD: Record<Exclude<EpisodePlatform, "unknown">, string> = {
  youtube: "youtube_url",
  youtube_music: "youtube_music_url",
  spotify: "spotify_url",
  soundcloud: "soundcloud_url",
  apple_music: "apple_music_url",
  amazon_music: "amazon_music_url",
};

export function episodeUrlFieldName(platform: EpisodePlatform): string | null {
  if (platform === "unknown") return null;
  return URL_FIELD[platform];
}

export function detectEpisodePlatform(raw: string): EpisodePlatform {
  let host = "";
  try {
    host = new URL(raw.trim()).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "unknown";
  }
  if (host === "youtu.be" || host === "youtube.com" || host.endsWith(".youtube.com")) {
    if (host.startsWith("music.")) return "youtube_music";
    return "youtube";
  }
  if (host === "open.spotify.com") return "spotify";
  if (host === "soundcloud.com" || host.endsWith(".soundcloud.com")) return "soundcloud";
  if (host === "music.apple.com") return "apple_music";
  if (host.includes("amazon.") || host === "music.amazon.com") return "amazon_music";
  return "unknown";
}

function metaContent(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
    "i",
  );
  const m = html.match(re);
  return (m?.[1] ?? m?.[2] ?? "").trim() || null;
}

async function fetchOEmbed(endpoint: string): Promise<{ title?: string; description?: string; thumbnail_url?: string } | null> {
  const res = await fetch(endpoint, {
    headers: { Accept: "application/json", "User-Agent": "VivianeBritoStudio/1.0" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return null;
  return (await res.json()) as { title?: string; description?: string; thumbnail_url?: string };
}

async function fetchOpenGraph(url: string): Promise<{ title: string; description: string; cover_url: string | null }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "facebookexternalhit/1.1", Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error("Não foi possível ler a página do link.");
  const html = await res.text();
  const title = metaContent(html, "og:title") ?? metaContent(html, "twitter:title") ?? "";
  const description =
    metaContent(html, "og:description") ?? metaContent(html, "description") ?? metaContent(html, "twitter:description") ?? "";
  const cover_url = metaContent(html, "og:image") ?? metaContent(html, "twitter:image") ?? null;
  return { title, description, cover_url };
}

function youtubeThumb(url: string): string | null {
  const id = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export async function fetchEpisodeLinkMetadata(rawUrl: string): Promise<EpisodeLinkMetadata> {
  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) throw new Error("Use um link que comece com http:// ou https://");
  if (trimmed.length > 2048) throw new Error("Link muito longo.");

  const platform = detectEpisodePlatform(trimmed);
  const normalizedUrl = trimmed;

  if (platform === "youtube" || platform === "youtube_music") {
    const oembed = await fetchOEmbed(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(trimmed)}&format=json`,
    );
    let description = oembed?.description?.trim() ?? "";
    let cover_url = oembed?.thumbnail_url ?? youtubeThumb(trimmed);
    if (!description) {
      try {
        const og = await fetchOpenGraph(trimmed);
        description = og.description;
        cover_url = cover_url ?? og.cover_url;
      } catch {
        /* oEmbed title/thumb is enough */
      }
    }
    return {
      title: oembed?.title?.trim() ?? "",
      description,
      cover_url,
      platform,
      normalizedUrl,
    };
  }

  if (platform === "spotify") {
    const oembed = await fetchOEmbed(`https://open.spotify.com/oembed?url=${encodeURIComponent(trimmed)}`);
    if (!oembed?.title) throw new Error("Spotify não retornou dados para este link.");
    return {
      title: oembed.title.trim(),
      description: oembed.description?.trim() ?? "",
      cover_url: oembed.thumbnail_url ?? null,
      platform,
      normalizedUrl,
    };
  }

  if (platform === "soundcloud") {
    const oembed = await fetchOEmbed(
      `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(trimmed)}`,
    );
    if (!oembed?.title) throw new Error("SoundCloud não retornou dados para este link.");
    return {
      title: oembed.title.trim(),
      description: oembed.description?.trim() ?? "",
      cover_url: oembed.thumbnail_url ?? null,
      platform,
      normalizedUrl,
    };
  }

  if (platform === "apple_music" || platform === "amazon_music") {
    const og = await fetchOpenGraph(trimmed);
    if (!og.title) throw new Error("Não foi possível extrair título deste link.");
    return { title: og.title, description: og.description, cover_url: og.cover_url, platform, normalizedUrl };
  }

  const og = await fetchOpenGraph(trimmed);
  if (!og.title && !og.description && !og.cover_url) {
    throw new Error("Plataforma não reconhecida. Use YouTube, Spotify, SoundCloud, Apple Music ou Amazon Music.");
  }
  return { title: og.title, description: og.description, cover_url: og.cover_url, platform: "unknown", normalizedUrl };
}
