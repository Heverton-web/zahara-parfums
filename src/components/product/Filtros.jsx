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
    <div className="flex flex-wrap gap-4 mb-6">
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
    </div>
  )
}
