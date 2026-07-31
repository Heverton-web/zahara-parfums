// Utilitário para busca de perfumes no Fragrantica
// Usa Supabase Edge Function (server-side, sem CORS)

import { supabase } from './supabase'

export async function searchAndScrape(query) {
  if (!query || query.trim().length < 2) return null

  const { data, error } = await supabase.functions.invoke('scrape-fragrantica', {
    body: { query },
  })

  if (error) throw error
  return data
}

export async function scrapeFragrantica(url) {
  if (!url || !url.includes('fragrantica.com')) return null

  const { data, error } = await supabase.functions.invoke('scrape-fragrantica', {
    body: { url },
  })

  if (error) throw error
  return data
}

export function openFragranticaSearch(query) {
  const searchUrl = `https://www.fragrantica.com.br/search/?query=${encodeURIComponent(query)}`
  window.open(searchUrl, '_blank')
}

export function isFragranticaUrl(url) {
  return url && url.includes('fragrantica.com')
}

// Padrão: fragrantica.com.br/perfume/{Marca}/{Nome-Perfume}-{ID}.html
// Ex: fragrantica.com.br/perfume/Creed/Aventus-for-Her-38497.html
// Ex: fragrantica.com.br/perfume/French-Avenue/Liquid-Brun-94713.html
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
