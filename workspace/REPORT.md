# Zahara Parfums — Security Review Report

> **Target Version:** Git branch main at commit 3adc2cc
> **Pass:** 1 (MODE-OFF, no snapshot pinning)
> **Date:** 2026-07-30
> **Pipeline:** Mantis Security Review (Stages 1-9)

---

## Executive Summary

This security review of the Zahara Parfums e-commerce SPA identified **6 security findings** across the application stack — from hardcoded credentials in source code to broken access control in database policies. The findings span **CRITICAL**, **HIGH**, **MEDIUM**, and **LOW** severity levels.

**Key Risk:** The most severe issue is a combination of hardcoded admin credentials (CWE-798) and broken access control (CWE-862) that together allow any authenticated user to gain full administrative privileges over the entire product catalog, brand data, and configuration.

### Findings Summary

| # | Finding | CWE | Priority | Risk Score | Viability |
|---|---------|-----|----------|------------|-----------|
| 1 | Hardcoded Admin Credentials | CWE-798 | **CRITICAL** | 9/10 | VIABLE |
| 2 | Broken Access Control (RLS) | CWE-862 | **HIGH** | 9/10 | VIABLE |
| 3 | SSRF in Edge Function | CWE-918 | **HIGH** | 7/10 | VIABLE |
| 4 | Cleartext HTTP (Geolocation) | CWE-319 | **MEDIUM** | 4/10 | VIABLE |
| 5 | Cleartext PII Storage | CWE-312 | **MEDIUM** | 4/10 | VIABLE |
| 6 | CORS Wildcard + Error Disclosure | CWE-942 | **LOW** | 4/10 | VIABLE |

---

## Finding 1: Hardcoded Admin Credentials in Source Code

**ID:** `f1a2b3c4-d5e6-7890-abcd-ef1234567890`
**CWE:** CWE-798 (Use of Hard-coded Credentials)
**Priority:** CRITICAL | **Risk Score:** 9/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
The script `scripts/create-admins.mjs` contains plaintext admin email addresses and passwords committed to the Git repository:

```javascript
const admins = [
  { email: 'kelly@admin.com', password: 'Khen741963', nome: 'Kelly Admin' },
  { email: 'heverton@admin.com', password: 'Khen741963', nome: 'Heverton Admin' },
]
```

Two admin accounts share the same password. These credentials are readable by anyone with repository access.

### Impact
- **Confidentiality:** Full admin credentials exposed in source code
- **Integrity:** Attacker can create/modify/delete all products and configuration
- **Availability:** Shared password means single compromise affects all admin accounts

### Risk Rationale
- **Impact (5/5):** Complete admin compromise — full CRUD on all tables
- **Likelihood (4/5):** Requires repository access, but this is a common attack vector (compromised developer account, leaked repo, CI/CD exposure)
- **Attacker Position:** SUPPLY_CHAIN (repository access)

### Remediation
1. **IMMEDIATE:** Rotate all exposed credentials
2. Remove hardcoded credentials from source code
3. Use environment variables or a secrets manager (e.g., Supabase Vault)
4. Implement unique passwords per admin account
5. Add `scripts/create-admins.mjs` to `.gitignore` or remove from repository
6. Audit git history for credential exposure

---

## Finding 2: Broken Access Control — Any Authenticated User Gets Full Admin Privileges

**ID:** `a2b3c4d5-e6f7-8901-bcde-f12345678901`
**CWE:** CWE-862 (Missing Authorization)
**Priority:** HIGH | **Risk Score:** 9/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
RLS policies in `supabase/schema.sql` use `auth.role() = 'authenticated'` to grant full CRUD access:

```sql
CREATE POLICY "Admin pode tudo em produtos" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em marcas" ON marcas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em config" ON config
  FOR ALL USING (auth.role() = 'authenticated');
```

This means **any authenticated user** (not just admins) can create, update, and delete all products, brands, and configuration. The `AdminLayout.jsx` client-side guard checks only `user` truthiness — there is no role-based verification.

### Impact
- **Integrity:** Any user can modify all product data, pricing, and configuration
- **Confidentiality:** Access to config table (WhatsApp number, potentially other secrets)
- **Availability:** Any user can delete all products or brands

### Risk Rationale
- **Impact (4/5):** Full admin takeover via any authenticated account
- **Likelihood (5/5):** Trivial to exploit — just create an account or use a compromised one
- **Attacker Position:** EXTERNAL (can self-register)

### Remediation
1. Implement role-based access control (RBAC)
2. Add a `role` column to a user profiles table or use Supabase user metadata
3. Update RLS policies: `auth.jwt() ->> 'role' = 'admin'`
4. Disable self-registration or add email verification
5. Add server-side role verification for all admin operations

---

## Finding 3: SSRF via Fragrantica Edge Function URL Parameter

**ID:** `b3c4d5e6-f789-0123-cdef-123456789012`
**CWE:** CWE-918 (Server-Side Request Forgery)
**Priority:** HIGH | **Risk Score:** 7/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
The Supabase Edge Function `scrape-fragrantica` accepts a `url` parameter and passes it to `fetch()` after only checking `url.includes('fragrantica.com')`:

```typescript
if (url && url.includes('fragrantica.com')) {
  const productData = await scrapeProductPage(url)
  // ...
}
```

This check is bypassable via URL parsing tricks:
- `https://fragrantica.com.evil.com/` — different hostname
- `https://fragrantica.com@attacker.com/` — userinfo trick
- `https://fragrantica.com#@internal-service/` — fragment trick

