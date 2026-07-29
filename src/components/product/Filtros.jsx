import Select from '../ui/Select'

const generos = [
  { value: '', label: 'Todos' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'unissex', label: 'Unissex' },
]

const tags = [
  { value: '', label: 'Todas' },
  { value: 'lançamento', label: 'Lançamento' },
  { value: 'promoção', label: 'Promoção' },
  { value: 'oferta relâmpago', label: 'Oferta Relâmpago' },
]

export default function Filtros({ filtros, onFiltroChange, marcas }) {
  const marcaOptions = [
    { value: '', label: 'Todas' },
    ...marcas.map((m) => ({ value: m.id, label: m.nome })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-6 p-5 rounded-xl bg-noir-900/30 border border-noir-800/50">
      <div className="flex items-center gap-2 mr-4">
        <span className="text-gold/60 text-xs">✦</span>
        <span className="font-accent text-[10px] uppercase tracking-wider text-ivory/40">
          Filtrar por
        </span>
      </div>
      
      <Select
        label="Gênero"
        value={filtros.genero}
        onChange={(e) => onFiltroChange('genero', e.target.value)}
        options={generos}
      />
      
      <Select
        label="Marca"
        value={filtros.marca}
        onChange={(e) => onFiltroChange('marca', e.target.value)}
        options={marcaOptions}
      />
      
      <Select
        label="Tag"
        value={filtros.tag}
        onChange={(e) => onFiltroChange('tag', e.target.value)}
        options={tags}
      />

      {/* Clear filters */}
      {(filtros.genero || filtros.marca || filtros.tag) && (
        <button
          onClick={() => onFiltroChange('genero', '') || onFiltroChange('marca', '') || onFiltroChange('tag', '')}
          className="text-ivory/40 hover:text-gold text-sm transition-colors duration-300"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
