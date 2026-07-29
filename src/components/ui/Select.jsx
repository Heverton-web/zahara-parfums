export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <select
        className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold ${className}`}
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
