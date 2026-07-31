# Zahara Parfums — Threat Model

## System Overview
Zahara Parfums is a production e-commerce SPA for selling perfumes. It uses Supabase for authentication, database, storage, and edge functions. Admin users manage products via a protected admin panel. Public users browse products and initiate WhatsApp-based purchase inquiries.

## Deployment Intent
Intent: PRODUCTION

### Production-Signal Checklist
1. NO entity is classified LOW_CRITICALITY only — several are CRITICAL (auth, DB, admin scripts) ✓ → FALSE → PRODUCTION
2. architecture.md names externally-reachable services (Supabase, edge functions, WhatsApp) ✓ → FALSE → PRODUCTION
3. KB describes a publishable SPA with admin routes ✓ → FALSE → PRODUCTION
4. Components lie under `src/` (production root), not test/sample directories ✓ → FALSE → PRODUCTION
5. Real untrusted external inputs cross trust boundaries (user login, product browsing, tracking) ✓ → FALSE → PRODUCTION

**Verdict: Intent: PRODUCTION** (Checklist items 1-5 all fail the SAMPLE_OR_TEST criteria)

## Trust Boundaries

### TB1: Client ↔ Supabase (Auth & Data)
- **Untrusted side**: Browser/client (any user)
- **Trusted side**: Supabase API with RLS enforcement
- **Boundary crossing**: Authenticated API calls use anon key; RLS policies enforce access control
- **Risk**: If RLS policies are misconfigured, any authenticated user can access all data

### TB2: Client ↔ External APIs
- **Untrusted side**: Browser/client
- **Trusted side**: ipify.org, ip-api.com
- **Boundary crossing**: Client makes HTTP requests to external services
- **Risk**: Data leakage to third parties; MitM on HTTP connections

### TB3: Edge Function ↔ External Websites
- **Untrusted side**: Fragrantica.com (external website)
- **Trusted side**: Supabase Edge Function (Deno runtime)
- **Boundary crossing**: Server-side fetch of user-supplied URLs
- **Risk**: SSRF if URL validation is insufficient

### TB4: Admin Scripts ↔ Supabase
- **Untrusted side**: Source code repository (hardcoded credentials)
- **Trusted side**: Supabase Auth API
- **Boundary crossing**: Scripts call signUp() with plaintext credentials
- **Risk**: Credential exposure if repository is compromised

### TB5: Client ↔ WhatsApp
- **Untrusted side**: User input (name)
- **Trusted side**: wa.me deep link
- **Boundary crossing**: User name embedded in URL without sanitization
- **Risk**: URL injection, message manipulation

## Threat Actors & Vectors

### TA1: Unauthenticated External Attacker
- **Position**: External network
- **Capabilities**: Network access, browser manipulation
- **Reachable boundaries**: TB1 (brute force login), TB2 (intercept HTTP), TB5 (manipulate WhatsApp links)
- **Motivation**: Gain admin access, deface store, steal customer data

### TA2: Authenticated Low-Privilege User
- **Position**: Any authenticated user
- **Capabilities**: Standard user actions
- **Reachable boundaries**: TB1 (access any admin data via RLS bypass), TB3 (trigger SSRF via edge function)
- **Motivation**: Privilege escalation, data theft, service abuse

### TA3: Repository Compromiser
- **Position**: Source code access
- **Capabilities**: Read hardcoded credentials
- **Reachable boundaries**: TB4 (use credentials to create admin accounts)
- **Motivation**: Full system compromise

### TA4: Malicious Admin
- **Position**: Authenticated admin
- **Capabilities**: Full CRUD on all tables
- **Reachable boundaries**: TB1 (access all data), TB3 (trigger SSRF)
- **Motivation**: Data exfiltration, system abuse

## High-Risk Assets

### A1: Admin User Credentials
- **Type**: Authentication secrets
- **Criticality**: CRITICAL
- **Exposure**: Hardcoded in `scripts/create-admins.mjs`

### A2: Customer PII (Tracking Data)
- **Type**: IP addresses, fingerprints, user agents, geo data
- **Criticality**: STANDARD
- **Exposure**: Stored in plaintext in `tracking` table

### A3: Product Database
- **Type**: Business data (products, brands, pricing)
- **Criticality**: STANDARD
- **Exposure**: Admin-managed, publicly readable (active products only)

### A4: Supabase Infrastructure
- **Type**: Backend-as-a-Service
- **Criticality**: CRITICAL
- **Exposure**: Anon key in client bundle, RLS as sole access control

### A5: Edge Function Runtime
- **Type**: Serverless compute
- **Criticality**: STANDARD
- **Exposure**: Accepts user input, makes outbound HTTP requests
