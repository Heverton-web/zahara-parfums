import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProdutos, useMarcas } from '../hooks/useProdutos'
import { Gem, SlidersHorizontal, X, Flame, Sparkles, Tag, Crown, ArrowRight } from 'lucide-react'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'

export default function Loja() {
  const [filtros, setFiltros] = useState({ busca: '', genero: '', marca: '', tag: '' })
  const [showFilters, setShowFilters] = useState(false)
  const { produtos, loading } = useProdutos({ ativo: true })
  const { marcas } = useMarcas({ comProdutos: true })

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  // Filtragem dinâmica dos produtos no catálogo geral
  const produtosFiltrados = produtos.filter(p => {
    const combinaBusca = !filtros.busca || p.nome.toLowerCase().includes(filtros.busca.toLowerCase())
    const combinaGenero = !filtros.genero || p.genero?.toLowerCase() === filtros.genero.toLowerCase()
    const combinaMarca = !filtros.marca || String(p.marca_id) === String(filtros.marca)
    const combinaTag = !filtros.tag || (p.tags || []).some(t => t.toLowerCase() === filtros.tag.toLowerCase()) ||
      (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes(filtros.tag.toLowerCase()))

    return combinaBusca && combinaGenero && combinaMarca && combinaTag
  })

  // Ordenação de A a Z pelo nome
  const produtosOrdenadosAZ = [...produtosFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  )

  // Contadores dinâmicos para os botões de atalho das 4 seções
  const countRelampago = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'oferta relâmpago') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('relâmpago'))
  ).length

  const countSuperPromo = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'super promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('super'))
  ).length

  const countPromocoes = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase() === 'promoção')
  ).length

  const countLancamentos = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase().includes('lançamento'))
  ).length

  const activeFiltersCount = Object.values(filtros).filter(Boolean).length

  const atalhosCategorias = [
    {
      to: '/ofertas-relampago',
      label: 'Ofertas Relâmpago',
      count: countRelampago,
      Icone: Flame,
      colorText: 'text-red-400',
      borderHover: 'hover:border-red-500/40',
      bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    {
      to: '/super-promocoes',
      label: 'Super Promoções',
      count: countSuperPromo,
      Icone: Sparkles,
      colorText: 'text-gold',
      borderHover: 'hover:border-gold/40',
      bgBadge: 'bg-gold/10 text-gold border-gold/30',
    },
    {
      to: '/promocoes',
      label: 'Promoções',
      count: countPromocoes,
      Icone: Tag,
      colorText: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/40',
      bgBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      to: '/lancamentos',
      label: 'Lançamentos',
      count: countLancamentos,
      Icone: Sparkles,
      colorText: 'text-indigo-300',
      borderHover: 'hover:border-indigo-400/40',
      bgBadge: 'bg-indigo-500/10 text-indigo-300 border-indigo-400/30',
    },
  ]

  return (
    <div className="min-h-screen bg-noir-950 pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header Principal da Loja */}
        <div className="text-center my-6 sm:my-10">
          <p className="font-accent text-gold/60 text-[11px] uppercase tracking-[0.4em] mb-2">
            Zahara Parfums
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-ivory mb-3">
            Catálogo de <span className="text-gradient-gold">Alta Perfumaria</span>
          </h1>
          <p className="font-display text-ivory/40 italic text-sm sm:text-base max-w-xl mx-auto">
            Explore nossas coleções exclusivas e encontre a essência perfeita.
          </p>
        </div>

        {/* ── BOTÕES / CARDS DE ATALHO PARA ROTAS EXCLUSIVAS COM CONTADORES ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {atalhosCategorias.map(cat => (
            <Link
              key={cat.to}
              to={cat.to}
              className={`p-4 rounded-2xl bg-noir-900 border border-gold/15 transition-all duration-300 hover:scale-[1.02] ${cat.borderHover} group shadow-lg flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl bg-noir-800 border border-ivory/5 group-hover:bg-noir-950 ${cat.colorText}`}>
                  <cat.Icone size={18} />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${cat.bgBadge}`}>
                  {cat.count} {cat.count === 1 ? 'item' : 'itens'}
                </span>
              </div>

              <div>
                <h3 className={`font-semibold text-sm leading-snug group-hover:underline ${cat.colorText} flex items-center justify-between`}>
                  <span>{cat.label}</span>
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Toggle Filtros Mobile */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-noir-900 text-ivory/70 border border-gold/20"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gold" />
              <span className="text-sm font-medium">Buscar e Filtrar Produtos</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-noir-950 text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {showFilters ? <X size={18} /> : <span className="text-lg">+</span>}
          </button>
        </div>

        {/* Painel de Filtros (Busca por Nome, Gênero, Marca, Tag) */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block mb-8 sm:mb-12`}>
          <Filtros
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            marcas={marcas}
          />
        </div>

        {/* Título do Catálogo e Ordenação A-Z */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-gold/15">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-ivory flex items-center gap-2">
              <Crown className="text-gold" size={20} />
              <span>Todos os Produtos</span>
            </h2>
            <p className="text-ivory/40 text-xs mt-0.5">
              Ordenados de A a Z pelo nome
            </p>
          </div>

          {!loading && (
            <p className="text-gold/70 text-xs font-accent uppercase tracking-wider">
              {produtosOrdenadosAZ.length} {produtosOrdenadosAZ.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          )}
        </div>

        {/* Grade Geral de Todos os Produtos (Ordenados de A-Z pelo nome) */}
        {loading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/40 italic text-sm sm:text-base">Carregando catálogo completo...</p>
          </div>
        ) : produtosOrdenadosAZ.length > 0 ? (
          <ListaProdutos produtos={produtosOrdenadosAZ} />
        ) : (
          <div className="text-center py-16 sm:py-20 bg-noir-900/40 rounded-2xl border border-gold/10">
            <Gem className="text-gold/20 mx-auto mb-4" size={48} />
            <p className="font-display text-ivory/60 italic text-lg sm:text-xl mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-ivory/30 text-xs sm:text-sm">
              Tente ajustar o termo de busca ou os filtros selecionados acima.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
