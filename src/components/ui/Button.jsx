export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gold text-zinc-950 hover:bg-gold-light',
    secondary: 'bg-zinc-800 text-gray-100 hover:bg-zinc-700 border border-zinc-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-400 hover:text-white hover:bg-zinc-800',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
