import { useState } from 'react'
import { useProdutos, useMarcas } from '../hooks/useProdutos'
import { Gem, SlidersHorizontal, X, Flame, Sparkles, Tag, Crown } from 'lucide-react'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'
import SecaoCarrosselProduto from '../components/product/SecaoCarrosselProduto'

export default function Loja() {
  const [filtros, setFiltros] = useState({ busca: '', genero: '', marca: '', tag: '' })
  const [showFilters, setShowFilters] = useState(false)
  const { produtos, loading } = useProdutos({ ativo: true })
  const { marcas } = useMarcas({ comProdutos: true })

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  // Filtragem dinâmica dos produtos
  const produtosFiltrados = produtos.filter(p => {
    // 1. Busca por nome
    const combinaBusca = !filtros.busca || p.nome.toLowerCase().includes(filtros.busca.toLowerCase())

    // 2. Gênero
    const combinaGenero = !filtros.genero || p.genero?.toLowerCase() === filtros.genero.toLowerCase()

    // 3. Marca
    const combinaMarca = !filtros.marca || String(p.marca_id) === String(filtros.marca)

    // 4. Tag
    const combinaTag = !filtros.tag || (p.tags || []).some(t => t.toLowerCase() === filtros.tag.toLowerCase()) ||
      (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes(filtros.tag.toLowerCase()))

    return combinaBusca && combinaGenero && combinaMarca && combinaTag
  })

  // Ordenação obrigatória A-Z pelo nome
  const produtosOrdenadosAZ = [...produtosFiltrados].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  )

  // As 4 listas específicas para os Carrosséis Temáticos Horizontais
  const ofertasRelampago = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'oferta relâmpago') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('relâmpago'))
  )

  const superPromocoes = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'super promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('super'))
  )

  const promocoes = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase() === 'promoção')
  )

  const lancamentos = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase().includes('lançamento'))
  )

  const activeFiltersCount = Object.values(filtros).filter(Boolean).length

  return (
    <div className="min-h-screen bg-noir-950 pt-20 sm:pt-24 pb-16">
      
      {/* ── 4 CARROSSÉIS TEMÁTICOS HORIZONTAIS POR TAG (Aparecem no topo da loja) ── */}
      {!filtros.busca && !filtros.genero && !filtros.marca && !filtros.tag && (
        <div className="space-y-4 mb-8">
          {/* 1. Ofertas Relâmpago (Carmesim & Fogo) */}
          <SecaoCarrosselProduto
            titulo="Ofertas Relâmpago"
            subtitulo="Descontos expressos com temporizador de contagem regressiva"
            badgeText="Oferta Relâmpago"
            Icone={Flame}
            variante="carmesim"
            produtos={ofertasRelampago}
            loading={loading}
          />

          {/* 2. Super Promoções (Ouro Âmbar) */}
          <SecaoCarrosselProduto
            titulo="Super Promoções"
            subtitulo="Os maiores descontos selecionados da perfumaria fina"
            badgeText="Super Promoção"
            Icone={Sparkles}
            variante="ouro"
            produtos={superPromocoes}
            loading={loading}
          />

          {/* 3. Promoções (Verde Esmeralda) */}
          <SecaoCarrosselProduto
            titulo="Promoções"
            subtitulo="Preços especiais e oportunidades exclusivas"
            badgeText="Promoção"
            Icone={Tag}
            variante="esmeralda"
            produtos={promocoes}
            loading={loading}
          />

          {/* 4. Lançamentos (Azul Safira Nuit) */}
          <SecaoCarrosselProduto
            titulo="Lançamentos"
            subtitulo="As novidades importadas mais recentes do Oriente"
            badgeText="Lançamentos"
            Icone={Sparkles}
            variante="safira"
            produtos={lancamentos}
            loading={loading}
          />
        </div>
      )}

      {/* ── SEÇÃO DE CATALOGO GERAL & FILTROS ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Toggle Filtros no Mobile */}
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
