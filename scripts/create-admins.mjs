// Script para criar novos usuários admin no Supabase
// Execute: node scripts/create-admins.mjs

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
  console.error('Variáveis de ambiente necessárias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const admins = [
  { email: 'kelly@admin.com', password: 'Khen741963', nome: 'Kelly Admin' },
  { email: 'heverton@admin.com', password: 'Khen741963', nome: 'Heverton Admin' },
]

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
  console.log('\nPara deletar o usuário antigo (zahara@parfum.com):')
  console.log('1. Acesse o Supabase Dashboard > Authentication > Users')
  console.log('2. Busque por zahara@parfum.com')
  console.log('3. Clique no ícone de lixeira para deletar')
}

createAdmins().catch(console.error)
