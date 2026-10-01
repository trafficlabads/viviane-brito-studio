import { useServerFn } from "@tanstack/react-start";
import { Link2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CoverField } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { fetchEpisodeFromLink, saveEpisode } from "@/lib/content.functions";

type EpisodeDraft = {
  id?: string;
  title?: string;
  description?: string;
  cover_url?: string | null;
  youtube_url?: string | null;
  spotify_url?: string | null;
  soundcloud_url?: string | null;
  youtube_music_url?: string | null;
  amazon_music_url?: string | null;
  apple_music_url?: string | null;
  episode_number?: number | null;
  published?: boolean;
};

const emptyUrls = {
  youtube_url: "",
  spotify_url: "",
  soundcloud_url: "",
  youtube_music_url: "",
  amazon_music_url: "",
  apple_music_url: "",
};

export function EpisodeAdminForm({
  initial,
  onDone,
  onCancel,
}: {
  initial: EpisodeDraft;
  onDone: () => Promise<void>;
  onCancel: () => void;
}) {
  const save = useServerFn(saveEpisode);
  const fetchMeta = useServerFn(fetchEpisodeFromLink);
  const [linkInput, setLinkInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [importHint, setImportHint] = useState("");
  const [form, setForm] = useState({
    title: initial.title ?? "",
    description: initial.description ?? "",
    cover_url: initial.cover_url ?? "",
    episode_number: initial.episode_number != null ? String(initial.episode_number) : "",
    published: Boolean(initial.published),
    ...emptyUrls,
    youtube_url: initial.youtube_url ?? "",
    spotify_url: initial.spotify_url ?? "",
    soundcloud_url: initial.soundcloud_url ?? "",
    youtube_music_url: initial.youtube_music_url ?? "",
    amazon_music_url: initial.amazon_music_url ?? "",
    apple_music_url: initial.apple_music_url ?? "",
  });

  async function importFromLink() {
    const url = linkInput.trim();
    if (!url) return;
    setImporting(true);
    setImportHint("");
    try {
      const meta = await fetchMeta({ data: { url } });
      setForm((prev) => {
        const next = { ...prev };
        if (meta.title) next.title = meta.title;
        if (meta.description) next.description = meta.description;
        if (meta.cover_url) next.cover_url = meta.cover_url;
        if (meta.urlField && meta.url) {
          (next as Record<string, string>)[meta.urlField] = meta.url;
        }
        return next;
      });
      setImportHint(
        meta.platform === "unknown"
          ? "Dados parciais extraídos da página. Confira título e links."
          : "Título, descrição e capa preenchidos. Revise antes de salvar.",
      );
    } catch (e) {
      setImportHint(e instanceof Error ? e.message : "Não foi possível buscar dados deste link.");
    } finally {
      setImporting(false);
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = (s: string) => s.trim() || null;
    await save({
      data: {
        id: initial.id,
        title: form.title.trim(),
        description: form.description,
        cover_url: val(form.cover_url),
        youtube_url: val(form.youtube_url),
        spotify_url: val(form.spotify_url),
        soundcloud_url: val(form.soundcloud_url),
        youtube_music_url: val(form.youtube_music_url),
        amazon_music_url: val(form.amazon_music_url),
        apple_music_url: val(form.apple_music_url),
        episode_number: form.episode_number ? Number(form.episode_number) : null,
        published: form.published,
      },
    });
    await onDone();
  }

  const urlFields = [
    ["youtube_url", "YouTube"],
    ["spotify_url", "Spotify"],
    ["soundcloud_url", "SoundCloud"],
    ["youtube_music_url", "YouTube Music"],
    ["amazon_music_url", "Amazon Music"],
    ["apple_music_url", "Apple Music"],
  ] as const;

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="grid gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium">Importar da plataforma</p>
        <p className="text-xs text-muted-foreground">
          Cole o link do episódio (YouTube, Spotify, SoundCloud, etc.) para preencher título, descrição e capa.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="field min-w-0 flex-1"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            placeholder="https://…"
            aria-label="Link do episódio na plataforma"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void importFromLink();
              }
            }}
          />
          <Button type="button" variant="secondary" disabled={importing || !linkInput.trim()} onClick={() => void importFromLink()}>
            {importing ? <Loader2 className="animate-spin" /> : <Link2 />}
            {importing ? "Buscando…" : "Preencher automaticamente"}
          </Button>
        </div>
        {importHint && <p className="text-xs text-muted-foreground">{importHint}</p>}
      </div>

      <input
        className="field"
        value={form.title}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        placeholder="Título"
        required
        aria-label="Título"
      />
      <textarea
        className="field min-h-[120px]"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Descrição"
        aria-label="Descrição"
      />
      <CoverField
        name="cover_url"
        value={form.cover_url}
        onValueChange={(cover_url) => setForm((f) => ({ ...f, cover_url }))}
        label="Capa do episódio"
      />

      {urlFields.map(([key, label]) => (
        <input
          key={key}
          className="field"
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={label}
          aria-label={label}
        />
      ))}

      <input
        className="field"
        type="number"
        value={form.episode_number}
        onChange={(e) => setForm((f) => ({ ...f, episode_number: e.target.value }))}
        placeholder="Número do episódio"
        aria-label="Número do episódio"
      />

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
        Publicado
      </label>

      <div className="flex gap-2">
        <Button type="submit">Salvar</Button>
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
