import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bold, Image as ImageIcon, Italic, Link2, List, Quote, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/lib/content.functions";

export function useMediaUpload() {
  const upload = useServerFn(uploadMedia);
  return async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Não foi possível ler o arquivo"));
      reader.readAsDataURL(file);
    });
    const res = await upload({ data: { filename: file.name, dataUrl } });
    return res.url;
  };
}

/** Campo de imagem de capa: envio de arquivo + endereço manual. */
export function CoverField({ name, defaultValue, label = "Imagem de capa" }: { name: string; defaultValue?: string | null; label?: string }) {
  const uploadFile = useMediaUpload();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="grid gap-2 rounded-lg border border-border p-4">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {url && <img src={url} alt="" className="size-20 rounded-lg border object-cover" />}
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => input.current?.click()}>
          <ImageIcon /> {busy ? "Enviando…" : url ? "Trocar imagem" : "Enviar imagem"}
        </Button>
        {url && <Button type="button" variant="ghost" size="sm" onClick={() => setUrl("")}>Remover</Button>}
      </div>
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setBusy(true);
        try { setUrl(await uploadFile(file)); } catch (err) { alert(err instanceof Error ? err.message : "Falha no envio"); }
        setBusy(false); e.target.value = "";
      }} />
      <input className="field" value={url} onChange={(e) => setUrl(e.target.value)} name={name} placeholder="Ou cole o endereço da imagem" />
    </div>
  );
}

const tools = [
  { cmd: "bold", icon: Bold, label: "Negrito" },
  { cmd: "italic", icon: Italic, label: "Itálico" },
  { cmd: "formatBlock:h2", icon: Type, label: "Título" },
  { cmd: "formatBlock:blockquote", icon: Quote, label: "Citação" },
  { cmd: "insertUnorderedList", icon: List, label: "Lista" },
] as const;

/** Editor de texto completo com imagens no meio do conteúdo. */
export function RichTextEditor({ name, defaultValue }: { name: string; defaultValue?: string | null }) {
  const uploadFile = useMediaUpload();
  const editor = useRef<HTMLDivElement>(null);
  const initial = defaultValue ?? "";
  const [html, setHtml] = useState(/<[a-z][\s\S]*>/i.test(initial) ? initial : initial.split(/\n{2,}/).filter(Boolean).map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`).join("") || "<p></p>");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (editor.current && editor.current.innerHTML !== html) editor.current.innerHTML = html; }, []);
  const run = (cmd: string) => {
    editor.current?.focus();
    const [command, value] = cmd.split(":");
    document.execCommand(command!, false, value);
    setHtml(editor.current?.innerHTML ?? "");
  };
  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-border bg-secondary/60 p-2">
        {tools.map(({ cmd, icon: Icon, label }) => (
          <Button key={cmd} type="button" variant="ghost" size="icon" aria-label={label} title={label} onClick={() => run(cmd)}><Icon /></Button>
        ))}
        <Button type="button" variant="ghost" size="icon" aria-label="Inserir link" title="Inserir link" onClick={() => {
          const href = prompt("Endereço do link:"); if (href) run(`createLink:${href}`);
        }}><Link2 /></Button>
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => fileInput.current?.click()}>
          <ImageIcon /> {busy ? "Enviando…" : "Imagem no texto"}
        </Button>
      </div>
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={async (e) => {
        const file = e.target.files?.[0]; if (!file) return;
        setBusy(true);
        try {
          const url = await uploadFile(file);
          editor.current?.focus();
          document.execCommand("insertHTML", false, `<figure><img src="${url}" alt=""/></figure><p></p>`);
          setHtml(editor.current?.innerHTML ?? "");
        } catch (err) { alert(err instanceof Error ? err.message : "Falha no envio"); }
        setBusy(false); e.target.value = "";
      }} />
      <div
        ref={editor}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Conteúdo"
        className="rich-editor"
        onInput={() => setHtml(editor.current?.innerHTML ?? "")}
        onBlur={() => setHtml(editor.current?.innerHTML ?? "")}
      />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