### Impact
- **Confidentiality:** Probe internal Supabase infrastructure
- **Integrity:** Use as proxy for attacks against internal services
- **Availability:** Resource exhaustion via repeated requests

### Risk Rationale
- **Impact (4/5):** Infrastructure access, potential data exfiltration
- **Likelihood (3/5):** Requires crafting a bypass URL, but techniques are well-documented
- **Attacker Position:** EXTERNAL (no authentication required)

### Remediation
1. Parse URL with `new URL()` and validate hostname against strict allowlist
2. Only allow: `www.fragrantica.com.br`, `www.fragrantica.com`
3. Block internal/private IP ranges (127.x, 10.x, 192.168.x, etc.)
4. Add rate limiting per IP
5. Log all outbound requests for audit

---

## Finding 4: Cleartext HTTP Transmission of IP Address and Geolocation Data

**ID:** `c4d5e6f7-8901-2345-defa-234567890123`
**CWE:** CWE-319 (Cleartext Transmission of Sensitive Information)
**Priority:** MEDIUM | **Risk Score:** 4/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
The tracking module calls `http://ip-api.com/json/${ip}` over plain HTTP:

```javascript
const res = await fetch(`http://ip-api.com/json/${ip}`)
```

This transmits the user's IP address in cleartext, allowing network-level interception.

### Impact
- **Confidentiality:** IP addresses and location data intercepted by MitM
- **Integrity:** Geolocation responses can be tampered with

### Risk Rationale
- **Impact (2/5):** Limited to data interception on local network
- **Likelihood (3/5):** Requires network position (public WiFi, compromised router)
- **Attacker Position:** INTERNAL_NETWORK

### Remediation
1. Replace `http://ip-api.com` with `https://ip-api.com`
2. Consider using a more privacy-respecting geolocation service
3. Minimize data collection (only store country, not full IP)

---

## Finding 5: Cleartext Storage of PII in Tracking Table

**ID:** `d5e6f789-0123-4567-efab-345678901234`
**CWE:** CWE-312 (Cleartext Storage of Sensitive Information)
**Priority:** MEDIUM | **Risk Score:** 4/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
The `tracking` table stores IP addresses, user agent strings, canvas fingerprints, and referrer URLs in plaintext with no encryption, no data retention policy, and no deletion mechanism.

### Impact
- **Confidentiality:** All visitor tracking data exposed if DB is compromised
- **Compliance:** GDPR violation risk (no deletion capability, no retention policy)

### Risk Rationale
- **Impact (3/5):** Privacy violation, legal compliance risk
- **Likelihood (2/5):** Requires DB compromise or insider access
- **Attacker Position:** EXTERNAL (requires low privileges)

### Remediation
1. Implement data retention policies (auto-delete after N days)
2. Add DELETE RLS policy for admin users
3. Anonymize IP addresses (truncate last octet)
4. Encrypt fingerprint data
5. Implement GDPR data purge mechanism

---

## Finding 6: CORS Wildcard and Error Information Disclosure in Edge Function

**ID:** `e6f78901-2345-5678-fabc-456789012345`
**CWE:** CWE-942 (Permissive Cross-domain Policy)
**Priority:** LOW | **Risk Score:** 4/10
**Discovery Snapshot:** (pass 1, MODE-OFF)

### Description
The edge function uses `Access-Control-Allow-Origin: *` and returns raw error messages to clients.

### Impact
- **Confidentiality:** Error messages may leak internal implementation details
- **Availability:** Any website can use the function as a free proxy

### Risk Rationale
- **Impact (2/5):** Proxy abuse and information disclosure
- **Likelihood (3/5):** Requires hosting a malicious page
- **Attacker Position:** EXTERNAL

### Remediation
1. Restrict CORS to specific allowed origins
2. Sanitize error messages — log full errors server-side, return generic messages
3. Add request validation and rate limiting

---

## Remediation Matrix

| Priority | Finding | Effort | Impact | Recommended Timeline |
|----------|---------|--------|--------|---------------------|
| **CRITICAL** | Hardcoded Credentials | Low | High | **Immediate** — rotate creds, remove from source |
| **HIGH** | Broken Access Control (RLS) | Medium | High | **This week** — implement RBAC |
| **HIGH** | SSRF in Edge Function | Low | High | **This week** — add URL allowlist |
| **MEDIUM** | Cleartext HTTP | Trivial | Low | **Next sprint** — change http to https |
| **MEDIUM** | Cleartext PII Storage | Medium | Medium | **Next sprint** — add retention + deletion |
| **LOW** | CORS Wildcard | Trivial | Low | **Backlog** — restrict origins |

---

## Appendix: Technical Details

### Affected Files
- `scripts/create-admins.mjs` — Hardcoded credentials (lines 28-29)
- `supabase/schema.sql` — RLS policies (lines 67-75)
- `supabase/functions/scrape-fragrantica/index.ts` — SSRF entry point (lines 25-30, 58-60)
- `src/lib/tracking.js` — HTTP API call (line 17)
- `src/lib/tracking.js` — PII collection (lines 28-38)
- `supabase/functions/scrape-fragrantica/index.ts` — CORS config (lines 5-8)

### Architecture Notes
- Supabase anon key is correctly used (not service role)
- `.env` is in `.gitignore` (credentials not in bundle)
- No `dangerouslySetInnerHTML` or `eval` in client code
- Client-side auth guard exists but lacks role checking

---

*Report generated by Mantis Security Review Pipeline*
*Mode: MODE-OFF (no snapshot pinning)*
*Findings: 6 total — 1 CRITICAL, 2 HIGH, 2 MEDIUM, 1 LOW*
