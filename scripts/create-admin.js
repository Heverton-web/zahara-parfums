// Script para criar usuário admin no Supabase
// Execute este script com: node scripts/create-admin.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createAdmin() {
  console.log('Criando usuário admin...')

  const { data, error } = await supabase.auth.signUp({
    email: 'zahara@parfum.com',
    password: '@#Khen741963@#',
    options: {
      data: {
        nome: 'Administrador Zahara',
        role: 'admin'
      }
    }
  })

  if (error) {
    console.error('Erro ao criar usuário:', error.message)
    return
  }

  console.log('Usuário criado com sucesso!')
  console.log('Email:', data.user?.email)
  console.log('ID:', data.user?.id)
  
  // Inserir configuração do WhatsApp
  const { error: configError } = await supabase
    .from('config')
    .upsert({ 
      chave: 'whatsapp_numero', 
      valor: '5519981868198' 
    }, { onConflict: 'chave' })

  if (configError) {
    console.error('Erro ao inserir config WhatsApp:', configError.message)
  } else {
    console.log('Configuração WhatsApp inserida com sucesso!')
  }

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

  if (marcasError) {
    console.error('Erro ao inserir marcas:', marcasError.message)
  } else {
    console.log('Marcas inseridas com sucesso!')
  }

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

  if (produtosError) {
    console.error('Erro ao inserir produtos:', produtosError.message)
  } else {
    console.log('Produtos inseridos com sucesso!')
  }

  console.log('\nConfiguração concluída!')
  console.log('Acesse o painel admin em: /admin/login')
  console.log('Email: zahara@parfum.com')
  console.log('Senha: @#Khen741963@#')
}

createAdmin().catch(console.error)
