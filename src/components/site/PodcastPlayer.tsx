import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Maximize2, Pause, Play, X } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { getLatestEpisode } from "@/lib/content.functions";

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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fetchLatest = useServerFn(getLatestEpisode);
  useEffect(() => {
    let active = true;
    fetchLatest().then((latest) => { if (active && latest) setEpisode((current) => current ?? (latest as Episode)); }).catch(() => {});
    return () => { active = false; };
  }, [fetchLatest]);
  const playEpisode = useCallback((next: Episode) => {
    setEpisode(next);
    setExpanded(true);
    setPlaying(true);
  }, []);
  const send = useCallback((command: "playVideo" | "pauseVideo") => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
  }, []);
  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    send(next ? "playVideo" : "pauseVideo");
  };
  const close = () => { send("pauseVideo"); setEpisode(null); setExpanded(false); setPlaying(false); };
  const id = youtubeId(episode?.youtube_url);
  const spotifyId = spotifyEpisodeId(episode?.spotify_url);
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

  return <PlayerContext.Provider value={{ playEpisode }}>
    {children}
    {episode && <div className={expanded ? "podcast-stage" : "podcast-dock"} role="dialog" aria-modal={expanded || undefined} aria-label={`Reproduzindo ${episode.title}`}>
      <div className="player-orbit orbit-one"/><div className="player-orbit orbit-two"/>
      <div className="podcast-player-inner">
        <div className="podcast-cover-wrap"><img src={episode.cover_url || "/podcast-cover-placeholder.jpg"} alt={`Capa de ${episode.title}`} className="podcast-cover"/></div>
        <div className="min-w-0 flex-1">
          {expanded && <p className="eyebrow mb-3 opacity-60">Alma e Caminhos</p>}
          <p className={expanded ? "font-display text-4xl md:text-6xl" : "truncate text-sm font-medium"}>{episode.title}</p>
          {expanded && <p className="mx-auto mt-4 max-w-xl leading-7 opacity-70">{episode.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="secondary" size="icon" className="rounded-full" onClick={toggle} aria-label={playing ? "Pausar" : "Reproduzir"}>{playing ? <Pause/> : <Play/>}</Button>
          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Minimizar player" : "Expandir player"}>{expanded ? <ChevronDown/> : <Maximize2/>}</Button>
          <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={close} aria-label="Fechar player"><X/></Button>
        </div>
      </div>
      {id && <iframe ref={iframeRef} className={expanded ? "podcast-video" : "podcast-video-hidden"} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=${playing ? 1 : 0}&enablejsapi=1`} title={episode.title} allow="autoplay; encrypted-media"/>}
      {!id && spotifyId && <iframe key={playing ? "spotify-playing" : "spotify-paused"} className={expanded ? "podcast-spotify" : "podcast-video-hidden"} src={`https://open.spotify.com/embed/episode/${spotifyId}?utm_source=generator${playing ? "&autoplay=1" : ""}`} title={`Ouvir ${episode.title} no Spotify`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager"/>}
      {expanded && <div className="relative z-[2] mt-7 flex flex-wrap justify-center gap-2">{links.filter(([, url]) => url).map(([name, url]) => <a key={name} href={url ?? "#"} target="_blank" rel="noreferrer" className="rounded-full border border-primary-foreground/25 px-4 py-2 text-sm hover:bg-primary-foreground/10">{name}</a>)}</div>}
    </div>}
  </PlayerContext.Provider>;
}