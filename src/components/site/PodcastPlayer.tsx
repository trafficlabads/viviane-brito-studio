import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Maximize2, Pause, Play, X } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { getLatestEpisode } from "@/lib/content.functions";

type SpotifyController = {
  play: () => void;
  pause: () => void;
  destroy: () => void;
  addListener: (event: "playback_update", callback: (event: { data: { isPaused: boolean } }) => void) => void;
};

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width: string; height: string },
    callback: (controller: SpotifyController) => void,
  ) => void;
};

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
};

type YTApi = {
  Player: new (element: HTMLElement, options: Record<string, unknown>) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    SpotifyIframeApi?: SpotifyIframeApi;
    YT?: YTApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type Episode = {
  title: string;
  description: string;
  cover_url?: string | null;
  youtube_url?: string | null;
  spotify_url?: string | null;
  soundcloud_url?: string | null;
  youtube_music_url?: string | null;
  amazon_music_url?: string | null;
  apple_music_url?: string | null;
};

type PlayerContextValue = { playEpisode: (episode: Episode) => void };
const PlayerContext = createContext<PlayerContextValue | null>(null);

function youtubeId(url?: string | null) {
  if (!url) return null;
  return url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)?.[1] ?? null;
}

function spotifyEpisodeId(url?: string | null) {
  if (!url) return null;
  return url.match(/episode\/([A-Za-z0-9]+)/)?.[1] ?? null;
}

export function usePodcastPlayer() {
  const value = useContext(PlayerContext);
  if (!value) throw new Error("PodcastPlayerProvider ausente");
  return value;
}

