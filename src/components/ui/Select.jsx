export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-accent text-[10px] uppercase tracking-wider text-ivory/50">
          {label}
        </label>
      )}
      <select
        className={`input-luxury min-w-[140px] cursor-pointer text-sm ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
