export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-noir-800 text-ivory/80',
    gold: 'bg-gold/30 text-gold-light',
    success: 'bg-emerald-500/30 text-emerald-300',
    danger: 'bg-red-500/30 text-red-300',
    warning: 'bg-yellow-500/30 text-yellow-300',
    wine: 'bg-wine/40 text-wine-100',
  }

  const borderColors = {
    default: 'rgba(212, 175, 55, 0.2)',
    gold: 'rgba(212, 175, 55, 0.5)',
    success: 'rgba(16, 185, 129, 0.5)',
    danger: 'rgba(239, 68, 68, 0.5)',
    warning: 'rgba(234, 179, 8, 0.5)',
    wine: 'rgba(220, 50, 100, 0.6)',
  }

  const shadows = {
    gold: '0 0 8px rgba(201, 168, 76, 0.3)',
    success: '0 0 8px rgba(16, 185, 129, 0.3)',
    danger: '0 0 8px rgba(239, 68, 68, 0.3)',
    warning: '0 0 8px rgba(234, 179, 8, 0.3)',
    wine: '0 0 10px rgba(200, 50, 100, 0.4)',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
      style={{
        border: `1px solid ${borderColors[variant]}`,
        boxShadow: shadows[variant] || 'none',
      }}
    >
      {children}
    </span>
  )
}
