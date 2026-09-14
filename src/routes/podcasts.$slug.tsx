import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/Layout";
import { ImmersivePlayer, type Episode } from "@/components/site/ImmersivePlayer";
import { getPublicContent } from "@/lib/content.functions";
import cover from "@/assets/podcast-cover.jpg";

export const Route = createFileRoute("/podcasts/$slug")({
  loader: async ({ params }) => {
    const data = await getPublicContent();
    const episode = data.episodes.find((item) => item.slug === params.slug);
    if (!episode) throw notFound();
    return episode;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} — Alma e Caminhos` : "Episódio não encontrado" },
    { name: "description", content: loaderData?.description || "Episódio do podcast Alma e Caminhos." },
    { property: "og:title", content: loaderData?.title || "Alma e Caminhos" },
    { property: "og:description", content: loaderData?.description || "A jornada entre vida, propósito e carreira." },
    { property: "og:type", content: "article" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PodcastEpisode,
});

function PodcastEpisode() {
  const episode = Route.useLoaderData();
  const [playing, setPlaying] = useState(false);
  const playable: Episode = { ...episode, cover_url: episode.cover_url || cover };
  const platforms = [["Spotify", episode.spotify_url], ["SoundCloud", episode.soundcloud_url], ["YouTube Music", episode.youtube_music_url], ["Amazon Music", episode.amazon_music_url], ["Apple Music", episode.apple_music_url]];
  return <SiteLayout><section className="page-hero"><Link to="/podcasts" className="eyebrow text-primary">← Todos os episódios</Link><div className="mt-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><img src={episode.cover_url || cover} alt={`Capa de ${episode.title}`} className="aspect-square w-full rounded-lg object-cover"/><div><p className="eyebrow text-primary">Episódio {episode.episode_number || "Alma e Caminhos"}</p><h1 className="mt-5 font-display text-5xl leading-none md:text-7xl">{episode.title}</h1><p className="mt-6 text-lg leading-8 text-muted-foreground">{episode.description}</p><Button size="lg" className="mt-8" onClick={() => setPlaying(true)}><Play/>Ouvir episódio</Button><div className="mt-6 flex flex-wrap gap-4">{platforms.filter(([,url]) => url).map(([name,url]) => <a key={name} href={url || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary">{name}<ExternalLink className="h-3 w-3"/></a>)}</div></div></div></section>{playing && <ImmersivePlayer episode={playable} onClose={() => setPlaying(false)}/>}</SiteLayout>;
}