-- Conteúdo editorial inicial (artigos, podcast, depoimentos ilustrativos).
-- Depoimentos: textos genéricos — substituir nomes e relatos reais no /admin.

INSERT INTO public.articles (title, slug, excerpt, content, category_id, published, published_at)
VALUES
  (
    'Toda mudança começa quando escutamos o que a nossa história quer dizer',
    'toda-mudanca-comeca-quando-escutamos',
    'Antes de escolher um novo rumo, muitas vezes precisamos ouvir com mais cuidado aquilo que já vivemos.',
    '<p>Transformações sustentáveis raramente começam com uma decisão apressada. Elas começam quando damos espaço para a nossa história ser escutada — com respeito, sem julgamento e sem a pressa de “resolver” tudo de uma vez.</p><p>Esse movimento de escuta abre margem para reconhecer padrões, desejos e limites. A partir daí, novas escolhas deixam de ser fuga e passam a ser construção.</p>',
    (SELECT id FROM public.article_categories WHERE slug = 'texto-reflexivo' LIMIT 1),
    true,
    now() - interval '12 days'
  ),
  (
    'Escolher um novo caminho também é uma forma de voltar para si',
    'escolher-um-novo-caminho',
    'Mudanças de rota — na carreira ou na vida — podem ser gestos de cuidado e coerência, não apenas de ruptura.',
    '<p>Quando falamos em “novo caminho”, é comum imaginar algo distante do que somos. Mas, muitas vezes, escolher diferente é voltar a si: realinhar tempo, energia e valores com o que faz sentido hoje.</p><p>Esse retorno não é regressão. É a possibilidade de viver escolhas mais conscientes, ancoradas no que aprendemos ao longo do percurso.</p>',
    (SELECT id FROM public.article_categories WHERE slug = 'artigo' LIMIT 1),
    true,
    now() - interval '8 days'
  ),
  (
    'Há encontros que ampliam o olhar e transformam possibilidades',
    'ha-encontros-que-ampliam-o-olhar',
    'Relações — terapia, grupos, conversas — podem revelar caminhos que antes pareciam fechados.',
    '<p>Alguns encontros não entregam respostas prontas. Eles ampliam o olhar: trazem perguntas melhores, novas referências e a sensação de que há mais possibilidade do que imaginávamos.</p><p>Esse tipo de experiência favorece movimentos mais livres — na vida pessoal, nas relações e no trabalho.</p>',
    (SELECT id FROM public.article_categories WHERE slug = 'texto-reflexivo' LIMIT 1),
    true,
    now() - interval '3 days'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category_id = EXCLUDED.category_id,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at,
  updated_at = now();

INSERT INTO public.podcast_episodes (title, slug, description, episode_number, published, published_at)
VALUES
  (
    'Quando a carreira pede uma pausa para escuta',
    'quando-a-carreira-pede-uma-pausa-para-escuta',
    'Conversa sobre transições profissionais, escuta interior e escolhas mais coerentes com a história de cada pessoa.',
    1,
    true,
    now() - interval '20 days'
  ),
  (
    'Propósito além da produtividade',
    'proposito-alem-da-produtividade',
    'Reflexões sobre sentido, ritmo e formas de estar no trabalho sem se perder de si.',
    2,
    true,
    now() - interval '14 days'
  ),
  (
    'Histórias que abrem caminhos',
    'historias-que-abrem-caminhos',
    'Como narrativas pessoais — quando acolhidas — revelam recursos e novas direções.',
    3,
    true,
    now() - interval '6 days'
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  episode_number = EXCLUDED.episode_number,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at,
  updated_at = now();

INSERT INTO public.testimonials (name, slug, context, quote, content, published, order_index)
VALUES
  (
    'Relato (a confirmar)',
    'relato-jornada-em-grupo',
    'Jornada em grupo · texto ilustrativo',
    'O grupo criou um espaço para olhar minha história com mais respeito.',
    '<p><strong>Texto ilustrativo.</strong> Substituir no painel administrativo por depoimento real, com autorização de quem depõe. Não constitui relato clínico.</p>',
    true,
    1
  ),
  (
    'Relato (a confirmar)',
    'relato-transicao-de-carreira',
    'Transição de carreira · texto ilustrativo',
    'Pude reorganizar minhas escolhas sem a pressa de “dar certo” de imediato.',
    '<p><strong>Texto ilustrativo.</strong> Substituir no painel administrativo por depoimento real, com autorização de quem depõe. Não constitui relato clínico.</p>',
    true,
    2
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  context = EXCLUDED.context,
  quote = EXCLUDED.quote,
  content = EXCLUDED.content,
  published = EXCLUDED.published,
  order_index = EXCLUDED.order_index,
  updated_at = now();
