import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { getPublicContent } from "@/lib/content.functions";
import portrait from "@/assets/viviane-portrait.jpg";

export const Route = createFileRoute("/servicos/$slug")({
  loader: async ({ params }) => {
    const data = await getPublicContent();
    const service = data.services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service, services: data.services };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.service.title} — Viviane Brito` : "Página não encontrada" },
    { name: "description", content: loaderData?.service.intro || loaderData?.service.subtitle || "Caminhos de desenvolvimento com Viviane Brito." },
    { property: "og:title", content: loaderData?.service.title || "Caminhos" },
    { property: "og:description", content: loaderData?.service.intro || "Caminhos de desenvolvimento com Viviane Brito." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
  ] }),
  component: ServicePage,
});

function ServicePage() {
  const { service, services } = Route.useLoaderData();
  const others = services.filter((s) => s.slug !== service.slug);
  return <SiteLayout>
    <section className="page-hero">
      <p className="eyebrow text-primary">{service.subtitle}</p>
      <h1 className="page-title">{service.title}</h1>
      <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground">{service.intro}</p>
    </section>
    <section className="section pt-0">
      <Reveal className="assemble grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
        <div className="prose-viviane whitespace-pre-wrap !px-0">{service.content}</div>
        <aside className="rounded-lg border bg-secondary p-8">
          <img src={service.cover_url || portrait} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
          <p className="mt-7 font-display text-3xl">{service.cta_label}</p>
          <Link to="/" hash="contato" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground">Enviar mensagem <ArrowUpRight className="size-4" /></Link>
        </aside>
      </Reveal>
    </section>
    {others.length > 0 && <section className="section bg-secondary pt-0">
      <Reveal><p className="eyebrow text-primary">Outros caminhos</p></Reveal>
      <Reveal className="assemble mt-8 grid gap-2 md:grid-cols-2">
        {others.map((s) => <Link key={s.id} to="/servicos/$slug" params={{ slug: s.slug }} className="testimonial-card block rounded-lg border bg-background p-8">
          <h2 className="font-display text-4xl">{s.title}</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{s.intro}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Conhecer <ArrowUpRight className="size-4" /></span>
        </Link>)}
      </Reveal>
    </section>}
  </SiteLayout>;
}
