import { useState, useEffect, useCallback } from 'react'

function calcularRestante(targetDate) {
  const now = new Date().getTime()
  const target = new Date(targetDate).getTime()
  const diff = target - now

  if (diff <= 0) {
    return { dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0, expirado: true }
  }

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    segundos: Math.floor((diff % (1000 * 60)) / 1000),
    total: diff,
    expirado: false,
  }
}

export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calcularRestante(targetDate))

  useEffect(() => {
    if (!targetDate) return

    setTimeLeft(calcularRestante(targetDate))

    const timer = setInterval(() => {
      const restante = calcularRestante(targetDate)
      setTimeLeft(restante)
      if (restante.total <= 0) clearInterval(timer)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatado = useCallback(() => {
    if (timeLeft.expirado) return null
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(timeLeft.dias)}d ${pad(timeLeft.horas)}h ${pad(timeLeft.minutos)}m ${pad(timeLeft.segundos)}s`
  }, [timeLeft])

  return { ...timeLeft, formatado: formatado() }
}
