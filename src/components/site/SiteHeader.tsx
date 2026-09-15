import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/viviane-logo.png.asset.json";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [{ to: "/", hash: "caminhos", label: "Serviços" }, { to: "/", hash: "artigos", label: "Artigos" }, { to: "/podcasts", label: "Podcast" }] as const;
  return <header className="fixed inset-x-0 top-4 z-50 px-4"><nav className="mx-auto flex w-fit max-w-[calc(100vw-2rem)] items-center rounded-full border border-foreground/10 bg-background/80 p-1.5 shadow-lg backdrop-blur-xl">
    <Link to="/" aria-label="Viviane Brito — início" className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary"><img src={logo.url} alt="" className="size-6 object-contain"/></Link>
    <div className="hidden items-center gap-5 px-3 md:flex"><span className="flex items-center gap-1 text-sm text-foreground/75">Todas as páginas <ChevronDown className="size-3"/></span><Link to="/about" className="story-link text-sm text-foreground/75">Sobre</Link>{links.map(l => <Link key={l.label} to={l.to} hash={"hash" in l ? l.hash : undefined} className="story-link text-sm text-foreground/75">{l.label}</Link>)}</div>
    <Link to="/" hash="contato" className="hidden md:block"><Button size="sm" className="rounded-full">Vamos conversar</Button></Link>
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X/> : <Menu/>}</Button>
    {open && <div className="absolute left-4 right-4 top-16 grid gap-2 rounded-lg border bg-background p-4 shadow-xl md:hidden"><Link to="/about" onClick={() => setOpen(false)} className="py-3 text-lg">Sobre</Link>{links.map(l => <Link key={l.label} to={l.to} hash={"hash" in l ? l.hash : undefined} onClick={() => setOpen(false)} className="py-3 text-lg">{l.label}</Link>)}<Link to="/" hash="contato" onClick={() => setOpen(false)} className="py-3 text-lg">Vamos conversar</Link></div>}
  </nav></header>;
}
