// Supabase Edge Function: scrape-fragrantica
// Faz busca e scraping de perfumes no Fragrantica (server-side, sem CORS)
// Deploy: supabase functions deploy scrape-fragrantica

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Restrict in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, query } = await req.json()

    // Modo busca: pesquisar por nome
    if (query) {
      const searchResults = await searchPerfume(query)
      return new Response(
        JSON.stringify(searchResults),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Modo scrape: extrair dados de uma URL
    if (url && url.includes('fragrantica.com')) {
      const productData = await scrapeProductPage(url)
      return new Response(
        JSON.stringify(productData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Parâmetros inválidos' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
}

// SSRF Protection: URL allowlist
const ALLOWED_HOSTS = ['www.fragrantica.com.br', 'www.fragrantica.com', 'fragrantica.com.br', 'fragrantica.com']

function isAllowedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr)
    if (!ALLOWED_HOSTS.includes(url.hostname)) return false
    if (url.protocol !== 'https:') return false
    // Block internal IPs
    const hostname = url.hostname
    if (hostname.startsWith('127.') || hostname.startsWith('10.') || 
        hostname.startsWith('192.168.') || hostname.startsWith('172.')) return false
    return true
  } catch {
    return false
  }
}

async function searchPerfume(query: string) {
  const searchUrl = `https://www.fragrantica.com.br/search/?query=${encodeURIComponent(query)}`
  
  const resp = await fetch(searchUrl, { headers: HEADERS, redirect: 'follow' })
  if (!resp.ok) throw new Error(`Search failed: ${resp.status}`)
  
  const html = await resp.text()
  return parseSearchResults(html, query)
}

function parseSearchResults(html: string, originalQuery: string) {
  const results: Array<{name: string, brand: string, url: string, image: string}> = []
  
  // Extrair links de perfumes
  const linkRegex = /href="(\/perfume\/[^"]+)"/g
  const seen = new Set<string>()
  let match
  
  while ((match = linkRegex.exec(html)) !== null) {
    const path = match[1]
    if (seen.has(path)) continue
    seen.add(path)
    
    const fullUrl = `https://www.fragrantica.com.br${path}`
    
    // Extrair nome e marca do URL (formato: /perfume/Marca/Nome-do-Perfume-ID)
    const parts = path.split('/')
    const brand = parts[2]?.replace(/-/g, ' ') || ''
    const nameSlug = parts[3]?.replace(/-\d+$/, '').replace(/-/g, ' ') || ''
    
    if (nameSlug) {
      results.push({
        name: capitalizeWords(nameSlug),
        brand: capitalizeWords(brand),
        url: fullUrl,
        image: '',
      })
    }
    
    if (results.length >= 6) break
  }

  // Se não encontrou via URL, tentar extrair de outros padrões
  if (results.length === 0) {
    // Buscar títulos que contenham o nome buscado
    const titleRegex = /<[^>]*class="[^"]*cell[^"]*"[^>]*>[\s\S]*?<\/div>/gi
    while ((match = titleRegex.exec(html)) !== null && results.length < 6) {
      const block = match[0]
      const linkMatch = block.match(/href="(\/perfume\/[^"]+)"/)
      const nameMatch = block.match(/<b[^>]*>([^<]+)<\/b>/)
      
      if (linkMatch && nameMatch) {
        const url = `https://www.fragrantica.com.br${linkMatch[1]}`
        if (!results.find(r => r.url === url)) {
          results.push({
            name: nameMatch[1].trim(),
            brand: '',
            url,
            image: '',
          })
        }
      }
    }
  }

  return results.length > 0 ? results : [{ name: originalQuery, brand: '', url: '', image: '', notFound: true }]
}

async function scrapeProductPage(url: string) {
  if (!isAllowedUrl(url)) throw new Error('URL not allowed')
  const resp = await fetch(url, { headers: HEADERS, redirect: 'follow' })
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`)
  
  const html = await resp.text()
  
  const data = {
    name: '',
    brand: '',
    description: '',
    image: '',
    gender: 'unissex',
  }

  // Nome e marca
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    const full = h1Match[1].replace(/<[^>]+>/g, '').trim()
    const parts = full.match(/(.+?)\s+de\s+(.+)/i)
    if (parts) {
      data.name = parts[1].trim()
      data.brand = parts[2].trim()
    } else {
      data.name = full
    }
  }

  // Imagem OG
  const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
  if (ogMatch) data.image = ogMatch[1]

  // Gênero
  if (/feminino|feminin/i.test(html)) data.gender = 'feminino'
  else if (/masculino|masculin/i.test(html)) data.gender = 'masculino'

  // Descrição - accords
  const accordMatch = html.match(/class="accord-bar"[^>]*>([\s\S]*?)<\/div>/i)
  if (accordMatch) {
    data.description = accordMatch[1].replace(/<[^>]+>/g, '').trim()
  }

  // Fallback: parágrafos
  if (!data.description) {
    const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)
    if (pMatches) {
      const texts = pMatches
        .map(p => p.replace(/<[^>]+>/g, '').trim())
        .filter(t => t.length > 30 && !t.includes('cookie') && !t.includes('JavaScript'))
        .slice(0, 2)
      if (texts.length) data.description = texts.join(' ').slice(0, 500)
    }
  }

  return data
}

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}
