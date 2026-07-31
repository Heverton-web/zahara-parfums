# Edge Function: scrape-fragrantica

**File**: `supabase/functions/scrape-fragrantica/index.ts`
**Criticality**: STANDARD — External data integration

## Description
Supabase Edge Function (Deno runtime) that scrapes Fragrantica perfume data. Accepts a search query or URL, fetches HTML from fragrantica.com.br, parses it with regex, and returns structured perfume data.

## Security Constraints
- **SSRF Risk**: Accepts user-supplied URLs and queries, fetches them server-side
- CORS headers set to `*` (wildcard origin)
- No input validation on `query` or `url` parameters before fetch
- HTML parsing uses regex (not DOM parser) — potential for bypasses
- User-Agent is spoofed as Chrome browser

## SSRF Attack Surface
- The `url` parameter is passed to `fetch()` after minimal validation
- The `query` parameter is interpolated into a search URL
- No allowlist/blocklist of target domains
- Edge function runs with Deno permissions (could access internal services if misconfigured)

## Linked Vulnerabilities
- [CWE-918](../vulnerabilities/CWE-918.md) — Server-Side Request Forgery
- [CWE-79](../vulnerabilities/CWE-79.md) — Cross-site scripting (via reflected HTML)
