import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { getPublicContent } from "@/lib/content.functions";
import articlePath from "@/assets/article-path.jpg";
import articleCareer from "@/assets/article-career.jpg";
import articleConnection from "@/assets/article-connection.jpg";

const fallbacks = [articleConnection, articlePath, articleCareer];

export const Route = createFileRoute("/depoimentos/")({
  loader: () => getPublicContent(),
  head: () => ({ meta: [
    { title: "Depoimentos — Viviane Brito" },
    { name: "description", content: "Relatos de pessoas e organizações que caminharam com Viviane Brito em palestras, grupos e processos de desenvolvimento." },
    { property: "og:title", content: "Depoimentos — Viviane Brito" },
    { property: "og:description", content: "Histórias reais de quem escolheu construir novos caminhos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { testimonials } = Route.useLoaderData();
  return <SiteLayout>
    <section className="page-hero">
      <p className="eyebrow text-primary">Depoimentos</p>
      <h1 className="page-title">Histórias reais de quem escolheu construir novos caminhos.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">Relatos de trabalhos não clínicos: palestras, grupos, treinamentos e processos de desenvolvimento.</p>
    </section>
    <section className="section pt-0">
      {testimonials.length ? <Reveal className="assemble grid gap-2 md:grid-cols-2">
        {testimonials.map((t, i) => <Link key={t.id} to="/depoimentos/$slug" params={{ slug: t.slug }} className="testimonial-card relative block min-h-[420px] overflow-hidden rounded-lg text-primary-foreground">
          <img src={t.cover_url || fallbacks[i % fallbacks.length]} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-article-overlay" />
          <blockquote className="absolute inset-x-0 bottom-0 p-8">
            <span className="text-6xl leading-none">“</span>
            <p className="-mt-3 font-display text-3xl leading-tight">{t.quote || "Depoimento a preencher."}</p>
            <footer className="mt-7 text-sm">{t.name}{t.context && ` · ${t.context}`}</footer>
            <span className="testimonial-more mt-4 inline-flex text-sm font-medium">Ler o depoimento completo →</span>
          </blockquote>
        </Link>)}
      </Reveal> : <div className="empty-state"><p className="font-display text-4xl">Os depoimentos estão sendo preparados.</p></div>}
    </section>
  </SiteLayout>;
}
