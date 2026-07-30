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
    <div className="p-3 sm:p-5 rounded-xl bg-noir-900 sm:bg-noir-900" style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}>
      {/* Desktop layout */}
      <div className="hidden sm:flex flex-wrap items-center justify-center gap-5">
        <div className="flex items-center gap-2 mr-2">
          <span className="text-gold/50 text-xs">✦</span>
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
            onClick={() => {
              onFiltroChange('genero', '')
              onFiltroChange('marca', '')
              onFiltroChange('tag', '')
            }}
            className="text-ivory/30 hover:text-gold text-xs transition-colors duration-300 ml-2"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-3">
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
        </div>
        
        <Select
          label="Tag"
          value={filtros.tag}
          onChange={(e) => onFiltroChange('tag', e.target.value)}
          options={tags}
        />

        {/* Clear filters */}
        {(filtros.genero || filtros.marca || filtros.tag) && (
          <button
            onClick={() => {
              onFiltroChange('genero', '')
              onFiltroChange('marca', '')
              onFiltroChange('tag', '')
            }}
            className="w-full text-center text-ivory/30 hover:text-gold text-xs py-2 transition-colors duration-300"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
