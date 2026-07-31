# Supabase Client Module

**File**: `src/lib/supabase.js`
**Criticality**: CRITICAL — Core data layer for all operations

## Description
Initializes the Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from environment variables. Exports a singleton `supabase` instance used throughout the application.

## Security Constraints
- Uses anon key (not service role key) — RLS enforcement is the primary security mechanism
- Environment variables are Vite-prefixed (`VITE_*`) and exposed to the client bundle
- No additional auth token management beyond what Supabase SDK provides

## Linked Vulnerabilities
- [CWE-798](../vulnerabilities/CWE-798.md) — Hardcoded credentials (admin scripts)
- [CWE-922](../vulnerabilities/CWE-922.md) — Insecure storage of sensitive information
