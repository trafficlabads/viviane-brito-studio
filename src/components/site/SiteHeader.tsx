import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/viviane-logo.png.asset.json";
import { Button } from "@/components/ui/button";
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [{ to: "/about", label: "Sobre" }, { to: "/articles", label: "Artigos" }, { to: "/podcasts", label: "Podcast" }] as const;
  return <header className="fixed inset-x-0 top-4 z-50 px-4"><nav className="mx-auto flex max-w-4xl items-center justify-between rounded-full border border-foreground/10 bg-background/80 px-3 py-2 shadow-lg backdrop-blur-xl">
    <Link to="/" aria-label="Viviane Brito — início" className="flex items-center gap-2"><img src={logo.url} alt="" className="h-8 w-auto max-w-36 object-contain object-left"/><span className="hidden text-sm font-medium sm:inline">Viviane Brito</span></Link>
    <div className="hidden items-center gap-6 md:flex">{links.map(l => <Link key={l.to} to={l.to} className="story-link text-sm text-foreground/75">{l.label}</Link>)}<Link to="/" hash="contato"><Button size="sm">Vamos conversar</Button></Link></div>
    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X/> : <Menu/>}</Button>
    {open && <div className="absolute left-4 right-4 top-16 grid gap-2 rounded-lg border bg-background p-4 shadow-xl md:hidden">{links.map(l => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 text-lg">{l.label}</Link>)}<Link to="/" hash="contato" onClick={() => setOpen(false)} className="py-3 text-lg">Vamos conversar</Link></div>}
  </nav></header>;
}
