import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProdutos, useMarcas } from '../hooks/useProdutos'
import { Search, X, SlidersHorizontal, Gem, ArrowLeft, Store } from 'lucide-react'
import Select from '../components/ui/Select'
import ListaProdutos from '../components/product/ListaProdutos'

const generos = [
  { value: '', label: 'Todos os Gêneros' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'unissex', label: 'Unissex' },
]

const estilosVariante = {
  carmesim: {
    bgGlow: 'bg-red-500/10',
    borderCard: 'rgba(239, 68, 68, 0.3)',
    textAccent: 'text-red-400',
    bgBadge: 'rgba(239, 68, 68, 0.1)',
    borderBadge: 'rgba(239, 68, 68, 0.3)',
  },
  ouro: {
    bgGlow: 'bg-gold/10',
    borderCard: 'rgba(201, 168, 76, 0.3)',
    textAccent: 'text-gold',
    bgBadge: 'rgba(201, 168, 76, 0.1)',
    borderBadge: 'rgba(201, 168, 76, 0.3)',
  },
  esmeralda: {
    bgGlow: 'bg-emerald-500/10',
    borderCard: 'rgba(16, 185, 129, 0.3)',
    textAccent: 'text-emerald-400',
    bgBadge: 'rgba(16, 185, 129, 0.1)',
    borderBadge: 'rgba(16, 185, 129, 0.3)',
  },
  safira: {
    bgGlow: 'bg-indigo-500/10',
    borderCard: 'rgba(129, 140, 248, 0.3)',
    textAccent: 'text-indigo-300',
    bgBadge: 'rgba(129, 140, 248, 0.1)',
    borderBadge: 'rgba(129, 140, 248, 0.3)',
  },
}

