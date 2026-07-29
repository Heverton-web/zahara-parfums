export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-800 text-gray-300',
    gold: 'bg-gold/20 text-gold',
    success: 'bg-green-500/20 text-green-400',
    danger: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
