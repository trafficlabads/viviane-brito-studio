-- ===== 20260326180000_create_viviane_content.sql =====
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.article_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.article_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.article_categories TO authenticated;
GRANT ALL ON public.article_categories TO service_role;
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON public.article_categories FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text,
  category_id uuid REFERENCES public.article_categories(id) ON DELETE RESTRICT,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT TO anon, authenticated USING (published = true);
CREATE INDEX articles_published_at_idx ON public.articles (published, published_at DESC);
CREATE INDEX articles_category_id_idx ON public.articles (category_id);

CREATE TABLE public.podcast_episodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  cover_url text,
  youtube_url text,
  spotify_url text,
  soundcloud_url text,
  youtube_music_url text,
  amazon_music_url text,
  apple_music_url text,
  published boolean NOT NULL DEFAULT false,
  episode_number integer,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.podcast_episodes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.podcast_episodes TO authenticated;
GRANT ALL ON public.podcast_episodes TO service_role;
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published episodes" ON public.podcast_episodes FOR SELECT TO anon, authenticated USING (published = true);
CREATE INDEX podcast_published_at_idx ON public.podcast_episodes (published, published_at DESC);

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (char_length(name) BETWEEN 2 AND 120 AND char_length(email) BETWEEN 5 AND 254 AND char_length(message) BETWEEN 10 AND 5000);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER articles_set_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER podcast_set_updated_at BEFORE UPDATE ON public.podcast_episodes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ===== 20260326180001_content_media_bucket.sql =====
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-media', 'content-media', true)
ON CONFLICT (id) DO NOTHING;

-- ===== 20260326180002_testimonials_and_service_pages.sql =====
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  context text NOT NULL DEFAULT '',
  quote text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text,
  published boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.service_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  intro text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_url text,
  cta_label text NOT NULL DEFAULT 'Vamos conversar',
  published boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_pages TO authenticated;
GRANT ALL ON public.service_pages TO service_role;
ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published service pages" ON public.service_pages FOR SELECT TO anon, authenticated USING (published = true);
CREATE TRIGGER service_pages_updated_at BEFORE UPDATE ON public.service_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
-- ===== 20260326180003_content_media_policies.sql =====
CREATE POLICY "Public can view content media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'content-media');
CREATE POLICY "Authenticated users can add content media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'content-media');
CREATE POLICY "Authenticated users can update content media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'content-media') WITH CHECK (bucket_id = 'content-media');
CREATE POLICY "Authenticated users can delete content media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'content-media');
-- ===== 20260326180004_seed_defaults.sql =====
INSERT INTO public.article_categories (name, slug) VALUES
  ('Artigo', 'artigo'),
  ('Texto reflexivo', 'texto-reflexivo')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.service_pages (slug, title, subtitle, intro, order_index) VALUES
  ('grupos', 'Para Grupos', 'Jornadas e processos em grupo', 'Espaço para autoconhecimento, troca e desenvolvimento.', 1),
  ('pessoas', 'Para Pessoas', 'Psicoterapia e carreira', 'Acompanhamento para diferentes momentos da vida pessoal e profissional.', 2),
  ('empresas', 'Para Empresas', 'Desenvolvimento humano nas organizações', 'Palestras, treinamentos e projetos integrados ao contexto organizacional.', 3)
ON CONFLICT (slug) DO NOTHING;

