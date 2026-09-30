import { Link } from "@tanstack/react-router";
import logo from "@/assets/viviane-logo-purple.png";

export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-secondary px-6 pb-4 pt-16 text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <img src={logo} alt="Viviane Brito" width={736} height={442} className="mb-5 h-auto w-full max-w-[200px]" />
          <p className="max-w-sm text-sm leading-6 opacity-70">
            Psicologia, desenvolvimento humano, carreira e caminhos construídos com presença.
          </p>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Páginas</p>
          <div className="grid gap-2 text-sm opacity-70">
            <Link to="/">Início</Link>
            <Link to="/about">Sobre</Link>
            <Link to="/articles">Artigos</Link>
            <Link to="/podcasts">Podcast</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold">Contato</p>
          <p className="text-sm opacity-70">CRP: a preencher</p>
          <a
            href="https://wa.me/5511933441809"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm opacity-70 hover:opacity-100"
          >
            +55 11 93344-1809
          </a>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-col gap-4 border-t border-secondary-foreground/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs opacity-60">Psicologia e desenvolvimento</span>
        <div className="flex flex-wrap items-center gap-4 text-xs opacity-60">
          <span>© 2026 Viviane Brito</span>
          <Link to="/admin" className="rounded px-2 py-1 opacity-40 hover:bg-secondary-foreground/10 hover:opacity-100">
            ADM
          </Link>
        </div>
      </div>
    </footer>
  );
}
