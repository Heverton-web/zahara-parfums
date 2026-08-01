export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm'

  const variants = {
    primary: 'btn-luxury',
    secondary: 'bg-noir-800 text-ivory hover:bg-noir-700',
    danger: 'bg-wine/80 text-white hover:bg-wine',
    ghost: 'text-ivory/60 hover:text-ivory hover:bg-noir-800',
    outline: 'text-gold hover:bg-gold/10',
  }

  const borderStyles = {
    primary: '',
    secondary: '0.25px solid rgba(212, 175, 55, 0.15)',
    danger: '0.25px solid rgba(153, 27, 27, 0.5)',
    ghost: '',
    outline: '0.25px solid rgba(212, 175, 55, 0.3)',
  }

  return (
    <button 
      className={`${base} ${variants[variant]} ${className}`} 
      style={borderStyles[variant] ? { border: borderStyles[variant] } : undefined}
      {...props}
    >
      {children}
    </button>
  )
}
