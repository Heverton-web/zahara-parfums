import { useCountdown } from '../../hooks/useCountdown'

export default function CountdownTimer({ dataFim, size = 'sm' }) {
  const { formatado, expirado, total } = useCountdown(dataFim)

  if (expirado || !formatado) return null

  // Urgência: menos de 1 hora
  const isUrgente = total < 1000 * 60 * 60

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2',
  }

  const textColors = isUrgente
    ? 'text-red-400'
    : 'text-ivory/80'

  return (
    <div
      className={`inline-flex items-center font-mono font-bold rounded-full ${sizes[size]} ${textColors}`}
      style={{
        border: `1px solid ${isUrgente ? 'rgba(239, 68, 68, 0.4)' : 'rgba(212, 175, 55, 0.3)'}`,
        background: isUrgente
          ? 'rgba(239, 68, 68, 0.08)'
          : 'rgba(212, 175, 55, 0.06)',
      }}
    >
      <span className={`${isUrgente ? 'animate-pulse' : ''}`}>🔥</span>
      <span>{formatado}</span>
    </div>
  )
}
