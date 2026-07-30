export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-noir-900 rounded-xl p-6 ${className}`}
      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
      {...props}
    >
      {children}
    </div>
  )
}
