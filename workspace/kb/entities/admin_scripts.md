# Admin Scripts

**File**: `scripts/create-admins.mjs`
**Criticality**: CRITICAL — Credential management

## Description
Node.js script to create admin users in Supabase. Reads `.env` file for Supabase credentials, then calls `signUp()` for each admin.

## Security Constraints
- **HARDCODED CREDENTIALS**: Admin email and password are plaintext in source code
- Password `Khen741963` is shared across multiple admin accounts
- Script uses anon key (not service role) for user creation
- `.env` file parsing is naive (splits on `=`)

## Linked Vulnerabilities
- [CWE-798](../vulnerabilities/CWE-798.md) — Use of hard-coded credentials
- [CWE-259](../vulnerabilities/CWE-259.md) — Use of hard-coded password
