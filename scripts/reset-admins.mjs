// Script para resetar usuários admin no Supabase
// Execute: node scripts/reset-admins.mjs <SERVICE_ROLE_KEY>

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Ler .env
const envFile = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
)

const supabaseUrl = env.VITE_SUPABASE_URL
const serviceRoleKey = env.VITE_SUPABASE_SERVICE_ROLE

if (!supabaseUrl || !serviceRoleKey) {
  console.error('VITE_SUPABASE_URL e VITE_SUPABASE_SERVICE_ROLE são necessários no .env')
  process.exit(1)
}

// Client com service_role (acesso total)
const supabase = createClient(supabaseUrl, serviceRoleKey)

const admins = [
  { email: 'heverton@admin.com', password: '@#Khen741963@#', nome: 'Heverton Admin' },
  { email: 'kelly@admin.com', password: '@#Khen741963@#', nome: 'Kelly Admin' },
]

async function resetAdmins() {
  console.log('🔍 Buscando todos os usuários existentes...\n')

  // 1. Listar todos os usuários
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Erro ao listar usuários:', listError.message)
    process.exit(1)
  }

  console.log(`Encontrados ${users.length} usuário(s):`)
  users.forEach(u => console.log(`  - ${u.email} (${u.id})`))

  // 2. Deletar todos os usuários existentes
  if (users.length > 0) {
    console.log('\n🗑️  Deletando todos os usuários...')
    for (const user of users) {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) {
        console.error(`  ❌ Erro ao deletar ${user.email}: ${error.message}`)
      } else {
        console.log(`  ✅ ${user.email} deletado`)
      }
    }
  }

  // 3. Criar novos admins sem confirmação de email
  console.log('\n👤 Criando novos admins...')
  for (const admin of admins) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true, // Pula confirmação de email
      user_metadata: {
        nome: admin.nome,
        role: 'admin'
      }
    })

    if (error) {
      console.error(`  ❌ Erro ao criar ${admin.email}: ${error.message}`)
    } else {
      console.log(`  ✅ ${admin.email} criado (ID: ${data.user.id})`)
    }
  }

  console.log('\n✨ Reset completo!')
  console.log('\nCredenciais:')
  admins.forEach(a => console.log(`  ${a.email} | ${a.password}`))
}

resetAdmins().catch(console.error)
