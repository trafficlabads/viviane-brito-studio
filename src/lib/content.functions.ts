import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const sessionConfig = () => ({
  password: process.env['ADMIN_SESSION_SECRET']!,
  name: "viviane-admin",
  maxAge: 60 * 60 * 12,
  cookie: { httpOnly: true, secure: process.env['NODE_ENV'] === "production", sameSite: "lax" as const, path: "/" },
});
type AdminSession = { admin?: boolean };
const safeEqual = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  return session.data.admin === true;
}
async function adminClient() { return (await import("@/integrations/supabase/client.server")).supabaseAdmin; }

export const loginAdmin = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ username: z.string(), password: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const expected = process.env['ADMIN_PASSWORD'];
    if (!expected || data.username !== "admin" || !safeEqual(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ admin: true });
    return { ok: true as const };
  });
export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig()); await session.clear(); return { ok: true };
});
export const getAdminStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig()); return { admin: session.data.admin === true };
});

export const getPublicContent = createServerFn({ method: "GET" }).handler(async () => {
  const db = await adminClient();
  const [{ data: categories }, { data: articles }, { data: episodes }, { data: testimonials }, { data: services }] = await Promise.all([
    db.from("article_categories").select("id,name,slug").order("name"),
    db.from("articles").select("id,title,slug,excerpt,content,cover_url,published_at,category_id,article_categories(name,slug)").eq("published", true).order("published_at", { ascending: false }),
    db.from("podcast_episodes").select("*").eq("published", true).order("published_at", { ascending: false }),
    db.from("testimonials").select("*").eq("published", true).order("order_index"),
    db.from("service_pages").select("*").eq("published", true).order("order_index"),
  ]);
  return { categories: categories ?? [], articles: articles ?? [], episodes: episodes ?? [], testimonials: testimonials ?? [], services: services ?? [] };
});

export const getAdminContent = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await requireAdmin())) {
    return { authorized: false as const, categories: [], articles: [], episodes: [], messages: [], testimonials: [], services: [] };
  }
  const db = await adminClient();
  const [{ data: categories }, { data: articles }, { data: episodes }, { data: messages }, { data: testimonials }, { data: services }] = await Promise.all([
    db.from("article_categories").select("*").order("name"), db.from("articles").select("*").order("created_at", { ascending: false }),
    db.from("podcast_episodes").select("*").order("created_at", { ascending: false }), db.from("contact_messages").select("*").order("created_at", { ascending: false }),
    db.from("testimonials").select("*").order("order_index"), db.from("service_pages").select("*").order("order_index"),
  ]);
  return { authorized: true as const, categories: categories ?? [], articles: articles ?? [], episodes: episodes ?? [], messages: messages ?? [], testimonials: testimonials ?? [], services: services ?? [] };
});

const testimonialSchema = z.object({ id: z.string().uuid().optional(), name: z.string().min(2), context: z.string(), quote: z.string(), content: z.string(), cover_url: z.string().nullable(), published: z.boolean(), order_index: z.number() });
export const saveTestimonial = createServerFn({ method: "POST" }).inputValidator((d) => testimonialSchema.parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const { id: _id, ...fields } = data; const payload = { ...fields, slug: slugify(data.name) || `depoimento-${Date.now()}` };
  const result = data.id ? await db.from("testimonials").update(payload).eq("id", data.id) : await db.from("testimonials").insert(payload);
  if (result.error) throw new Error(result.error.message); return { ok: true };
});
export const deleteTestimonial = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const { error } = await db.from("testimonials").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true };
});
const serviceSchema = z.object({ id: z.string().uuid().optional(), slug: z.string().min(2), title: z.string().min(2), subtitle: z.string(), intro: z.string(), content: z.string(), cover_url: z.string().nullable(), cta_label: z.string(), published: z.boolean(), order_index: z.number() });
export const saveService = createServerFn({ method: "POST" }).inputValidator((d) => serviceSchema.parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const { id: _id, ...fields } = data;
  const result = data.id ? await db.from("service_pages").update(fields).eq("id", data.id) : await db.from("service_pages").insert(fields);
  if (result.error) throw new Error(result.error.message); return { ok: true };
});


