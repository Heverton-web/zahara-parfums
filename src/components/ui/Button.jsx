export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

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
