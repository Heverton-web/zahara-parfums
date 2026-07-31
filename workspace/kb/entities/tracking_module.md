# Tracking Module

**Files**: `src/hooks/useTracking.jsx`, `src/lib/tracking.js`
**Criticality**: LOW_CRITICALITY — Analytics only

## Description
Collects view and click events for products. Fetches the client's public IP via api.ipify.org, resolves geo via ip-api.com, generates a canvas fingerprint, and inserts a row into the `tracking` Supabase table.

## Data Collected
- Product ID, event type (view/click)
- IP address (from ipify.org)
- User agent string
- Device type, browser name, OS name
- Country (from ip-api.com geo lookup)
- Canvas fingerprint
- Referrer URL

## Security Constraints
- RLS allows anonymous INSERT on `tracking` table
- IP is stored as plain text (PII concern)
- Fingerprint is stored as plain text
- No data retention policy visible
- `ip-api.com` called over HTTP (not HTTPS) — potential MitM for geo lookup

## Linked Vulnerabilities
- [CWE-312](../vulnerabilities/CWE-312.md) — Cleartext storage of sensitive information
- [CWE-319](../vulnerabilities/CWE-319.md) — Cleartext transmission of sensitive information
