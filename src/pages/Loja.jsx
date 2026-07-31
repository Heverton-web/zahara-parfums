import { useState, useEffect } from 'react'
import { useProdutos, useMarcas } from '../hooks/useProdutos'
import { Gem, SlidersHorizontal, X } from 'lucide-react'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'
import SuperPromocoes from '../components/product/SuperPromocoes'
import Promocoes from '../components/product/Promocoes'

export default function Loja() {
  const [filtros, setFiltros] = useState({ genero: '', marca: '', tag: '' })
  const [showFilters, setShowFilters] = useState(false)
  const { produtos, loading } = useProdutos({ ...filtros, ativo: true })
  const { marcas } = useMarcas({ comProdutos: true })

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  const activeFiltersCount = Object.values(filtros).filter(v => v).length

  return (
    <div className="min-h-screen bg-noir-950 pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* Hero section */}
      <div className="relative py-10 sm:py-16 mb-6 sm:mb-12">
        <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 to-noir-950" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <p className="font-accent text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/60 mb-3 sm:mb-4">
            Coleção Exclusiva
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-ivory">Nossos </span>
            <span className="text-gradient-gold">Perfumes</span>
          </h1>
          <div className="ornate-divider">
            <span>✦</span>
          </div>
        </div>
      </div>

      {/* Super Promoções */}
      <SuperPromocoes />

      {/* Promoções */}
      <Promocoes />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile filter toggle */}
        <div className="sm:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-noir-900 text-ivory/70"
            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gold/60" />
              <span className="text-sm font-medium">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-gold text-noir-950 text-xs font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {showFilters ? <X size={18} /> : <span className="text-lg">+</span>}
          </button>
        </div>

        {/* Desktop filters */}
        <div className={`${showFilters ? 'block' : 'hidden'} sm:block mb-6 sm:mb-12`}>
          <Filtros
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            marcas={marcas}
          />
        </div>

        {/* Products count */}
        {!loading && (
          <p className="text-ivory/30 text-xs sm:text-sm mb-4 sm:mb-6">
            {produtos.filter(p => !p.em_promocao_em_massa && !p.tags?.includes('promoção') && !p.tags?.includes('oferta relâmpago')).length} {produtos.filter(p => !p.em_promocao_em_massa && !p.tags?.includes('promoção') && !p.tags?.includes('oferta relâmpago')).length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        )}

        {/* Products - exclui promo e super promo */}
        {loading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-sm sm:text-base">Carregando coleção...</p>
          </div>
        ) : produtos.length > 0 ? (
          <ListaProdutos produtos={produtos.filter(p => !p.em_promocao_em_massa && !p.tags?.includes('promoção') && !p.tags?.includes('oferta relâmpago'))} />
        ) : (
          <div className="text-center py-16 sm:py-20">
            <Gem className="text-gold/20 mx-auto mb-4" size={48} />
            <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-lg sm:text-xl mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-ivory/25 sm:text-ivory/30 text-xs sm:text-sm">
              Tente ajustar os filtros para ver mais resultados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
