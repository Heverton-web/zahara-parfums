# Session: Zahara Parfums - Loja Virtual
Date: 2026-07-29
Duration: ~100+ messages

## Context Snapshot
Projeto de loja virtual para perfumes importados (Zahara Parfums) usando React + Vite + Tailwind + Supabase. Projeto scaffoldado e funcional com 19 tasks implementadas.

## What Was Accomplished
- Criação completa do projeto com scaffolding (Vite + React + Tailwind)
- Configuração do Supabase client com autenticação
- Sistema de tracking completo (views, cliques, IP, dispositivo, fingerprint)
- Integração WhatsApp com mensagem pré-formatada
- Loja pública: Home, Loja com filtros, Página de produto, Marcas
- Painel admin: Login, Dashboard com gráficos, CRUD de produtos e marcas
- Componentes UI: Button, Input, Card, Badge, Modal, Select
- Layout completo: Header, Footer, Sidebar, AdminLayout
- Schema SQL do banco de dados com RLS

## Key Decisions & Rationale
| Decision | Why | Alternatives Rejected |
|----------|-----|----------------------|
| React + Vite + Tailwind | SPA simples para 20-50 produtos, rápido de desenvolver | Next.js (SSR desnecessário), Astro (menos convencional) |
| Supabase | Backend rápido, auth + banco + storage prontos, grátis no início | Backend próprio (muito trabalho), Firebase (menos flexível) |
| WhatsApp sem gateway | Usuário é revendedor, sem estoque próprio | Stripe/PagSeguro (complexidade desnecessária) |
| Tracking completo | Usuário quer métricas detalhadas | Tracking básico (não atenderia necessidade) |
| Tags multi-seleção | Lançamento, promoção, oferta relâmpago visíveis como badges | Categorias rígidas (menos flexível) |

## Current State
- **Working**: Projeto builda sem erros, todas as 19 tasks implementadas
- **Broken/Blocked**: Nenhum - projeto funcional, precisa de configuração do Supabase para funcionar
- **Modified files**: 
  - `src/` - Componentes, hooks, páginas, utils
  - `supabase/schema.sql` - Schema do banco
  - `.env` - Configurações (precisa preencher com credenciais reais)

## Dead Ends (Don't Retry)
- ❌ Task tool com subagent_type "general" — não existe, usar subagentos nativos do OpenCode ou executar inline

## Next Steps (Prioritized)
1. [ ] Configurar MCP Supabase: `opencode mcp auth supabase`
2. [ ] Criar conta no Supabase (se ainda não tiver)
3. [ ] Executar SQL em `supabase/schema.sql` no SQL Editor do Supabase
4. [ ] Criar conta de admin no Supabase → Authentication → Users
5. [ ] Atualizar `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
6. [ ] Rodar `npm run dev` para testar localmente
7. [ ] Testar fluxo completo: Home → Loja → Produto → WhatsApp
8. [ ] Testar admin: Login → Dashboard → CRUD Produtos/Marcas
9. [ ] Deploy no Vercel (conectar repositório Git)

## Environment & Gotchas
- Projeto em `C:\Users\trcnologia\Desktop\proj_omo-slim`
- Node.js v?? (verificar com `node -v`)
- npm install já executado, dependências OK
- Build passa sem erros (848KB bundle - considerar code splitting)
- `npm run dev` para desenvolvimento
- `npm run build` para produção
- Git já inicializado com commits

## Key Code/Commands Reference
```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Schema SQL
# Executar supabase/schema.sql no SQL Editor do Supabase

# Autenticar MCP Supabase
opencode mcp auth supabase

# Instalar Agent Skills (opcional)
npx skills add supabase/agent-skills
```

## Architecture
```
proj_omo-slim/
├── src/
│   ├── components/ui/        # Button, Input, Card, Badge, Modal, Select
│   ├── components/layout/    # Header, Footer, Sidebar, AdminLayout
│   ├── components/product/   # CardProduto, FormProduto, Filtros, ListaProdutos
│   ├── hooks/                # useAuth, useProdutos, useTracking
│   ├── lib/                  # supabase.js, tracking.js, whatsapp.js
│   ├── pages/                # Home, Loja, Produto, Marcas, NotFound
│   └── pages/admin/          # Login, Dashboard, Produtos, MarcasAdmin
├── supabase/schema.sql       # Schema do banco de dados
├── .env                      # Variáveis de ambiente (Supabase)
└── package.json
```
