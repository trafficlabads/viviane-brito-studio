INSERT INTO public.article_categories (name, slug) VALUES
  ('Artigo', 'artigo'),
  ('Texto reflexivo', 'texto-reflexivo')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.service_pages (slug, title, subtitle, intro, order_index) VALUES
  ('grupos', 'Para Grupos', 'Jornadas e processos em grupo', 'Espaço para autoconhecimento, troca e desenvolvimento.', 1),
  ('pessoas', 'Para Pessoas', 'Psicoterapia e carreira', 'Acompanhamento para diferentes momentos da vida pessoal e profissional.', 2),
  ('empresas', 'Para Empresas', 'Desenvolvimento humano nas organizações', 'Palestras, treinamentos e projetos integrados ao contexto organizacional.', 3)
ON CONFLICT (slug) DO NOTHING;
