import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzcxrctbdbbbnxamdvyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Y3hyY3RiZGJiYm54YW1kdnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjEzMjgsImV4cCI6MjEwMDkzNzMyOH0.N0zrdKlu4jiGgFNNc-Nw6sfMXn94l28LK-xclGTisDQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verify() {
  console.log('Verificando dados no banco...\n')

  const { data: marcas, error: e1 } = await supabase.from('marcas').select('*')
  console.log('Marcas:', marcas?.length || 0, 'registros')
  if (marcas) marcas.forEach(m => console.log(`  - ${m.id}: ${m.nome}`))

  const { data: produtos, error: e2 } = await supabase.from('produtos').select('*')
  console.log('\nProdutos:', produtos?.length || 0, 'registros')
  if (produtos) produtos.forEach(p => console.log(`  - ${p.nome} (R$ ${p.preco})`))

  const { data: config } = await supabase.from('config').select('*')
  console.log('\nConfig:', config)
}

verify()