export default function PaginaTagPublica({ tagNome, titulo, subtitulo, Icone, variante = 'ouro' }) {
  const [filtros, setFiltros] = useState({ busca: '', genero: '', marca: '' })
  const [showFilters, setShowFilters] = useState(false)

  const { produtos, loading } = useProdutos({ ativo: true })
  const { marcas } = useMarcas({ comProdutos: true })

  const estilo = estilosVariante[variante] || estilosVariante.ouro

  const marcaOptions = [
    { value: '', label: 'Todas as Marcas' },
    ...marcas.map((m) => ({ value: m.id, label: m.nome })),
  ]

  // Filtrar estritamente apenas produtos com a tagNome desta rota exclusiva
  const produtosDaTag = produtos.filter(p => {
    const temTag = (p.tags || []).some(t => t.toLowerCase().includes(tagNome.toLowerCase())) ||
      (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes(tagNome.toLowerCase()))
    return temTag
  })

  // Aplicação dos filtros secundários (Busca por nome, Gênero, Marca)
  const produtosFiltrados = produtosDaTag.filter(p => {
    const combinaBusca = !filtros.busca || p.nome.toLowerCase().includes(filtros.busca.toLowerCase())
    const combinaGenero = !filtros.genero || p.genero?.toLowerCase() === filtros.genero.toLowerCase()
    const combinaMarca = !filtros.marca || String(p.marca_id) === String(filtros.marca)

    return combinaBusca && combinaGenero && combinaMarca
  })

  // Ordenação de A a Z pelo nome do produto
  const produtosOrdenadosAZ = [...produtosFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  )

  const activeFiltersCount = Object.values(filtros).filter(Boolean).length

  return (
    <div className="min-h-screen bg-noir-950 pt-20 sm:pt-24 pb-16 relative overflow-hidden">
      {/* Glow de Fundo Temático Orgânico e Fluido */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none overflow-hidden">
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] ${estilo.bgGlow} rounded-full blur-[160px] opacity-60`} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Barra de Atalhos de Voltar no Topo */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-ivory/60 hover:text-gold transition-colors py-1.5 px-3 rounded-xl bg-noir-900/60 border border-gold/15 hover:border-gold/40"
          >
            <ArrowLeft size={14} className="text-gold" />
            <span>Voltar para a Home</span>
          </Link>

          <Link
            to="/loja"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold/80 hover:text-gold transition-colors py-1.5 px-3 rounded-xl bg-gold/5 border border-gold/20 hover:border-gold/40"
          >
            <Store size={14} />
            <span>Ver Catálogo Geral</span>
          </Link>
        </div>

        {/* Header da Categoria Temática */}
        <div className="text-center my-8 sm:my-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 shadow-lg backdrop-blur-md"
            style={{
              background: estilo.bgBadge,
              border: `1px solid ${estilo.borderBadge}`,
            }}
          >
            {Icone && <Icone size={16} className={estilo.textAccent} />}
            <span className={`text-xs sm:text-sm font-bold uppercase tracking-wider ${estilo.textAccent}`}>
              {tagNome}
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-ivory mb-3">
            {titulo}
          </h1>

          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mb-3" />

          {subtitulo && (
            <p className="font-display text-ivory/50 italic text-sm sm:text-base max-w-xl mx-auto">
              {subtitulo}
            </p>
          )}
        </div>

        {/* Painel de Filtros (Busca por nome, Gênero, Marca) */}
        <div className="mb-8">
          <div className="sm:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-noir-900 text-ivory/70 border border-gold/20"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className={estilo.textAccent} />
                <span className="text-sm font-medium">Filtrar Produtos da Seção</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-gold text-noir-950 text-xs font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {showFilters ? <X size={18} /> : <span className="text-lg">+</span>}
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} sm:block p-4 sm:p-5 rounded-2xl bg-noir-900 border border-gold/15 shadow-xl space-y-4`}>
            {/* Input de Busca por Nome */}
            <div className="relative">
              <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${estilo.textAccent}`} />
              <input
                type="text"
                placeholder={`Buscar produto em ${tagNome} pelo nome...`}
                value={filtros.busca}
                onChange={e => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                className="w-full pl-10 pr-10 py-3 rounded-xl text-xs sm:text-sm text-ivory bg-noir-800/80 border border-gold/20 focus:border-gold focus:outline-none placeholder:text-ivory/30 shadow-inner"
              />
              {filtros.busca && (
                <button
                  type="button"
                  onClick={() => setFiltros(prev => ({ ...prev, busca: '' }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Selects: Gênero e Marca */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Select
                label="Gênero"
                value={filtros.genero}
                onChange={e => setFiltros(prev => ({ ...prev, genero: e.target.value }))}
                options={generos}
              />

              <Select
                label="Marca"
                value={filtros.marca}
                onChange={e => setFiltros(prev => ({ ...prev, marca: e.target.value }))}
                options={marcaOptions}
              />
            </div>

            {/* Limpar Filtros */}
            {activeFiltersCount > 0 && (
              <div className="flex justify-end pt-2 border-t border-ivory/5">
                <button
                  type="button"
                  onClick={() => setFiltros({ busca: '', genero: '', marca: '' })}
                  className="text-gold/70 hover:text-gold text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <X size={14} />
                  <span>Limpar filtros</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Título e Contagem de Produtos */}
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-gold/15">
          <p className="text-ivory/50 text-xs font-accent uppercase tracking-wider">
            Exibindo de A a Z pelo nome
          </p>

          {!loading && (
            <p className={`text-xs font-bold ${estilo.textAccent}`}>
              {produtosOrdenadosAZ.length} {produtosOrdenadosAZ.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
        </div>

        {/* Grade de Produtos */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/40 italic text-sm">Carregando {tagNome}...</p>
          </div>
        ) : produtosOrdenadosAZ.length > 0 ? (
          <ListaProdutos produtos={produtosOrdenadosAZ} />
        ) : (
          <div className="text-center py-16 bg-noir-900/40 rounded-2xl border border-gold/10">
            <Gem className="text-gold/20 mx-auto mb-4" size={48} />
            <p className="font-display text-ivory/60 italic text-lg mb-2">
              Nenhum produto encontrado em {tagNome}
            </p>
            <p className="text-ivory/30 text-xs">
              Tente ajustar os filtros ou pesquisar por outro nome.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
