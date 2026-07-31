# Database Schema

**File**: `supabase/schema.sql`
**Criticality**: CRITICAL — Data integrity and access control

## Tables
- `produtos` — Product catalog with `ativo` flag, optional brand reference
- `marcas` — Brand catalog
- `tracking` — View/click analytics with IP, fingerprint, geo data
- `config` — Key-value configuration store

## RLS Policies
1. Products: public SELECT for `ativo=true`, full CRUD for `authenticated`
2. Brands: public SELECT, full CRUD for `authenticated`
3. Config: full CRUD for `authenticated` only
4. Tracking: anonymous INSERT, SELECT for `authenticated`
5. Storage: public SELECT, INSERT for `authenticated` on `produtos` bucket

## Security Constraints
- No DELETE policy on `tracking` — data cannot be removed
- `authenticated` role grants full access — no granular admin roles
- `config` table stores `whatsapp_numero` — accessible to any authenticated user
- Storage bucket is public — any uploaded image is publicly accessible
- No data retention or cleanup policies

## Linked Vulnerabilities
- [CWE-862](../vulnerabilities/CWE-862.md) — Missing authorization (any authenticated user = admin)
