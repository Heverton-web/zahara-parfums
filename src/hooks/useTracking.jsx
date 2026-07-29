import { useCallback } from 'react'
import { registerEvent } from '../lib/tracking'

export function useTracking() {
  const trackView = useCallback(async (produtoId) => {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const { ip } = await res.json()
      await registerEvent(produtoId, 'view', ip)
    } catch (err) {
      console.error('Erro ao registrar view:', err)
    }
  }, [])

  const trackClick = useCallback(async (produtoId) => {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const { ip } = await res.json()
      await registerEvent(produtoId, 'click', ip)
    } catch (err) {
      console.error('Erro ao registrar clique:', err)
    }
  }, [])

  return { trackView, trackClick }
}
