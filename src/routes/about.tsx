import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/Layout";
import { Reveal } from "@/components/site/Reveal";
import portraitAsset from "@/assets/viviane-portrait.png.asset.json";

const portrait = portraitAsset.url;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre Viviane Brito" },
      { name: "description", content: "Conheça a trajetória e a forma de trabalhar de Viviane Brito." },
      { property: "og:title", content: "Sobre Viviane Brito" },
      { property: "og:description", content: "Uma caminhada construída entre pessoas, organizações e histórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <section className="page-hero">
        <p className="eyebrow text-primary">Sobre</p>
        <h1 className="page-title">Uma caminhada construída entre pessoas, organizações e histórias.</h1>
      </section>
      <section className="section pt-0">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <img
              src={portrait}
              alt="Retrato editorial representando Viviane Brito"
              width={1280}
              height={1600}
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
          </Reveal>
          <Reveal className="space-y-6 text-lg leading-8 text-muted-foreground">
            <p>Minha trajetória profissional sempre teve as pessoas como ponto de partida.</p>
            <p>
              Durante mais de duas décadas, vivi o cotidiano das organizações, acompanhando pessoas em diferentes momentos de suas
              trajetórias profissionais e conhecendo de perto os desafios que atravessam o trabalho, as relações, as escolhas e o
              desenvolvimento.
            </p>
            <p>A Psicologia ampliou esse olhar.</p>
            <p>
              Ao longo dos anos, fui me aproximando de diferentes abordagens de compreensão do ser humano, que me permitiram olhar não
              apenas para aquilo que fazemos, mas para quem somos, para as histórias que carregamos e para os sentidos que construímos ao
              longo da vida.
            </p>
            <p>
              Essa integração entre Psicologia, experiência organizacional e desenvolvimento humano é o que sustenta minha atuação hoje.
            </p>
            <p>
              Trabalho com pessoas, grupos e organizações, respeitando a singularidade de cada contexto e utilizando diferentes abordagens
              como recursos para compreender (nunca para definir) quem está diante de mim.
            </p>
            <blockquote className="border-l-2 border-primary pl-6 font-display text-3xl text-primary">
              Toda pessoa é muito maior do que qualquer momento que esteja vivendo.
            </blockquote>
            <p>Formações, número do CRP e demais informações profissionais serão adicionados após validação.</p>
          </Reveal>
        </div>
      </section>
      <section className="section bg-secondary">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="section-title">Um olhar construído a partir de diferentes perspectivas</h2>
          <div className="mt-8 space-y-6 text-lg leading-8 text-muted-foreground">
            <p>
              Meu trabalho dialoga com diferentes perspectivas da Psicologia e do desenvolvimento humano, entre elas o Psicodrama, a
              Psicologia Analítica, a Psicologia Transpessoal, o Pensamento Sistêmico e o Coaching.
            </p>
            <p>
              Não parto de uma única lente para compreender pessoas. Integro diferentes perspectivas de acordo com cada história, contexto e
              necessidade, preservando aquilo que considero essencial: a singularidade de quem está diante de mim.
            </p>
          </div>
        </Reveal>
      </section>
    </SiteLayout>
  );
}
