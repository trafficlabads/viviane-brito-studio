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