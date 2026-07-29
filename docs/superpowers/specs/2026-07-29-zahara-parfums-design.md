# Zahara Parfums — Design Spec

## Visão Geral

Loja virtual para venda de perfumes importados. Catálogo público com 20-50 produtos, botão de compra via WhatsApp (sem gateway de pagamento), e painel admin com CRUD completo e tracking de views/cliques.

**Stack:** React + Vite + Tailwind CSS + Supabase

## Estrutura do Projeto

```
proj_omo-slim/
├── src/
│   ├── components/
│   │   ├── ui/              # Button, Input, Card, Modal, Badge
│   │   ├── layout/          # Header, Footer, Sidebar, AdminLayout
│   │   └── product/         # CardProduto, ListaProdutos, Filtros, FormProduto
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Loja.jsx
│   │   ├── Produto.jsx
│   │   ├── Marcas.jsx
│   │   ├── admin/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Produtos.jsx
│   │   │   ├── FormProduto.jsx
│   │   │   └── Marcas.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.jsx
│   │   ├── useProdutos.jsx
│   │   └── useTracking.jsx
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── tracking.js
│   │   └── ua-parser.js    # Parse de User-Agent
│   ├── App.jsx
│   └── main.jsx
├── .env
└── package.json
```

## Banco de Dados (Supabase)

### Tabela: produtos

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | uuid | PK, default gen_random_uuid() | ID único |
| nome | text | NOT NULL | Nome do produto |
| marca_id | uuid | FK → marcas(id) | Marca do produto |
| genero | text | CHECK (feminino, masculino, unissex) | Gênero |
| preco | numeric(10,2) | NOT NULL | Preço em R$ |
| imagem_url | text | | URL da imagem no Supabase Storage |
| descricao | text | | Descrição do produto |
| ativo | boolean | DEFAULT true | Se produto está visível na loja |
| tags | text[] | DEFAULT '{}' | Tags: lançamento, promoção, oferta relâmpago |
| created_at | timestamptz | DEFAULT now() | Data de criação |

### Tabela: marcas

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | uuid | PK, default gen_random_uuid() | ID único |
| nome | text | NOT NULL, UNIQUE | Nome da marca |
| logo_url | text | | URL do logo |

### Tabela: tracking

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | uuid | PK, default gen_random_uuid() | ID único |
| produto_id | uuid | FK → produtos(id) | Produto visitado |
| tipo | text | CHECK (view, click) | Tipo de evento |
| ip | text | | Endereço IP |
| user_agent | text | | User-Agent completo |
| dispositivo | text | | mobile, desktop, tablet |
| navegador | text | | Chrome, Safari, Firefox, etc. |
| so | text | | Windows, iOS, Android, etc. |
| pais | text | | País via geolocation |
| referrer | text | | URL de origem |
| fingerprint | text | | Hash do navegador |
| criado_em | timestamptz | DEFAULT now() | Data do evento |

### Tabela: config (para settings gerais)

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| chave | text | PK | Nome da config |
| valor | text | | Valor da config |

Configs iniciais:
- `whatsapp_numero` — número do WhatsApp com código do país
- `whatsapp_msg_template` — template da mensagem

## Design Visual

### Paleta de Cores

| Uso | Cor | Hex |
|-----|-----|-----|
| Fundo | Preto | #0A0A0A |
| Superfície | Cinza escuro | #1A1A1A |
| Dourado primário | Dourado | #C9A84C |
| Dourado hover | Dourado claro | #E8D5A3 |
| Texto principal | Branco | #F5F5F5 |
| Texto secundário | Cinza | #A0A0A0 |
| Borda | Cinza escuro | #2A2A2A |
| Sucesso/Ativo | Verde | #4CAF50 |
| Erro/Inativo | Vermelho | #E53935 |

### Tipografia

- **Títulos:** Playfair Display (Google Fonts)
- **Corpo:** Inter (Google Fonts)

### Layout Loja Pública

