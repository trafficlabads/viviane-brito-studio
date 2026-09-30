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

- **Site (production):** https://viviane-brito-studio.vercel.app — Supabase Traffic Lab; Vercel na conta Richard até transferência GitHub + import no time **TrafficLab**.
- **Supabase (Traffic Lab):** ref **`ugpmsthyjzuvlofratdo`** · URL `https://ugpmsthyjzuvlofratdo.supabase.co`
- Rodar migrations em `supabase/migrations/` (ordem pelo nome) no SQL Editor ou `supabase link` + `supabase db push`.
- **Vercel (Traffic Lab):** conta `trafficlabads@gmail.com` — importar o repo, mesmas env vars (tabela acima), deploy production. Não usar conta pessoal do dev para production do cliente.
- **GitHub (se Vercel do cliente não enxergar `Richard-Duarte/...`):** transferir o repo para o usuário **`trafficlabads`** no GitHub (Richard aceita como collaborator depois). Time Vercel **Hobby** não permite convidar membros — por isso import cross-account falha sem transferência ou repo na mesma conta GitHub da Vercel.
- **Provisório:** deploy em `https://viviane-brito-studio.vercel.app` (conta Richard) com Supabase Traffic Lab até concluir transfer + import no time **TrafficLab**.
- **GitHub (se Vercel do cliente não enxergar `Richard-Duarte/...`):** transferir o repo para o usuário **`trafficlabads`** no GitHub (Richard aceita como collaborator depois). Time Vercel **Hobby** não permite convidar membros — por isso import cross-account falha sem transferência ou repo na mesma conta GitHub da Vercel.
- **Provisório:** deploy em `https://viviane-brito-studio.vercel.app` (conta Richard) com Supabase Traffic Lab até concluir transfer + import no time **TrafficLab**.
- Lovable (se usar): mesmas env vars com URL e chaves deste Supabase.
