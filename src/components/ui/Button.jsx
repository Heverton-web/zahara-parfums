export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'btn-luxury',
    secondary: 'bg-noir-800 text-ivory hover:bg-noir-700 border border-noir-700 hover:border-gold/30',
    danger: 'bg-wine/80 text-white hover:bg-wine border border-wine/50',
    ghost: 'text-ivory/60 hover:text-ivory hover:bg-noir-800',
    outline: 'border border-gold/30 text-gold hover:bg-gold/10',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