- **Header:** Logo à esquerda | Nav (Home, Loja, Marcas) ao centro | Busca à direita
- **Hero (Home):** Imagem grande + frase de destaque + CTA "Ver Coleção"
- **Grid de produtos:** 3 colunas desktop, 2 tablet, 1 mobile
- **Card produto:** Imagem + badge de tag (se tiver) + nome + marca + preço + botão WhatsApp
- **Footer:** Informações da loja, links, contato

### Layout Admin

- **Sidebar:** Logo mini | Menu (Dashboard, Produtos, Marcas) | Logout
- **Dashboard:** Cards de métricas + gráficos (Recharts ou similar)
- **Produtos:** Tabela com busca, filtros, toggle ativar/inativar, editar, excluir
- **Formulário:** Campos + upload imagem + multi-select de tags

## Rotas

### Públicas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Hero + destaques + marcas |
| `/loja` | Loja | Catálogo com filtros (gênero, marca, tag) |
| `/produto/:id` | Produto | Detalhe + botão WhatsApp |
| `/marcas` | Marcas | Lista de marcas com produtos |

### Admin (protegidas)

| Rota | Página | Descrição |
|------|--------|-----------|
| `/admin/login` | Login | Autenticação |
| `/admin` | Dashboard | Métricas e gráficos |
| `/admin/produtos` | Produtos | Lista + CRUD |
| `/admin/produtos/novo` | Novo Produto | Formulário de criação |
| `/admin/produtos/:id/editar` | Editar Produto | Formulário de edição |
| `/admin/marcas` | Marcas | CRUD de marcas |

## Tracking

### Captura de dados

- **IP + User-Agent:** Capturados via request headers no Supabase Edge Function
- **Dispositivo/Navegador/SO:** Parse do User-Agent com `ua-parser-js`
- **País:** API `ip-api.com` (gratuita, rate limit 45 req/min)
- **Fingerprint:** Hash combinando resolução de tela, idioma, plugins, timezone (JS no frontend)

### Eventos

1. **view** — Usuário visita a página do produto
2. **click** — Usuário clica no botão WhatsApp

### Dashboard

- Total de views/cliques (hoje, 7 dias, 30 dias)
- Gráfico de views vs cliques (últimos 7 dias)
- Top 5 produtos mais visitados
- Gráfico de dispositivos (mobile vs desktop)
- Top países

## Integração WhatsApp

**Mensagem pré-formatada:**
```
Olá! Vim pela Zahara Parfums e tenho interesse no perfume:

{nome_do_produto}
Marca: {marca}
Preço: R$ {preco}

Gostaria de mais informações!
```

**Link gerado:** `https://wa.me/55XXXXXXXXXXX?text={mensagem_encode}`

**Fluxo:**
1. Usuário clica "Comprar no WhatsApp"
2. Tracking registra o clique
3. Redireciona para WhatsApp com mensagem pronta

## Funcionalidades Admin

### Autenticação
- Login com email + senha (Supabase Auth)
- Sessão persistente
- Rota `/admin` protegida (redirect para login se não autenticado)

### CRUD Produtos
- Tabela: imagem miniatura, nome, marca, gênero, preço, tags, status
- Busca por nome
- Filtros: gênero, marca, tag, status
- Toggle ativar/desativar
- Editar → formulário completo
- Excluir com confirmação
- Upload de imagem para Supabase Storage

### CRUD Marcas
- Tabela: logo, nome
- Criar, editar, excluir
- Excluir marca → produtos ficam sem marca ( FK SET NULL)

### Dashboard
- Card: Total de produtos (ativos/inativos)
- Card: Views hoje / 7 dias / 30 dias
- Card: Cliques hoje / 7 dias / 30 dias
- Gráfico: Views vs Cliques (7 dias)
- Gráfico: Top 5 produtos
- Gráfico: Dispositivos

## Regras de Negócio

- `ativo = false` → produto não aparece na loja pública, mas continua visível no admin
- Tags são multi-seleção: lançamento, promoção, oferta relâmpago
- Tags exibidas como badges no card do produto
- Excluir marca → produtos ficam sem marca (não excluir produto)
- Número do WhatsApp configurado no admin (tabela config)
