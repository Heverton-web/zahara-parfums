# Zahara Parfums — Knowledge Base Index

## Architecture
- [System Architecture](architecture.md) — Data flows, zones, trust boundaries

## Entities
- [Supabase Client](entities/supabase_client.md) — Core data layer (CRITICAL)
- [Authentication Module](entities/auth_module.md) — Session management and admin guard (CRITICAL)
- [Database Schema](entities/database_schema.md) — Tables, RLS policies (CRITICAL)
- [Admin Scripts](entities/admin_scripts.md) — Credential management (CRITICAL)
- [Edge Function: scrape-fragrantica](entities/edge_function_fragrantica.md) — External data integration (STANDARD)
- [Tracking Module](entities/tracking_module.md) — Analytics collection (LOW_CRITICALITY)
- [WhatsApp Module](entities/whatsapp_module.md) — Customer communication (LOW_CRITICALITY)

## Vulnerability Classes
- [CWE-798: Hard-coded Credentials](vulnerabilities/CWE-798.md) — Admin scripts
- [CWE-862: Missing Authorization](vulnerabilities/CWE-862.md) — RLS and admin guard
- [CWE-918: SSRF](vulnerabilities/CWE-918.md) — Edge function
- [CWE-319: Cleartext Transmission](vulnerabilities/CWE-319.md) — HTTP API calls
- [CWE-312: Cleartext Storage](vulnerabilities/CWE-312.md) — Tracking PII
