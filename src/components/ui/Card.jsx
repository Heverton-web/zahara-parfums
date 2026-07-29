export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
