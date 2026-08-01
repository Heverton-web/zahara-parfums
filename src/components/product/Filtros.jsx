import { Search, X } from 'lucide-react'
import Select from '../ui/Select'

const generos = [
  { value: '', label: 'Todos' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'unissex', label: 'Unissex' },
]

const tagsOficiais = [
  { value: '', label: 'Todas' },
  { value: 'Oferta Relâmpago', label: 'Oferta Relâmpago' },
  { value: 'Super Promoção', label: 'Super Promoção' },
  { value: 'Promoção', label: 'Promoção' },
  { value: 'Lançamentos', label: 'Lançamentos' },
]

export default function Filtros({ filtros, onFiltroChange, marcas = [] }) {
  const marcaOptions = [
    { value: '', label: 'Todas' },
    ...marcas.map((m) => ({ value: m.id, label: m.nome })),
  ]

  const temFiltroAtivo = filtros.busca || filtros.genero || filtros.marca || filtros.tag

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-noir-900 border border-gold/15 shadow-xl space-y-4">
      {/* Search Input por nome do produto */}
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" />
        <input
          type="text"
          placeholder="Buscar produto pelo nome..."
          value={filtros.busca || ''}
          onChange={(e) => onFiltroChange('busca', e.target.value)}
          className="w-full pl-10 pr-10 py-3 rounded-xl text-xs sm:text-sm text-ivory bg-noir-800/80 border border-gold/20 focus:border-gold focus:outline-none placeholder:text-ivory/30 shadow-inner"
        />
        {filtros.busca && (
          <button
            type="button"
            onClick={() => onFiltroChange('busca', '')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Selects: Gênero, Marca, Tag */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <Select
          label="Gênero"
          value={filtros.genero || ''}
          onChange={(e) => onFiltroChange('genero', e.target.value)}
          options={generos}
        />

        <Select
          label="Marca"
          value={filtros.marca || ''}
          onChange={(e) => onFiltroChange('marca', e.target.value)}
          options={marcaOptions}
        />

        <Select
          label="Tag Oficial"
          value={filtros.tag || ''}
          onChange={(e) => onFiltroChange('tag', e.target.value)}
          options={tagsOficiais}
        />
      </div>

      {/* Botão para limpar filtros */}
      {temFiltroAtivo && (
        <div className="flex justify-end pt-2 border-t border-ivory/5">
          <button
            type="button"
            onClick={() => {
              onFiltroChange('busca', '')
              onFiltroChange('genero', '')
              onFiltroChange('marca', '')
              onFiltroChange('tag', '')
            }}
            className="text-gold/70 hover:text-gold text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <X size={14} />
            <span>Limpar todos os filtros</span>
          </button>
        </div>
      )}
    </div>
  )
}
