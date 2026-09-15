import { MessageCircle, Send, X } from "lucide-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5511933441809";

type WhatsAppContextValue = { openWhatsApp: () => void };
const WhatsAppContext = createContext<WhatsAppContextValue>({ openWhatsApp: () => {} });

export function useWhatsApp() {
  return useContext(WhatsAppContext);
}

export function WhatsAppProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nome = String(f.get("nome") || "").trim();
    const ajuda = String(f.get("ajuda") || "").trim();
    if (!nome || !ajuda) return;
    const text = `Meu nome é ${nome}, ${ajuda}.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <WhatsAppContext.Provider value={{ openWhatsApp: () => setOpen(true) }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Conversar pelo WhatsApp">
          <button type="button" aria-label="Fechar" onClick={() => setOpen(false)} className="absolute inset-0 bg-foreground/40 backdrop-blur-md" />
          <div className="whatsapp-dialog relative w-full max-w-md rounded-[1.75rem] border bg-background p-7 shadow-2xl md:p-9">
            <button type="button" onClick={() => setOpen(false)} aria-label="Fechar" className="interactive-control absolute right-5 top-5 grid size-9 place-items-center rounded-full bg-secondary text-foreground">
              <X className="size-4" />
            </button>
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="size-5" />
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight">Vamos conversar?</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Preencha rapidinho e você será direcionada ao WhatsApp da Viviane com a mensagem pronta.
            </p>
            <form className="mt-6 grid gap-3" onSubmit={submit}>
              <input name="nome" required maxLength={100} placeholder="Seu nome" autoComplete="name" className="field" />
              <textarea name="ajuda" required minLength={5} maxLength={500} rows={4} placeholder="Como posso ajudar?" className="field resize-none" />
              <Button type="submit" size="lg" className="mt-1 justify-between rounded-full">
                Vamos Conversar <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </WhatsAppContext.Provider>
  );
}