export function PodcastPlayerProvider({ children }: { children: ReactNode }) {
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ytMountRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const spotifyMountRef = useRef<HTMLDivElement>(null);
  const spotifyControllerRef = useRef<SpotifyController | null>(null);
  const fetchLatest = useServerFn(getLatestEpisode);
  const isAdminRoute = useRouterState({ select: (s) => s.location.pathname.startsWith("/admin") });
  useEffect(() => {
    if (isAdminRoute) return;
    let active = true;
    fetchLatest().then((latest) => { if (active && latest) setEpisode((current) => current ?? (latest as Episode)); }).catch(() => {});
    return () => { active = false; };
  }, [fetchLatest, isAdminRoute]);
  const playEpisode = useCallback((next: Episode) => {
    setEpisode(next);
    setExpanded(false);
    setPlaying(false);
  }, []);
  const id = youtubeId(episode?.youtube_url);
  const spotifyId = spotifyEpisodeId(episode?.spotify_url);
  const playable = Boolean(id || spotifyId);
  const toggle = () => {
    if (!playable) {
      setExpanded(true);
      return;
    }
    const next = !playing;
    if (ytPlayerRef.current) {
      if (next) ytPlayerRef.current.playVideo();
      else ytPlayerRef.current.pauseVideo();
      setPlaying(next);
      return;
    }
    if (spotifyControllerRef.current) {
      if (next) spotifyControllerRef.current.play();
      else spotifyControllerRef.current.pause();
      setPlaying(next);
      return;
    }
    setPlaying(next);
  };
  const close = () => {
    ytPlayerRef.current?.pauseVideo();
    spotifyControllerRef.current?.pause();
    setEpisode(null);
    setExpanded(false);
    setPlaying(false);
  };
  const links = useMemo(() => episode ? [
    ["Spotify", episode.spotify_url], ["SoundCloud", episode.soundcloud_url],
    ["YouTube Music", episode.youtube_music_url], ["Amazon Music", episode.amazon_music_url],
    ["Apple Music", episode.apple_music_url],
  ] : [], [episode]);
  useEffect(() => {
    if (!expanded || !episode) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setExpanded(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, episode]);
  useEffect(() => {
    ytPlayerRef.current?.destroy();
    ytPlayerRef.current = null;
    if (!id || !ytMountRef.current) return;

    let active = true;
    const createPlayer = () => {
      const api = window.YT;
      const mount = ytMountRef.current;
      if (!active || !api?.Player || !mount) return;
      mount.replaceChildren();
      const host = document.createElement("div");
      mount.appendChild(host);
      ytPlayerRef.current = new api.Player(host, {
        videoId: id,
        host: "https://www.youtube-nocookie.com",
        playerVars: { autoplay: 0, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === api.PlayerState.PLAYING) setPlaying(true);
            if (event.data === api.PlayerState.PAUSED || event.data === api.PlayerState.ENDED) setPlaying(false);
          },
        },
      });
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        createPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      active = false;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
    };
  }, [id]);
  useEffect(() => {
    spotifyControllerRef.current?.destroy();
    spotifyControllerRef.current = null;
    const mount = spotifyMountRef.current;
    if (!spotifyId || !mount) return;

    let active = true;
    const createController = (api: SpotifyIframeApi) => {
      if (!active || !spotifyMountRef.current) return;
      spotifyMountRef.current.replaceChildren();
      api.createController(
        spotifyMountRef.current,
        { uri: `spotify:episode:${spotifyId}`, width: "100%", height: "152" },
        (controller) => {
          if (!active) {
            controller.destroy();
            return;
          }
          spotifyControllerRef.current = controller;
          controller.addListener("playback_update", ({ data }) => setPlaying(!data.isPaused));
        },
      );
    };

    if (window.SpotifyIframeApi) {
      createController(window.SpotifyIframeApi);
    } else {
      const previousReady = window.onSpotifyIframeApiReady;
      window.onSpotifyIframeApiReady = (api) => {
        window.SpotifyIframeApi = api;
        previousReady?.(api);
        createController(api);
      };
      if (!document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]')) {
        const script = document.createElement("script");
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      active = false;
      spotifyControllerRef.current?.destroy();
      spotifyControllerRef.current = null;
    };
  }, [spotifyId]);

  return <PlayerContext.Provider value={{ playEpisode }}>
    {children}
    {episode && !isAdminRoute && <div className={expanded ? "podcast-stage" : "podcast-dock"} role="dialog" aria-modal={expanded || undefined} aria-label={`Reproduzindo ${episode.title}`}>
      <div className="player-orbit orbit-one"/><div className="player-orbit orbit-two"/>
      <div className="podcast-player-inner">
        <div className="podcast-cover-wrap"><img src={episode.cover_url || "/podcast-cover-placeholder.jpg"} alt={`Capa de ${episode.title}`} className="podcast-cover"/></div>
        <div className="min-w-0 flex-1">
          {expanded && <p className="eyebrow mb-3 opacity-60">Alma e Caminhos</p>}
          <p className={expanded ? "font-display text-4xl md:text-6xl" : "truncate text-sm font-medium"}>{episode.title}</p>
          {expanded && <p className="mx-auto mt-4 max-w-xl leading-7 opacity-70">{episode.description}</p>}
          {expanded && !playable && (
            <p className="mt-4 max-w-md text-sm leading-6 text-amber-100/90">
              Este episódio ainda não tem link de áudio. No painel <strong>/admin</strong> → Podcasts, preencha o campo{" "}
              <strong>YouTube</strong> (ou Spotify) e salve.
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="secondary" size="icon" className="rounded-full" onClick={toggle} aria-label={playing ? "Pausar" : "Reproduzir"}>{playing ? <Pause/> : <Play/>}</Button>
          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Minimizar player" : "Expandir player"}>{expanded ? <ChevronDown/> : <Maximize2/>}</Button>
          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={close} aria-label="Fechar player"><X/></Button>
        </div>
      </div>
      {id && <div className={expanded ? "podcast-video" : "podcast-video-hidden"} aria-label={`Ouvir ${episode.title}`}><div ref={ytMountRef}/></div>}
      {!id && spotifyId && <div className={expanded ? "podcast-spotify" : "podcast-video-hidden"} aria-label={`Ouvir ${episode.title} no Spotify`}><div ref={spotifyMountRef}/></div>}
      {expanded && <div className="relative z-[2] mt-7 flex flex-wrap justify-center gap-2">{links.filter(([, url]) => url).map(([name, url]) => <a key={name} href={url ?? "#"} target="_blank" rel="noreferrer" className="rounded-full border border-primary-foreground/25 px-4 py-2 text-sm hover:bg-primary-foreground/10">{name}</a>)}</div>}
    </div>}
  </PlayerContext.Provider>;
}