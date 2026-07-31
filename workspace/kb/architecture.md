# Zahara Parfums - System Architecture

## Overview
Zahara Parfums is a single-page application (SPA) for an e-commerce perfume store built with React 18, Vite, and Tailwind CSS. Backend services are provided by Supabase (authentication, database, storage, edge functions).

## System Components

### Frontend (React SPA)
- **Router**: `src/App.jsx` — BrowserRouter with public routes (`/`, `/loja`, `/produto/:id`, `/marcas`) and admin routes (`/admin`, `/admin/produtos`, `/admin/marcas`)
- **Auth Provider**: `src/hooks/useAuth.jsx` — Context-based auth state using Supabase `getSession()` and `onAuthStateChange`
- **Product Hook**: `src/hooks/useProdutos.jsx` — CRUD operations for products and brands via Supabase
- **Tracking**: `src/hooks/useTracking.jsx` + `src/lib/tracking.js` — View/click tracking with IP, fingerprint, user agent
- **WhatsApp**: `src/lib/whatsapp.js` — Constructs `wa.me` deep links with product details
- **Fragrantica Integration**: `src/lib/fragrantica.js` — Client-side wrapper calling Supabase Edge Function for scraping

### Backend (Supabase)
- **Database**: PostgreSQL with 4 tables — `produtos`, `marcas`, `tracking`, `config`
- **Auth**: Supabase Auth (email/password)
- **Storage**: Public bucket `produtos` for product images
- **Edge Functions**: `scrape-fragrantica` — Deno-based server-side scraper for Fragrantica perfume data

### Admin Scripts
- `scripts/create-admins.mjs` — Creates admin users with **hardcoded credentials**
- `scripts/reset-admins.mjs`, `scripts/verify-data.js`, `scripts/run-migration.js` — Maintenance scripts

## Data Flows

### Authentication Flow
```
User → Login.jsx → useAuth.signIn() → Supabase Auth → Session → AdminLayout guard
```
- Client-side session check via `getSession()` on mount
- `onAuthStateChange` listener for reactive updates
- Admin route guard: `AdminLayout` redirects to `/admin/login` if `!user`

### Product CRUD Flow
```
Admin → FormProduto.jsx → useProdutos (create/update/delete) → Supabase DB → RLS policies
```
- Products have `ativo` flag (public only sees active)
- Brands are optional (`marca_id` nullable, ON DELETE SET NULL)

### Tracking Flow
```
Product Page → useTracking → api.ipify.org (get IP) → ip-api.com (get country) → Supabase tracking table
```
- Collects: IP, user agent, device type, browser, OS, country, canvas fingerprint, referrer
- RLS: anonymous INSERT allowed, SELECT requires authentication

### WhatsApp Purchase Flow
```
Product Card → WhatsAppModal → buildWhatsAppLink() → wa.me deep link (new tab)
```
- No server call — pure client-side URL construction
- User name is embedded in the WhatsApp message

### Fragrantica Scraping Flow
```
FormProduto → fragrantica.js → Supabase Edge Function → Fragrantica website (HTML scraping)
```
- Edge function uses server-side fetch (no CORS issues)
- Parses HTML with regex to extract product data
- Returns structured perfume data to the client

## Trust Boundaries

1. **Client ↔ Supabase**: Authenticated API calls with anon key (RLS enforcement)
2. **Client ↔ External APIs**: ipify.org (IP), ip-api.com (geo), Fragrantica (via edge function)
3. **Edge Function ↔ Fragrantica**: Server-side HTTP fetch with User-Agent spoofing
4. **Admin Scripts ↔ Supabase**: Direct API calls with anon key (service-level operations)

## Availability Classification
- **CRITICAL**: None (small e-commerce SPA)
- **STANDARD**: Public product browsing, admin product management
- **LOW_CRITICALITY**: Tracking analytics, Fragrantica scraping
