// Script para criar novos usuários admin no Supabase
// Execute: node scripts/create-admins.mjs
// 
// Credenciais via variáveis de ambiente:
//   ADMIN_EMAILS=kelly@admin.com,heverton@admin.com
//   ADMIN_PASSWORDS=senha1,senha2
//   ADMIN_NAMES=Kelly Admin,Heverton Admin

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Ler .env manualmente
const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const supabaseUrl = env.VITE_SUPABASE_URL
const supabaseKey = env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY necessárias')
  process.exit(1)
}

// Credenciais via env vars (nunca hardcoded)
const emails = (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean)
const passwords = (process.env.ADMIN_PASSWORDS || '').split(',').filter(Boolean)
const names = (process.env.ADMIN_NAMES || '').split(',').filter(Boolean)

if (emails.length === 0 || passwords.length === 0) {
  console.error(`
Uso: ADMIN_EMAILS=email1,email2 ADMIN_PASSWORDS=senha1,senha2 node scripts/create-admins.mjs

Exemplo:
  ADMIN_EMAILS=kelly@admin.com ADMIN_PASSWORDS=MinhaSenh@123 ADMIN_NAMES="Kelly Admin" node scripts/create-admins.mjs
`)
  process.exit(1)
}

if (emails.length !== passwords.length) {
  console.error('Número de emails e senhas deve ser igual')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const admins = emails.map((email, i) => ({
  email: email.trim(),
  password: passwords[i].trim(),
  nome: names[i]?.trim() || email.split('@')[0],
}))

async function createAdmins() {
  for (const admin of admins) {
    console.log(`\nCriando: ${admin.email}`)
    
    const { data, error } = await supabase.auth.signUp({
      email: admin.email,
      password: admin.password,
      options: {
        data: {
          nome: admin.nome,
          role: 'admin'
        }
      }
    })

    if (error) {
      console.error(`Erro: ${error.message}`)
    } else {
      console.log(`Sucesso! ID: ${data.user?.id}`)
    }
  }

  console.log('\nConcluído!')
}

createAdmins().catch(console.error)
