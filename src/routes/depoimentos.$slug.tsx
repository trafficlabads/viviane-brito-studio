import { RichContent } from "@/components/site/RichContent";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import { getPublicContent } from "@/lib/content.functions";

export const Route = createFileRoute("/depoimentos/$slug")({
  loader: async ({ params }) => {
    const data = await getPublicContent();
    const testimonial = data.testimonials.find((t) => t.slug === params.slug);
    if (!testimonial) throw notFound();
    return testimonial;
  },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `Depoimento de ${loaderData.name} — Viviane Brito` : "Depoimento não encontrado" },
    { name: "description", content: loaderData?.quote || "Depoimento sobre o trabalho de Viviane Brito." },
    { property: "og:title", content: loaderData ? `Depoimento de ${loaderData.name}` : "Depoimento" },
    { property: "og:description", content: loaderData?.quote || "Relato de um trabalho realizado com Viviane Brito." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(loaderData ? [] : [{ name: "robots", content: "noindex" }]),
  ] }),
  component: TestimonialPage,
});

function TestimonialPage() {
  const t = Route.useLoaderData();
  return <SiteLayout>
    <article>
      <header className="page-hero pb-14">
        <Link to="/depoimentos" className="eyebrow text-primary">← Voltar aos depoimentos</Link>
        <h1 className="page-title mt-6 max-w-4xl">{t.quote || "Depoimento a preencher."}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{t.name}{t.context && ` · ${t.context}`}</p>
      </header>
      {t.cover_url && <div className="mx-auto max-w-6xl px-6"><img src={t.cover_url} alt="" className="aspect-[16/8] w-full rounded-lg object-cover" /></div>}
      <Reveal><RichContent value={t.content}/></Reveal>
    </article>
  </SiteLayout>;
}
