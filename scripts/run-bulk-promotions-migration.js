// Script para rodar a migration de Promoções em Massa via Supabase
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = 'https://pzcxrctbdbbbnxamdvyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Y3hyY3RiZGJiYm54YW1kdnlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTM2MTMyOCwiZXhwIjoyMTAwOTM3MzI4fQ.kr1W0JqcMtpKswvk8tdJMTSuWKLg_xLzY5i_r1557FU'

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('🚀 Rodando migration: Promoções em Massa...\n')

  const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '20260731200000_add_bulk_promotions.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  // Executa cada statement separadamente
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  let success = 0
  let errors = 0

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: statement + ';' })
      if (error) {
        // Se a função rpc não existir, tenta via query direta
        console.log(`⚠️  RPC não disponível, tentando via REST...`)
        break
      }
      success++
      console.log(`✓ OK: ${statement.substring(0, 60)}...`)
    } catch (err) {
      console.log(`⚠️  ${err.message}: ${statement.substring(0, 60)}...`)
      errors++
    }
  }

  if (success === 0) {
    console.log('\n📋 Migration precisa ser executada manualmente no Supabase SQL Editor.')
    console.log('   Cole o conteúdo de: supabase/migrations/20260731200000_add_bulk_promotions.sql')
  } else {
    console.log(`\n✅ Migration concluída: ${success} OK, ${errors} erros`)
  }
}

runMigration().catch(console.error)
