export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-accent text-[10px] uppercase tracking-wider text-ivory/50">
          {label}
        </label>
      )}
      <input
        className={`input-luxury ${error ? 'border-red-500/50' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  )
}
