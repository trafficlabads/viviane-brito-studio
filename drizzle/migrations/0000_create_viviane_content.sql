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