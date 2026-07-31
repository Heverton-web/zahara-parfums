import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Stub when env vars missing — callers should check isConfigured before use
const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'sua_url_aqui')

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({}, {
      get(_, prop) {
        if (prop === 'auth') return { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), signInWithPassword: async () => ({ error: new Error('Supabase not configured') }), signOut: async () => {} }
        return new Proxy({}, {
          get(_, method) {
            return () => ({ data: null, error: new Error('Supabase not configured'), select: () => ({ data: null, error: new Error('Supabase not configured'), single: () => ({ data: null, error: new Error('Supabase not configured') }) }) })
          }
        })
      }
    })

export { isConfigured }
