// Supabase Edge Function: scrape-fragrantica
// Faz busca e scraping de perfumes no Fragrantica (server-side, sem CORS)
// Deploy: supabase functions deploy scrape-fragrantica

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { action, query, url, brandSlug } = body

    // Modo 1: Buscar marcas por nome
    if (action === 'searchBrands' && query) {
      const brands = await searchBrands(query)
      return jsonResponse(brands)
    }

    // Modo 2: Listar perfumes de uma marca
    if (action === 'listPerfumes' && brandSlug) {
      const perfumes = await listPerfumesByBrand(brandSlug)
      return jsonResponse(perfumes)
    }

    // Modo 3: Scrape detalhes de um perfume (legado, mantido para compatibilidade)
    if (action === 'scrapePerfume' && url) {
      const data = await scrapeProductPage(url)
      return jsonResponse(data)
    }

    // Legado: modo busca por query (substituído por searchBrands)
    if (query && !action) {
      const brands = await searchBrands(query)
      return jsonResponse(brands)
    }

    // Legado: modo scrape por url (substituído por scrapePerfume)
    if (url && !action) {
      if (!isAllowedUrl(url)) throw new Error('URL not allowed')
      const data = await scrapeProductPage(url)
      return jsonResponse(data)
    }

    return new Response(
      JSON.stringify({ error: 'Parâmetros inválidos. Use: {action: "searchBrands", query} ou {action: "listPerfumes", brandSlug} ou {action: "scrapePerfume", url}' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function jsonResponse(data: unknown) {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// ─── Constants ───────────────────────────────────────────────

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
}

const BASE_URL = 'https://www.fragrantica.com.br'

const ALLOWED_HOSTS = ['www.fragrantica.com.br', 'www.fragrantica.com', 'fragrantica.com.br', 'fragrantica.com']

// ─── SSRF Protection ─────────────────────────────────────────

function isAllowedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr)
    if (!ALLOWED_HOSTS.includes(url.hostname)) return false
    if (url.protocol !== 'https:') return false
    const hostname = url.hostname
    if (hostname.startsWith('127.') || hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') || hostname.startsWith('172.')) return false
    return true
  } catch {
    return false
  }
}

// ─── Search Brands ───────────────────────────────────────────

async function searchBrands(query: string): Promise<Array<{name: string, slug: string, url: string, image: string}>> {
  // Busca na página principal de designers
  const searchUrl = `${BASE_URL}/desenhista/`
  const resp = await fetch(searchUrl, { headers: HEADERS, redirect: 'follow' })
  if (!resp.ok) throw new Error(`Failed to fetch designers page: ${resp.status}`)

  const html = await resp.text()
  return parseBrandLinks(html, query)
}

function parseBrandLinks(html: string, query: string): Array<{name: string, slug: string, url: string, image: string}> {
  const results: Array<{name: string, slug: string, url: string, image: string}> = []
  const seen = new Set<string>()

  // Padrão: href="/desenhista/Brand-Name.html"
  const linkRegex = /href="(\/desenhista\/[^"]+\.html)"/g
  let match

  while ((match = linkRegex.exec(html)) !== null) {
    const path = match[1]
    if (seen.has(path)) continue
    seen.add(path)

    // Extrair slug: "Al-Haramain-Perfumes" de "/desenhista/Al-Haramain-Perfumes.html"
    const slug = path.replace('/desenhista/', '').replace('.html', '')
    const name = slug.replace(/-/g, ' ')

    // Fuzzy match: normalizar e verificar se query está contida
    const normalizedName = name.toLowerCase()
    const normalizedQuery = query.toLowerCase().trim()
    if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
      results.push({
        name: capitalizeWords(name),
        slug,
        url: `${BASE_URL}${path}`,
        image: '',
      })
    }

    if (results.length >= 10) break
  }

  // Se nenhum match exato, retornar os primeiros (para debug)
  if (results.length === 0) {
    // Fallback: tentar match parcial com tolerância a erros
    const allBrands: Array<{name: string, slug: string}> = []
    const fallbackRegex = /href="\/desenhista\/([^"]+\.html)"/g
    while ((match = fallbackRegex.exec(html)) !== null) {
      const slug = match[1].replace('.html', '')
      allBrands.push({ name: slug.replace(/-/g, ' '), slug })
    }

    // Busca parcial: cada token da query deve aparecer em algum lugar do nome
    const queryTokens = query.toLowerCase().trim().split(/\s+/)
    for (const brand of allBrands) {
      const nameLower = brand.name.toLowerCase()
      if (queryTokens.every(token => nameLower.includes(token))) {
        results.push({
          name: capitalizeWords(brand.name),
          slug: brand.slug,
          url: `${BASE_URL}/desenhista/${brand.slug}.html`,
          image: '',
        })
        if (results.length >= 10) break
      }
    }
  }

  return results
}

