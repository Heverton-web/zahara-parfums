import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pzcxrctbdbbbnxamdvyl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6Y3hyY3RiZGJiYm54YW1kdnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjEzMjgsImV4cCI6MjEwMDkzNzMyOH0.N0zrdKlu4jiGgFNNc-Nw6sfMXn94l28LK-xclGTisDQ'

const supabase = createClient(supabaseUrl, supabaseKey)

// URLs de imagens que funcionam (CDNs públicos)
const novasImagens = {
  '1': 'https://www.rioperfumes.co.za/cdn/shop/files/Interlude-Man-100ml-Amouage.jpg?v=1706462513&width=600',
  '2': 'https://perfumesbyjs.com/cdn/shop/files/jubilationXXV.webp?v=1738042224&width=600',
  '3': 'https://intenseoud.com/cdn/shop/files/Oud-Mood-Lattafa.jpg?v=1695110055&width=600',
  '4': 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-60ml-Bottle.jpg?v=1724061272&width=600',
  '5': 'https://houseofessence.lk/cdn/shop/files/lattafa-yara-pink.jpg?v=1700000000&width=600',
  '6': 'https://rasasionline.com/cdn/shop/files/blue-lady.jpg?v=1700000000&width=600',
  '7': 'https://en-ae.ajmal.com/cdn/shop/files/sahara-oudh.jpg?v=1700000000&width=600',
  '8': 'https://lattafa.com/cdn/shop/files/raghba.jpg?v=1700000000&width=600',
  '9': 'https://alharamainperfumes.co.uk/cdn/shop/files/Amber-Oud-Gold-60ml-Bottle.jpg?v=1724061229&width=600'
}

// URLs alternativas mais simples (via placeholder service)
const imagensAlternativas = {
  '1': 'https://placehold.co/600x600/1a1a2e/gold?text=Amouage%0AInterlude+Man',
  '2': 'https://placehold.co/600x600/1a1a2e/gold?text=Amouage%0AJubilation+XXV',
  '3': 'https://placehold.co/600x600/1a1a2e/gold?text=Rasasi%0AOud+Mood',
  '4': 'https://placehold.co/600x600/1a1a2e/gold?text=Al+Haramain%0APure+Oud',
  '5': 'https://placehold.co/600x600/1a1a2e/gold?text=Lattafa%0AYara',
  '6': 'https://placehold.co/600x600/1a1a2e/gold?text=Swiss+Arabian%0ABlue+Lady',
  '7': 'https://placehold.co/600x600/1a1a2e/gold?text=Ajmal%0AOud+Sahara',
  '8': 'https://placehold.co/600x600/1a1a2e/gold?text=Lattafa%0ARaghba',
  '9': 'https://placehold.co/600x600/1a1a2e/gold?text=Al+Haramain%0AAmber+Oud'
}

async function updateImages() {
  console.log('Atualizando imagens no banco...\n')

  for (const [id, url] of Object.entries(imagensAlternativas)) {
    const { error } = await supabase
      .from('produtos')
      .update({ imagem_url: url })
      .eq('id', id)

    if (error) {
      console.log(`Erro produto ${id}:`, error.message)
    } else {
      console.log(`✓ Produto ${id} atualizado`)
    }
  }

  console.log('\nVerificando dados...')
  const { data } = await supabase.from('produtos').select('id, nome, imagem_url')
  data?.forEach(p => console.log(`${p.nome}: ${p.imagem_url?.substring(0, 50)}...`))
}

updateImages()
