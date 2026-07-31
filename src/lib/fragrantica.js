// Utilitário para busca de perfumes no Fragrantica
// Usa Supabase Edge Function (server-side, sem CORS)

import { supabase } from './supabase'

const BASE_BRAND_URL = 'https://www.fragrantica.com.br/desenhista/'

// ─── Step 1: Buscar marcas ──────────────────────────────────

export async function searchBrands(query) {
  if (!query || query.trim().length < 2) return []

  const { data, error } = await supabase.functions.invoke('scrape-fragrantica', {
    body: { action: 'searchBrands', query: query.trim() },
  })

  if (error) throw error
  return data || []
}

// ─── Step 2: Listar perfumes de uma marca ────────────────────

export async function listPerfumesByBrand(brandSlug) {
  if (!brandSlug) return null

  const { data, error } = await supabase.functions.invoke('scrape-fragrantica', {
    body: { action: 'listPerfumes', brandSlug },
  })

  if (error) throw error
  return data
}

// ─── Step 3: Scrape detalhes do perfume ──────────────────────

export async function scrapeFragrantica(url) {
  if (!url || !url.includes('fragrantica.com')) return null

  const { data, error } = await supabase.functions.invoke('scrape-fragrantica', {
    body: { action: 'scrapePerfume', url },
  })

  if (error) throw error
  return data
}

// ─── Helpers ─────────────────────────────────────────────────

export function openFragranticaSearch(query) {
  const searchUrl = `https://www.fragrantica.com.br/search/?query=${encodeURIComponent(query)}`
  window.open(searchUrl, '_blank')
}

export function openFragranticaBrand(brandSlug) {
  window.open(`${BASE_BRAND_URL}${brandSlug}.html`, '_blank')
}

export function isFragranticaUrl(url) {
  return url && url.includes('fragrantica.com')
}

// Padrão: fragrantica.com.br/perfume/{Marca}/{Nome-Perfume}-{ID}.html
const FRAGRANTICA_PERFUME_RE = /fragrantica\.com\.?\w*\/perfume\/([^/]+)\/([^-]+)-(\d+)\.html/

export function parseFragranticaUrl(url) {
  const match = url?.match(FRAGRANTICA_PERFUME_RE)
  if (!match) return null
  return {
    brand: match[1].replace(/-/g, ' '),
    name: match[2].replace(/-/g, ' '),
    id: match[3],
  }
}

export function validateFragranticaUrl(url) {
  return FRAGRANTICA_PERFUME_RE.test(url)
}

export function matchMarca(searchBrand, marcas) {
  if (!searchBrand || !marcas?.length) return null

  const normalized = searchBrand.toLowerCase().trim()

  return marcas.find(m => {
    const marcaNome = m.nome.toLowerCase().trim()
    return marcaNome === normalized ||
           normalized.includes(marcaNome) ||
           marcaNome.includes(normalized)
  }) || null
}
