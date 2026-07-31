// Supabase Edge Function: scrape-url
// Extrai dados de produto de qualquer URL (marca, Google Shopping, etc.)
// Deploy: supabase functions deploy scrape-url

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
    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return jsonResponse({ error: 'URL é obrigatória' }, 400)
    }

    // Validação básica de URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return jsonResponse({ error: 'URL inválida' }, 400)
    }

    // Bloquear localhost e IPs internos (SSRF protection)
    const hostname = parsedUrl.hostname.toLowerCase()
    if (hostname === 'localhost' || hostname.startsWith('127.') || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname === '::1') {
      return jsonResponse({ error: 'URL não permitida' }, 400)
    }

    // Buscar HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return jsonResponse({ error: `Erro ao acessar URL: ${response.status}` }, 400)
    }

    const html = await response.text()

    // Extrair dados usando regex (Deno não tem cheerio nativo)
    const data = extractProductData(html, url)

    return jsonResponse(data)
  } catch (error) {
    console.error('Scrape error:', error)
    return jsonResponse({ error: 'Erro ao processar URL' }, 500)
  }
})

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ─── Extract Product Data from HTML ──────────────────────────

function extractProductData(html: string, url: string) {
  const result = {
    nome: '',
    descricao: '',
    imagem_url: '',
    preco_ref: '',
    genero: 'unissex' as string,
    brand: '',
  }

  // 1. Nome do produto
  result.nome = (
    metaContent(html, 'og:title') ||
    metaContent(html, 'twitter:title') ||
    extractTagContent(html, 'title') ||
    ''
  ).trim()

  // Limpar nome: remover "- Marca" ou "| Marca" do final
  result.nome = result.nome
    .replace(/\s*[-|–]\s*(Lattafa|Ajmal|Rasasi|Al Haramain|Swiss Arabian|Amouage|Arabian Oud|Nabeel|Emper|Al Rehab|Asdaaf|Ameerat|Reyane|Bade'e|Lattafa Pride).*$/i, '')
    .replace(/\s*[-|–]\s*(Amazon|Mercado Livre|Magazine Luiza|Americanas).*$/i, '')
    .trim()

  // 2. Descrição
  result.descricao = (
    metaContent(html, 'og:description') ||
    metaContent(html, 'description') ||
    metaContent(html, 'twitter:description') ||
    ''
  ).trim()

  // Limitar descrição a 500 chars
  if (result.descricao.length > 500) {
    result.descricao = result.descricao.substring(0, 497) + '...'
  }

  // 3. Imagem
  result.imagem_url = (
    metaContent(html, 'og:image') ||
    metaContent(html, 'twitter:image') ||
    ''
  ).trim()

  // Garantir URL absoluta da imagem
  if (result.imagem_url && !result.imagem_url.startsWith('http')) {
    try {
      const base = new URL(url)
      result.imagem_url = new URL(result.imagem_url, base.origin).href
    } catch {}
  }

  // 4. Preço de referência (de Google Shopping, marketplaces)
  const pricePatterns = [
    /(?:price|preco|preço)["':\s]*(?:R\$?\s*)?([\d.,]+)/i,
    /R\$\s*([\d]+[.,][\d]{2})/,
    /"price"\s*:\s*"?([\d.,]+)/i,
    /itemprop="price"\s*content="([\d.,]+)"/i,
  ]
  for (const pattern of pricePatterns) {
    const match = html.match(pattern)
    if (match) {
      result.preco_ref = match[1].replace('.', '').replace(',', '.')
      break
    }
  }

  // 5. Gênero (inferir do conteúdo)
  const lowerHtml = html.toLowerCase()
  const lowerNome = result.nome.toLowerCase()
  const lowerDesc = result.descricao.toLowerCase()
  const combined = lowerNome + ' ' + lowerDesc

  if (combined.includes('feminino') || combined.includes('feminina') || combined.includes('woman') || combined.includes('women') || combined.includes('♀')) {
    result.genero = 'feminino'
  } else if (combined.includes('masculino') || combined.includes('masculina') || combined.includes('man') || combined.includes('men ') || combined.includes('♂')) {
    result.genero = 'masculino'
  }

  // 6. Marca (do domínio ou conteúdo)
  result.brand = extractBrand(html, url, result.nome)

  return result
}

// ─── Helpers ─────────────────────────────────────────────────

function metaContent(html: string, name: string): string {
  // property="og:image" or name="description"
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escapeRegex(name)}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escapeRegex(name)}["']`, 'i'),
  ]
  for (const p of patterns) {
    const m = html.match(p)
    if (m) return m[1]
  }
  return ''
}

function extractTagContent(html: string, tag: string): string {
  const m = html.match(new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i'))
  return m ? m[1] : ''
}

function extractBrand(html: string, url: string, nome: string): string {
  // Tentar extrair marca do nome (última palavra geralmente é a marca em perfumes árabes)
  // ou do domínio
  const domain = new URL(url).hostname.replace('www.', '').split('.')[0]
  const brandMap: Record<string, string> = {
    'lattafa': 'Lattafa',
    'ajmal': 'Ajmal',
    'rasasi': 'Rasasi',
    'alharamain': 'Al Haramain',
    'swissarabian': 'Swiss Arabian',
    'amouage': 'Amouage',
    'arabianoud': 'Arabian Oud',
    'nabeel': 'Nabeel',
    'asdaaf': 'Asdaaf',
    'emper': 'Emper',
  }
  if (brandMap[domain]) return brandMap[domain]

  // Extrair de meta tags
  const brandMeta = metaContent(html, 'og:site_name') || metaContent(html, 'brand')
  if (brandMeta) return brandMeta.split(' - ')[0].split(' | ')[0].trim()

  return ''
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
