// Script para rodar migration via Supabase REST API
// Tenta criar tabelas via query direta

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzcxrctbdbbbnxamdvyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Y3hyY3RiZGJiYm54YW1kdnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjEzMjgsImV4cCI6MjEwMDkzNzMyOH0.N0zrdKlu4jiGgFNNc-Nw6sfMXn94l28LK-xclGTisDQ'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testando conexão com Supabase...\n')

  // Testar se tabelas existem
  const { data: configTest, error: configError } = await supabase
    .from('config')
    .select('*')
    .limit(1)

  if (configError) {
    console.log('❌ Tabela config não existe:', configError.message)
    console.log('\n→ Você precisa criar as tabelas manualmente no Supabase Dashboard')
    console.log('→ Vá em: https://supabase.com/dashboard → SQL Editor → Cole o SQL → Run')
    return false
  }

  console.log('✓ Tabela config existe')
  
  const { data: marcasTest, error: marcasError } = await supabase
    .from('marcas')
    .select('*')
    .limit(1)

  if (marcasError) {
    console.log('❌ Tabela marcas não existe:', marcasError.message)
    return false
  }
  console.log('✓ Tabela marcas existe')

  const { data: produtosTest, error: produtosError } = await supabase
    .from('produtos')
    .select('*')
    .limit(1)

  if (produtosError) {
    console.log('❌ Tabela produtos não existe:', produtosError.message)
    return false
  }
  console.log('✓ Tabela produtos existe')

  return true
}

async function insertData() {
  console.log('\nInserindo dados...\n')

  // Inserir config WhatsApp
  const { error: configError } = await supabase
    .from('config')
    .upsert({ chave: 'whatsapp_numero', valor: '5519981868198' }, { onConflict: 'chave' })
  
  if (configError) console.log('Erro config:', configError.message)
  else console.log('✓ Config WhatsApp inserida')

  // Inserir marcas
  const marcas = [
    { id: '1', nome: 'Amouage' },
    { id: '2', nome: 'Ajmal' },
    { id: '3', nome: 'Rasasi' },
    { id: '4', nome: 'Al Haramain' },
    { id: '5', nome: 'Lattafa' },
    { id: '6', nome: 'Swiss Arabian' }
  ]

  const { error: marcasError } = await supabase
    .from('marcas')
    .upsert(marcas, { onConflict: 'id' })

  if (marcasError) console.log('Erro marcas:', marcasError.message)
  else console.log('✓ Marcas inseridas')

  // Inserir produtos
  const produtos = [
    {
      id: '1',
      nome: 'Interlude Man',
      marca_id: '1',
      genero: 'masculino',
      preco: 899.90,
      imagem_url: 'https://amouage.com/cdn/shop/files/Interlude-Man-100ml.png?v=1724136443&width=600',
      descricao: 'Um perfume oriental amadeirado para homens.',
      ativo: true,
      tags: ['lançamento']
    },
    {
      id: '2',
      nome: 'Jubilation XXV',
      marca_id: '1',
      genero: 'masculino',
      preco: 1299.90,
      imagem_url: 'https://amouage.com/cdn/shop/files/jubilationXXV.png?v=1724136443&width=600',
      descricao: 'Uma celebração da vida e do sucesso.',
      ativo: true,
      tags: []
    },
    {
      id: '3',
      nome: 'Oud Mood',
      marca_id: '3',
      genero: 'unissex',
      preco: 349.90,
      imagem_url: 'https://lattafa.com/cdn/shop/files/oud-mood.png?v=1724136443&width=600',
      descricao: 'Fragrância oriental com notas de oud.',
      ativo: true,
      tags: ['promoção']
    },
    {
      id: '4',
      nome: 'Pure Oud',
      marca_id: '4',
      genero: 'masculino',
      preco: 289.90,
      imagem_url: 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-60ml-Bottle.jpg?v=1724061272&width=600',
      descricao: 'Oud puro e autêntico do Oriente.',
      ativo: true,
      tags: []
    },
    {
      id: '5',
      nome: 'Yara',
      marca_id: '5',
      genero: 'feminino',
      preco: 199.90,
      imagem_url: 'https://lattafa.com/cdn/shop/files/yara.png?v=1724136443&width=600',
      descricao: 'Fragrância doce e floral.',
      ativo: true,
      tags: ['oferta relâmpago']
    },
    {
      id: '6',
      nome: 'Blue Lady',
      marca_id: '6',
      genero: 'feminino',
      preco: 459.90,
      imagem_url: 'https://rasasionline.com/cdn/shop/files/blue-lady.png?v=1724136443&width=600',
      descricao: 'Elegância e sofisticação em cada gota.',
      ativo: true,
      tags: ['lançamento']
    },
    {
      id: '7',
      nome: 'Oud Sahara',
      marca_id: '2',
      genero: 'masculino',
      preco: 529.90,
      imagem_url: 'https://en-ae.ajmal.com/cdn/shop/files/sahara-oudh.png?v=1724136443&width=600',
      descricao: 'Inspirado nas dunas do Saara.',
      ativo: true,
      tags: []
    },
    {
      id: '8',
      nome: 'Raghba',
      marca_id: '5',
      genero: 'unissex',
      preco: 159.90,
      imagem_url: 'https://lattafa.com/cdn/shop/files/raghba.png?v=1724136443&width=600',
      descricao: 'Fragrância doce oriental.',
      ativo: true,
      tags: ['promoção']
    },
    {
      id: '9',
      nome: 'Amber Oud',
      marca_id: '4',
      genero: 'unissex',
      preco: 679.90,
      imagem_url: 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-Gold-60ml-Bottle.jpg?v=1724061229&width=600',
      descricao: 'A combinação perfeita de âmbar e oud.',
      ativo: true,
      tags: []
    }
  ]

  const { error: produtosError } = await supabase
    .from('produtos')
    .upsert(produtos, { onConflict: 'id' })

  if (produtosError) console.log('Erro produtos:', produtosError.message)
  else console.log('✓ Produtos inseridos')
}

