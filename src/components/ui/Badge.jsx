export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-noir-800/80 text-ivory/70',
    gold: 'bg-gold/15 text-gold',
    success: 'bg-emerald-500/15 text-emerald-400',
    danger: 'bg-red-500/15 text-red-400',
    warning: 'bg-yellow-500/15 text-yellow-400',
    wine: 'bg-wine/15 text-wine-300',
  }

  const borderColors = {
    default: 'rgba(212, 175, 55, 0.15)',
    gold: 'rgba(212, 175, 55, 0.3)',
    success: 'rgba(16, 185, 129, 0.3)',
    danger: 'rgba(239, 68, 68, 0.3)',
    warning: 'rgba(234, 179, 8, 0.3)',
    wine: 'rgba(153, 27, 27, 0.3)',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${variants[variant]} ${className}`}
      style={{ border: `0.25px solid ${borderColors[variant]}` }}
    >
      {children}
    </span>
  )
}
