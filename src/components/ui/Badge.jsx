export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-noir-800/80 text-ivory/70 border-noir-700',
    gold: 'bg-gold/15 text-gold border-gold/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    wine: 'bg-wine/15 text-wine-300 border-wine/30',
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
