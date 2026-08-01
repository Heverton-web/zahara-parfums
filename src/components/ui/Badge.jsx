export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-noir-800 text-ivory/80',
    gold: 'bg-gold text-noir-900',
    success: 'bg-emerald-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-noir-900',
    wine: 'bg-wine text-wine-100',
  }

  const borderColors = {
    default: 'rgba(212, 175, 55, 0.2)',
    gold: 'rgba(212, 175, 55, 0.5)',
    success: 'rgba(16, 185, 129, 0.5)',
    danger: 'rgba(239, 68, 68, 0.5)',
    warning: 'rgba(234, 179, 8, 0.5)',
    wine: 'rgba(220, 50, 100, 0.6)',
  }

  const glows = {
    gold: '0 0 12px rgba(212, 175, 55, 0.6), 0 0 24px rgba(212, 175, 55, 0.3)',
    success: '0 0 12px rgba(16, 185, 129, 0.6), 0 0 24px rgba(16, 185, 129, 0.3)',
    danger: '0 0 12px rgba(239, 68, 68, 0.6), 0 0 24px rgba(239, 68, 68, 0.3)',
    warning: '0 0 12px rgba(234, 179, 8, 0.6), 0 0 24px rgba(234, 179, 8, 0.3)',
    wine: '0 0 12px rgba(220, 50, 100, 0.6), 0 0 24px rgba(220, 50, 100, 0.3)',
  }

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider badge-pulse ${variants[variant]} ${className}`}
      style={{
        border: `1px solid ${borderColors[variant]}`,
        boxShadow: glows[variant] || 'none',
      }}
    >
      {children}
    </span>
  )
}
