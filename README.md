# Convite XV — Emanuelle Knupp (passo a passo)

## 1. Banco (Supabase, grátis)
1. supabase.com → New project.
2. SQL Editor → cole o conteúdo de `supabase.sql` → Run.
3. Project Settings → API: copie a **Project URL** e a chave **service_role**.

## 2. Publicar (Vercel, grátis)
1. Suba esta pasta num repositório do GitHub (ou use `npx vercel` nesta pasta).
2. vercel.com → Add New Project → escolha o repositório → Deploy.
3. Em Settings → Environment Variables, crie:
   - `SUPABASE_URL` = Project URL
   - `SUPABASE_SERVICE_KEY` = chave service_role (nunca vai para o navegador)
   - `ADMIN_PASSWORD` = a senha da mãe (use uma mais forte que "fran123")
4. Deployments → Redeploy.

## 3. Uso
- Convite: `https://seu-site.vercel.app`
- Painel da mãe: `https://seu-site.vercel.app/admin`