const slugify = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const saveCategory = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ id: z.string().uuid().optional(), name: z.string().min(2).max(80) }).parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const payload = { name: data.name, slug: slugify(data.name) };
  const result = data.id ? await db.from("article_categories").update(payload).eq("id", data.id) : await db.from("article_categories").insert(payload);
  if (result.error) throw new Error(result.error.message); return { ok: true };
});
export const deleteCategory = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const { error } = await db.from("article_categories").delete().eq("id", data.id); if (error) throw new Error("Esta categoria está em uso ou não pode ser excluída."); return { ok: true };
});
const articleSchema = z.object({ id: z.string().uuid().optional(), title: z.string().min(3), excerpt: z.string(), content: z.string().min(10), cover_url: z.string().nullable(), category_id: z.string().uuid().nullable(), published: z.boolean() });
export const saveArticle = createServerFn({ method: "POST" }).inputValidator((d) => articleSchema.parse(d)).handler(async ({ data }) => {
  await requireAdmin(); const db = await adminClient(); const { id: _id, ...fields } = data; const payload = { ...fields, slug: slugify(data.title), published_at: data.published ? new Date().toISOString() : null };
  const result = data.id ? await db.from("articles").update(payload).eq("id", data.id) : await db.from("articles").insert(payload); if (result.error) throw new Error(result.error.message); return { ok: true };
});
export const deleteArticle = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(async ({ data }) => { await requireAdmin(); const db = await adminClient(); const { error } = await db.from("articles").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true }; });
const episodeSchema = z.object({ id: z.string().uuid().optional(), title: z.string().min(3), description: z.string(), cover_url: z.string().nullable(), youtube_url: z.string().nullable(), spotify_url: z.string().nullable(), soundcloud_url: z.string().nullable(), youtube_music_url: z.string().nullable(), amazon_music_url: z.string().nullable(), apple_music_url: z.string().nullable(), episode_number: z.number().nullable(), published: z.boolean() });
export const saveEpisode = createServerFn({ method: "POST" }).inputValidator((d) => episodeSchema.parse(d)).handler(async ({ data }) => { await requireAdmin(); const db = await adminClient(); const { id: _id, ...fields } = data; const payload = { ...fields, slug: slugify(data.title), published_at: data.published ? new Date().toISOString() : null }; const result = data.id ? await db.from("podcast_episodes").update(payload).eq("id", data.id) : await db.from("podcast_episodes").insert(payload); if (result.error) throw new Error(result.error.message); return { ok: true }; });
export const deleteEpisode = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d)).handler(async ({ data }) => { await requireAdmin(); const db = await adminClient(); const { error } = await db.from("podcast_episodes").delete().eq("id", data.id); if (error) throw new Error(error.message); return { ok: true }; });
export const sendContact = createServerFn({ method: "POST" }).inputValidator((d) => z.object({ name: z.string().min(2).max(120), email: z.string().email(), phone: z.string().max(30).optional(), message: z.string().min(10).max(5000) }).parse(d)).handler(async ({ data }) => { const db = await adminClient(); const { error } = await db.from("contact_messages").insert({ ...data, phone: data.phone || null }); if (error) throw new Error(error.message); return { ok: true }; });

export const getLatestEpisode = createServerFn({ method: "GET" }).handler(async () => {
  const db = await adminClient();
  const { data } = await db.from("podcast_episodes").select("*").eq("published", true).order("published_at", { ascending: false }).limit(1);
  return data?.[0] ?? null;
});

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ filename: z.string().min(1), dataUrl: z.string().min(10) }).parse(d))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await adminClient();
    const [meta, base64] = data.dataUrl.split(",");
    const contentType = meta?.match(/data:([^;]+)/)?.[1] ?? "image/jpeg";
    const bytes = Uint8Array.from(atob(base64 ?? ""), (c) => c.charCodeAt(0));
    const ext = (data.filename.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `uploads/${Date.now()}-${slugify(data.filename.replace(/\.[^.]+$/, "")) || "imagem"}.${ext}`;
    const { error } = await db.storage.from("content-media").upload(path, bytes, { contentType, upsert: true });
    if (error) throw new Error(error.message);
    return { url: db.storage.from("content-media").getPublicUrl(path).data.publicUrl };
  });
