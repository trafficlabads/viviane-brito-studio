/**
 * Applies editorial seed (see supabase/migrations/20260930193000_seed_editorial_content.sql)
 * using SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env (local only).
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(join(root, ".env"), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      const key = line.slice(0, i);
      let val = line.slice(i + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      return [key, val];
    }),
);

const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const { data: cats } = await db.from("article_categories").select("id,slug");
const catBySlug = Object.fromEntries((cats ?? []).map((c) => [c.slug, c.id]));
const reflexivo = catBySlug["texto-reflexivo"];
const artigo = catBySlug["artigo"];
if (!reflexivo || !artigo) {
  console.error("Missing article categories; run base migrations first.");
  process.exit(1);
}

const articles = [
  {
    title: "Toda mudança começa quando escutamos o que a nossa história quer dizer",
    slug: "toda-mudanca-comeca-quando-escutamos",
    excerpt: "Antes de escolher um novo rumo, muitas vezes precisamos ouvir com mais cuidado aquilo que já vivemos.",
    content:
      "<p>Transformações sustentáveis raramente começam com uma decisão apressada. Elas começam quando damos espaço para a nossa história ser escutada — com respeito, sem julgamento e sem a pressa de “resolver” tudo de uma vez.</p><p>Esse movimento de escuta abre margem para reconhecer padrões, desejos e limites. A partir daí, novas escolhas deixam de ser fuga e passam a ser construção.</p>",
    category_id: reflexivo,
    published: true,
    published_at: new Date(Date.now() - 12 * 864e5).toISOString(),
  },
  {
    title: "Escolher um novo caminho também é uma forma de voltar para si",
    slug: "escolher-um-novo-caminho",
    excerpt: "Mudanças de rota — na carreira ou na vida — podem ser gestos de cuidado e coerência, não apenas de ruptura.",
    content:
      "<p>Quando falamos em “novo caminho”, é comum imaginar algo distante do que somos. Mas, muitas vezes, escolher diferente é voltar a si: realinhar tempo, energia e valores com o que faz sentido hoje.</p><p>Esse retorno não é regressão. É a possibilidade de viver escolhas mais conscientes, ancoradas no que aprendemos ao longo do percurso.</p>",
    category_id: artigo,
    published: true,
    published_at: new Date(Date.now() - 8 * 864e5).toISOString(),
  },
  {
    title: "Há encontros que ampliam o olhar e transformam possibilidades",
    slug: "ha-encontros-que-ampliam-o-olhar",
    excerpt: "Relações — terapia, grupos, conversas — podem revelar caminhos que antes pareciam fechados.",
    content:
      "<p>Alguns encontros não entregam respostas prontas. Eles ampliam o olhar: trazem perguntas melhores, novas referências e a sensação de que há mais possibilidade do que imaginávamos.</p><p>Esse tipo de experiência favorece movimentos mais livres — na vida pessoal, nas relações e no trabalho.</p>",
    category_id: reflexivo,
    published: true,
    published_at: new Date(Date.now() - 3 * 864e5).toISOString(),
  },
];

for (const row of articles) {
  const { error } = await db.from("articles").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("articles:", error.message);
    process.exit(1);
  }
}

const episodes = [
  {
    title: "Quando a carreira pede uma pausa para escuta",
    slug: "quando-a-carreira-pede-uma-pausa-para-escuta",
    description:
      "Conversa sobre transições profissionais, escuta interior e escolhas mais coerentes com a história de cada pessoa.",
    episode_number: 1,
    published: true,
    published_at: new Date(Date.now() - 20 * 864e5).toISOString(),
  },
  {
    title: "Propósito além da produtividade",
    slug: "proposito-alem-da-produtividade",
    description: "Reflexões sobre sentido, ritmo e formas de estar no trabalho sem se perder de si.",
    episode_number: 2,
    published: true,
    published_at: new Date(Date.now() - 14 * 864e5).toISOString(),
  },
  {
    title: "Histórias que abrem caminhos",
    slug: "historias-que-abrem-caminhos",
    description: "Como narrativas pessoais — quando acolhidas — revelam recursos e novas direções.",
    episode_number: 3,
    published: true,
    published_at: new Date(Date.now() - 6 * 864e5).toISOString(),
  },
];

for (const row of episodes) {
  const { error } = await db.from("podcast_episodes").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("podcast_episodes:", error.message);
    process.exit(1);
  }
}

const testimonials = [
  {
    name: "Relato (a confirmar)",
    slug: "relato-jornada-em-grupo",
    context: "Jornada em grupo · texto ilustrativo",
    quote: "O grupo criou um espaço para olhar minha história com mais respeito.",
    content:
      "<p><strong>Texto ilustrativo.</strong> Substituir no painel administrativo por depoimento real, com autorização de quem depõe. Não constitui relato clínico.</p>",
    published: true,
    order_index: 1,
  },
  {
    name: "Relato (a confirmar)",
    slug: "relato-transicao-de-carreira",
    context: "Transição de carreira · texto ilustrativo",
    quote: 'Pude reorganizar minhas escolhas sem a pressa de “dar certo” de imediato.',
    content:
      "<p><strong>Texto ilustrativo.</strong> Substituir no painel administrativo por depoimento real, com autorização de quem depõe. Não constitui relato clínico.</p>",
    published: true,
    order_index: 2,
  },
];

for (const row of testimonials) {
  const { error } = await db.from("testimonials").upsert(row, { onConflict: "slug" });
  if (error) {
    console.error("testimonials:", error.message);
    process.exit(1);
  }
}

const { count: ac } = await db.from("articles").select("*", { count: "exact", head: true }).eq("published", true);
const { count: ep } = await db.from("podcast_episodes").select("*", { count: "exact", head: true }).eq("published", true);
const { count: te } = await db.from("testimonials").select("*", { count: "exact", head: true }).eq("published", true);
console.log(`Seed OK — articles: ${ac}, episodes: ${ep}, testimonials: ${te}`);
