import { supabase } from './supabase'
import UAParser from 'ua-parser-js'

export function parseUserAgent(ua) {
  const parser = new UAParser(ua)
  const result = parser.getResult()

  return {
    navegador: result.browser.name || 'Desconhecido',
    so: result.os.name || 'Desconhecido',
    dispositivo: result.device.type || 'desktop',
  }
}

export async function getCountry(ip) {
  try {
    const res = await fetch(`https://ip-api.com/json/${ip}`)
    const data = await res.json()
    return data.country || 'Desconhecido'
  } catch {
    return 'Desconhecido'
  }
}

export function generateFingerprint() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('fingerprint', 2, 2)

  const components = [
    screen.width + 'x' + screen.height,
    navigator.language,
    navigator.plugins.length,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ]

  return components.join('|')
}

export async function registerEvent(produtoId, tipo, ip) {
  try {
    const ua = navigator.userAgent
    const parsed = parseUserAgent(ua)
    const fingerprint = generateFingerprint()
    const pais = await getCountry(ip)

    const { error } = await supabase.from('tracking').insert({
      produto_id: produtoId,
      tipo,
      ip,
      user_agent: ua,
      dispositivo: parsed.dispositivo,
      navegador: parsed.navegador,
      so: parsed.so,
      pais,
      fingerprint,
      referrer: document.referrer || null,
    })
    if (error) console.warn('Tracking insert error:', error)
  } catch (err) {
    console.warn('Tracking failed:', err)
  }
}
