import { supabase } from './supabase'

export async function scrapeUrl(url) {
  const { data, error } = await supabase.functions.invoke('scrape-url', {
    body: { url },
  })

  if (error) throw error
  return data
}
