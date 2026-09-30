import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/components/site/WhatsAppDialog";
import logo from "@/assets/viviane-logo-purple.png";

export function SiteHeader() {
  const { openWhatsApp } = useWhatsApp();
  const [open, setOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileItems = [
    { to: "/", label: "Início" },
    { to: "/about", label: "Sobre Viviane" },
    { to: "/", hash: "caminhos", label: "Serviços" },
    { to: "/", hash: "artigos", label: "Artigos" },
    { to: "/", hash: "depoimentos", label: "Depoimentos" },
    { to: "/podcasts", label: "Podcast" },
  ] as const;

  return (
    <header className="fixed right-4 top-4 z-50 md:right-6 md:top-5">
      <nav className="relative ml-auto flex w-fit max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full border border-foreground/15 bg-background/75 p-1 shadow-lg backdrop-blur-xl">
        <div className="hidden items-center md:flex">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full font-normal text-foreground/75"
              onClick={() => setPagesOpen(!pagesOpen)}
              aria-expanded={pagesOpen}
            >
              Todas as páginas{" "}
              <ChevronDown className={`size-3 transition-transform ${pagesOpen ? "rotate-180" : ""}`} />
            </Button>
            {pagesOpen && (
              <div className="absolute right-0 top-11 grid min-w-56 gap-1 rounded-2xl border bg-background p-2 shadow-xl">
                <Link to="/" onClick={() => setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">
                  Início
                </Link>
                <Link to="/about" onClick={() => setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">
                  Sobre Viviane
                </Link>
                <Link
                  to="/servicos/$slug"
                  params={{ slug: "grupos" }}
                  onClick={() => setPagesOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm hover:bg-secondary"
                >
                  Para Grupos
                </Link>
                <Link
                  to="/servicos/$slug"
                  params={{ slug: "pessoas" }}
                  onClick={() => setPagesOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm hover:bg-secondary"
                >
                  Para Pessoas
                </Link>
                <Link
                  to="/servicos/$slug"
                  params={{ slug: "empresas" }}
                  onClick={() => setPagesOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm hover:bg-secondary"
                >
                  Para Empresas
                </Link>
                <Link to="/articles" onClick={() => setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">
                  Artigos
                </Link>
                <Link to="/depoimentos" onClick={() => setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">
                  Depoimentos
                </Link>
                <Link to="/podcasts" onClick={() => setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">
                  Podcast
                </Link>
              </div>
            )}
          </div>
          <Link to="/about" className="px-3 text-sm text-foreground/75">
            Sobre
          </Link>
          <Link to="/" hash="caminhos" className="px-3 text-sm text-foreground/75">
            Serviços
          </Link>
        </div>
        <Button size="sm" className="hidden rounded-full md:inline-flex" onClick={openWhatsApp}>
          Vamos conversar
        </Button>
        <button
          type="button"
          className={`menu-toggle relative grid size-9 place-items-center rounded-full md:hidden ${open ? "menu-toggle-open" : ""}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          <span className="menu-toggle-line" />
          <span className="menu-toggle-line" />
        </button>
      </nav>

      <div
        className={`mobile-menu fixed inset-0 -z-10 flex flex-col justify-center bg-background/40 px-8 backdrop-blur-2xl md:hidden ${open ? "mobile-menu-open pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <nav className="grid gap-2" aria-label="Menu principal">
          {mobileItems.map((item, i) => (
            <Link
              key={item.label}
              to={item.to}
              {...("hash" in item ? { hash: item.hash } : {})}
              onClick={() => setOpen(false)}
              className="mobile-menu-item font-display text-4xl text-foreground"
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openWhatsApp();
            }}
            className="mobile-menu-item mt-6 w-fit rounded-full bg-primary px-7 py-3.5 font-body text-base text-primary-foreground"
            style={{ transitionDelay: open ? `${120 + mobileItems.length * 70}ms` : "0ms" }}
          >
            Vamos conversar
          </button>
        </nav>
        <div
          className="mobile-menu-item mt-14 flex flex-col items-start gap-3"
          style={{ transitionDelay: open ? "680ms" : "0ms" }}
        >
          <img src={logo} alt="Viviane Brito" className="h-auto w-full max-w-[160px] object-contain" />
          <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">Psicologia e desenvolvimento</p>
        </div>
      </div>
    </header>
  );
}