// ─── List Perfumes by Brand ──────────────────────────────────

async function listPerfumesByBrand(brandSlug: string): Promise<{brand: {name: string, slug: string, url: string, image: string, description: string}, perfumes: Array<{name: string, url: string, gender: string, year: string}>}> {
  const brandUrl = `${BASE_URL}/desenhista/${brandSlug}.html`

  if (!isAllowedUrl(brandUrl)) throw new Error('Invalid brand slug')

  const resp = await fetch(brandUrl, { headers: HEADERS, redirect: 'follow' })
  if (!resp.ok) throw new Error(`Failed to fetch brand page: ${resp.status}`)

  const html = await resp.text()
  return parseBrandPage(html, brandSlug)
}

function parseBrandPage(html: string, brandSlug: string): {brand: {name: string, slug: string, url: string, image: string, description: string}, perfumes: Array<{name: string, url: string, gender: string, year: string}>} {
  // Extrair dados da marca
  const brand: {name: string, slug: string, url: string, image: string, description: string} = {
    name: brandSlug.replace(/-/g, ' '),
    slug: brandSlug,
    url: `${BASE_URL}/desenhista/${brandSlug}.html`,
    image: '',
    description: '',
  }

  // Nome da marca do h1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    brand.name = capitalizeWords(h1Match[1].replace(/<[^>]+>/g, '').replace(/\s*Perfumes?\s*(e\s*Col[oô]nias)?\s*/i, '').trim())
  }

  // Logo/imagem da marca
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
  if (ogImageMatch) brand.image = ogImageMatch[1]

  // Descrição
  const descMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  if (descMatch) {
    brand.description = descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 300)
  }

  // Extrair perfumes da marca
  const perfumes: Array<{name: string, url: string, gender: string, year: string}> = []
  const seen = new Set<string>()

  // Padrão: href="/perfume/Brand/Perfume-Name-ID.html" title="Brand Perfume Gender Year"
  // O title contém: "Brand Name Gender Year"
  const perfumeRegex = /href="(\/perfume\/[^"]+)"[^>]*title="([^"]*)"/g
  let match

  while ((match = perfumeRegex.exec(html)) !== null) {
    const path = match[1]
    const title = match[2]

    if (seen.has(path)) continue
    seen.add(path)

    // Extrair nome do perfume do slug: /perfume/Brand/Ajwa-19805.html → "Ajwa"
    const slugParts = path.split('/')
    const perfumeSlug = slugParts[3] || ''  // "Ajwa-19805.html"
    const perfumeName = perfumeSlug.replace(/-\d+\.html$/, '').replace(/-/g, ' ')

    // Extrair gênero e ano do title
    // title format: "Brand PerfumeName Gender Year" ou "Brand PerfumeName Gender"
    const titleParts = title.trim().split(/\s+/)
    let gender = 'unissex'
    let year = ''

    // Último token pode ser ano (4 dígitos)
    const lastPart = titleParts[titleParts.length - 1]
    if (/^\d{4}$/.test(lastPart)) {
      year = lastPart
      // Penúltimo token é gênero
      const genderCandidate = titleParts[titleParts.length - 2]?.toLowerCase()
      if (['masculino', 'feminino', 'unissex'].includes(genderCandidate)) {
        gender = genderCandidate
      }
    } else {
      // Último token é gênero
      const genderCandidate = lastPart?.toLowerCase()
      if (['masculino', 'feminino', 'unissex'].includes(genderCandidate)) {
        gender = genderCandidate
      }
    }

    perfumes.push({
      name: capitalizeWords(perfumeName),
      url: `${BASE_URL}${path}`,
      gender,
      year,
    })
  }

  return { brand, perfumes }
}

// ─── Scrape Product Page ─────────────────────────────────────

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

  // Extrair marca do URL: /perfume/Brand/Name-ID.html
  const urlBrandMatch = url.match(/\/perfume\/([^/]+)\//)
  if (urlBrandMatch) {
    data.brand = urlBrandMatch[1].replace(/-/g, ' ')
  }

  // Nome via h1[itemprop="name"]
  // h1 tipico: "Angel Al Haramain Perfumes <span>Compartilhável</span>"
  // Apos remover tags: "Angel Al Haramain Perfumes Compartilhável"
  const h1Match = html.match(/<h1[^>]*itemprop="name"[^>]*>([\s\S]*?)<\/h1>/i)
  if (h1Match) {
    // Extrair conteudo do <span> (atributo como "Compartilhável")
    const spanMatch = h1Match[1].match(/<span[^>]*>([\s\S]*?)<\/span>/i)
    const attribute = spanMatch ? spanMatch[1].replace(/<[^>]+>/g, '').trim() : ''
    // Texto completo sem tags
    let full = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    // Remover atributo do final
    if (attribute && full.toLowerCase().endsWith(attribute.toLowerCase())) {
      full = full.slice(0, full.length - attribute.length).trim()
    }
    // Remover marca (ex: "Angel Al Haramain Perfumes" → "Angel")
    if (data.brand) {
      const idx = full.toLowerCase().indexOf(data.brand.toLowerCase())
      if (idx > 0) {
        full = full.slice(0, idx).trim()
      } else if (full.toLowerCase().endsWith(data.brand.toLowerCase())) {
        full = full.slice(0, full.length - data.brand.length).trim()
      }
    }
    data.name = full
  }

  // Imagem via itemprop="image"
  const imgMatch = html.match(/<img\s+[^>]*itemprop="image"[^>]*\ssrc="([^"]+)"/i)
  if (imgMatch) {
    data.image = imgMatch[1]
  } else {
    // Fallback: OG image
    const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
    if (ogMatch) data.image = ogMatch[1]
  }

  // Gênero via h1 ou title
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const titleText = titleTag ? titleTag[1].replace(/<[^>]+>/g, '') : ''
  if (/feminino|feminin/i.test(titleText) || /feminino|feminin/i.test(html.substring(0, 5000))) {
    data.gender = 'feminino'
  } else if (/masculino|masculin/i.test(titleText) || /masculino|masculin/i.test(html.substring(0, 5000))) {
    data.gender = 'masculino'
  }

  // Descrição via #perfume-description-content
  const descMatch = html.match(/<div[^>]*id="perfume-description-content"[^>]*>([\s\S]*?)<\/div>/i)
  if (descMatch) {
    data.description = descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 500)
  }

  // Fallback: accords
  if (!data.description) {
    const accordMatch = html.match(/class="accord-bar"[^>]*>([\s\S]*?)<\/div>/i)
    if (accordMatch) {
      data.description = accordMatch[1].replace(/<[^>]+>/g, '').trim()
    }
  }

  // Fallback: parágrafos
  if (!data.description) {
    const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi)
    if (pMatches) {
      const texts = pMatches
        .map(p => p.replace(/<[^>]+>/g, '').trim())
        .filter(t => t.length > 30 && !t.includes('cookie') && !t.includes('JavaScript') && !t.includes('©'))
        .slice(0, 2)
      if (texts.length) data.description = texts.join(' ').slice(0, 500)
    }
  }

  return data
}

// ─── Helpers ─────────────────────────────────────────────────

function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}
