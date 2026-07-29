export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-noir-900/50 border border-noir-800 rounded-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
