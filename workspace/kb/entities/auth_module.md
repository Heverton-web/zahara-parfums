# Authentication Module

**File**: `src/hooks/useAuth.jsx`
**Criticality**: CRITICAL — Gateway to all admin operations

## Description
React Context provider wrapping Supabase Auth. Provides `user`, `loading`, `signIn`, and `signOut` to all children. Session is checked on mount via `getSession()` and kept in sync via `onAuthStateChange`.

## Security Constraints
- No email verification enforcement visible
- No rate limiting on login attempts (client-side)
- No CSRF protection beyond Supabase SDK defaults
- Admin layout guard checks `user` truthiness — if Supabase session is valid, access is granted

## Admin Route Protection
- `AdminLayout.jsx` checks `useAuth().user` — redirects to `/admin/login` if null
- No server-side middleware — purely client-side routing guard
- Any authenticated user can access ALL admin routes (no role-based access control)

## Linked Vulnerabilities
- [CWE-287](../vulnerabilities/CWE-287.md) — Improper authentication
- [CWE-862](../vulnerabilities/CWE-862.md) — Missing authorization
