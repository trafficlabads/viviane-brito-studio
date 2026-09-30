# Handoff — site para conta do cliente

Checklist para migrar **GitHub + Supabase + Vercel** quando o cliente for leigo e passar acesso (convite ou sessão no browser).

## O que pedir ao cliente (texto pronto)

> Crie três contas gratuitas com o **mesmo e-mail** (facilita): GitHub, Supabase e Vercel.  
> Me envie **convite por e-mail** (não senha) para entrar na conta ou no projeto.  
> Se preferir, faça login no computador e me avise quando estiver logado — eu configuro com você na tela.

**Evitar:** senha no WhatsApp. **Preferir:** convite GitHub Collaborator, Supabase org member, Vercel team invite.

---

## Ordem da migração (agente no browser)

1. **Supabase** — criar projeto (região `sa-east-1` se BR), aplicar migrations de `supabase/migrations/`, copiar URL + publishable + service_role.
2. **GitHub** — transferir repo ou push para repo novo do cliente; confirmar `main` e `.env` fora do git.
3. **Vercel** — importar repo, env vars (tabela abaixo), deploy production, domínio opcional.
4. **Lovable** (se usar) — Cloud → conectar Supabase do cliente → Publish.
5. **Teste** — home, `/admin`, upload de imagem, artigos/podcasts.
6. **Revogar** — remover acesso temporário do dev na conta do cliente (combinar antes).

---

## Variáveis na Vercel (Production + Preview)

| Nome | Origem |
|------|--------|
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_PUBLISHABLE_KEY` | publishable ou anon |
| `SUPABASE_SERVICE_ROLE_KEY` | **secret** — só servidor |
| `VITE_SUPABASE_URL` | igual `SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | igual publishable |
| `ADMIN_PASSWORD` | definir com cliente |
| `ADMIN_SESSION_SECRET` | 32+ bytes aleatórios |

Build: `npm run build` (Nitro preset Vercel).

---

## Migrations Supabase

Arquivos em `supabase/migrations/` (ordem pelo prefixo de data).  
Com CLI logado na conta do cliente: `supabase link` + `supabase db push`.  
Sem CLI: colar SQL no SQL Editor na ordem dos arquivos.

---

## Projeto Viviane (referência atual)

- **GitHub (cliente):** https://github.com/trafficlabads/viviane-brito-studio — `main` em `2a415a6` (push concluído).
- **Site (production — Traffic Lab):** https://viviane-brito-studio-olive.vercel.app — Supabase `ugpmsthyjzuvlofratdo`.
- **Site (provisório — conta Richard):** https://viviane-brito-studio.vercel.app — pode desativar ou manter só para preview do dev.
- **Supabase (Traffic Lab):** ref **`ugpmsthyjzuvlofratdo`** · URL `https://ugpmsthyjzuvlofratdo.supabase.co`
- Rodar migrations em `supabase/migrations/` (ordem pelo nome) no SQL Editor ou `supabase link` + `supabase db push`.
- **Vercel (Traffic Lab):** projeto [viviane-brito-studio](https://vercel.com/traffic-lab/viviane-brito-studio) · conta `trafficlabads@gmail.com` · Git `trafficlabads/viviane-brito-studio`.
- Lovable (se usar): mesmas env vars com URL e chaves deste Supabase.
