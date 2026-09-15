import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const links = [{ to: "/", hash: "caminhos", label: "Serviços" }, { to: "/", hash: "artigos", label: "Artigos" }, { to: "/podcasts", label: "Podcast" }] as const;
  return <header className="fixed inset-x-0 top-5 z-50 px-4"><nav className="relative mx-auto grid w-fit max-w-[calc(100vw-2rem)] grid-cols-[auto_auto] items-center rounded-full border border-foreground/15 bg-background/75 p-1 shadow-lg backdrop-blur-xl md:flex">
    <Link to="/" aria-label="Viviane Brito — início" className="menu-monogram grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-display text-sm text-primary">VB</Link>
    <div className="hidden items-center md:flex"><div className="relative"><Button variant="ghost" size="sm" className="rounded-full font-normal text-foreground/75" onClick={()=>setPagesOpen(!pagesOpen)} aria-expanded={pagesOpen}>Todas as páginas <ChevronDown className={`size-3 transition-transform ${pagesOpen?"rotate-180":""}`}/></Button>{pagesOpen&&<div className="absolute left-0 top-11 grid min-w-52 gap-1 rounded-2xl border bg-background p-2 shadow-xl"><Link to="/" onClick={()=>setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">Início</Link><Link to="/about" onClick={()=>setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">Sobre Viviane</Link><Link to="/articles" onClick={()=>setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">Todos os artigos</Link><Link to="/podcasts" onClick={()=>setPagesOpen(false)} className="rounded-xl px-4 py-3 text-sm hover:bg-secondary">Todos os episódios</Link></div>}</div><Link to="/about" className="px-3 text-sm text-foreground/75">Sobre</Link><Link to="/" hash="caminhos" className="px-3 text-sm text-foreground/75">Serviços</Link></div>
    <Link to="/" hash="contato" className="hidden md:block"><Button size="sm" className="rounded-full">Vamos conversar</Button></Link>
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X/> : <Menu/>}</Button>
    {open && <div className="absolute left-0 right-0 top-14 grid min-w-72 gap-1 rounded-2xl border bg-background p-3 shadow-xl md:hidden"><Link to="/" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3">Início</Link><Link to="/about" onClick={() => setOpen(false)} className="rounded-xl px-3 py-3">Sobre</Link>{links.map(l => <Link key={l.label} to={l.to} {...("hash" in l ? { hash: l.hash } : {})} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3">{l.label}</Link>)}<Link to="/" hash="contato" onClick={() => setOpen(false)} className="rounded-xl bg-primary px-3 py-3 text-primary-foreground">Vamos conversar</Link></div>}
  </nav></header>;
}