async function main() {
  const tablesExist = await testConnection()
  
  if (tablesExist) {
    await insertData()
    console.log('\n✅ Migração concluída!')
  } else {
    console.log('\n⚠️  As tabelas precisam ser criadas manualmente')
    console.log('\nCopie e cole este SQL no Supabase Dashboard → SQL Editor:\n')
    console.log('─'.repeat(60))
    
    const sql = `CREATE TABLE IF NOT EXISTS config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marcas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  marca_id UUID REFERENCES marcas(id),
  genero TEXT CHECK (genero IN ('masculino', 'feminino', 'unissex')),
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cliques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id),
  tipo TEXT CHECK (tipo IN ('view', 'click')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO marcas (id, nome) VALUES
  ('1', 'Amouage'),
  ('2', 'Ajmal'),
  ('3', 'Rasasi'),
  ('4', 'Al Haramain'),
  ('5', 'Lattafa'),
  ('6', 'Swiss Arabian')
ON CONFLICT (id) DO NOTHING;

INSERT INTO produtos (id, nome, marca_id, genero, preco, imagem_url, descricao, ativo, tags) VALUES
  ('1', 'Interlude Man', '1', 'masculino', 899.90, 'https://amouage.com/cdn/shop/files/Interlude-Man-100ml.png?v=1724136443&width=600', 'Um perfume oriental amadeirado para homens.', true, ARRAY['lançamento']),
  ('2', 'Jubilation XXV', '1', 'masculino', 1299.90, 'https://amouage.com/cdn/shop/files/jubilationXXV.png?v=1724136443&width=600', 'Uma celebração da vida e do sucesso.', true, ARRAY[]::TEXT[]),
  ('3', 'Oud Mood', '3', 'unissex', 349.90, 'https://lattafa.com/cdn/shop/files/oud-mood.png?v=1724136443&width=600', 'Fragrância oriental com notas de oud.', true, ARRAY['promoção']),
  ('4', 'Pure Oud', '4', 'masculino', 289.90, 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-60ml-Bottle.jpg?v=1724061272&width=600', 'Oud puro e autêntico do Oriente.', true, ARRAY[]::TEXT[]),
  ('5', 'Yara', '5', 'feminino', 199.90, 'https://lattafa.com/cdn/shop/files/yara.png?v=1724136443&width=600', 'Fragrância doce e floral.', true, ARRAY['oferta relâmpago']),
  ('6', 'Blue Lady', '6', 'feminino', 459.90, 'https://rasasionline.com/cdn/shop/files/blue-lady.png?v=1724136443&width=600', 'Elegância e sofisticação em cada gota.', true, ARRAY['lançamento']),
  ('7', 'Oud Sahara', '2', 'masculino', 529.90, 'https://en-ae.ajmal.com/cdn/shop/files/sahara-oudh.png?v=1724136443&width=600', 'Inspirado nas dunas do Saara.', true, ARRAY[]::TEXT[]),
  ('8', 'Raghba', '5', 'unissex', 159.90, 'https://lattafa.com/cdn/shop/files/raghba.png?v=1724136443&width=600', 'Fragrância doce oriental.', true, ARRAY['promoção']),
  ('9', 'Amber Oud', '4', 'unissex', 679.90, 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-Gold-60ml-Bottle.jpg?v=1724061229&width=600', 'A combinação perfeita de âmbar e oud.', true, ARRAY[]::TEXT[])
ON CONFLICT (id) DO NOTHING;

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cliques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON config FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON marcas FOR SELECT USING (true);
CREATE POLICY "Leitura pública" ON produtos FOR SELECT USING (true);
CREATE POLICY "Admin pode tudo" ON config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode tudo" ON marcas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin pode tudo" ON produtos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer um insere" ON cliques FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin vê cliques" ON cliques FOR SELECT USING (auth.role() = 'authenticated');`

    console.log(sql)
    console.log('─'.repeat(60))
    console.log('\nDepois de rodar o SQL, execute novamente: node scripts/run-migration.js')
  }
}

main().catch(console.error)
