import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Gem, Shield, Truck, Gift } from 'lucide-react'
import { fetchProdutoById } from '../hooks/useProdutos'
import { produtosMock } from '../data/mock'
import { buildWhatsAppLink } from '../lib/whatsapp'
import WhatsAppModal from '../components/product/WhatsAppModal'
import Badge from '../components/ui/Badge'
import CountdownTimer from '../components/ui/CountdownTimer'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'wine',
  'oferta relâmpago': 'danger',
  'SUPER PROMOÇÃO': 'danger',
}

export default function Produto() {
  const { id } = useParams()
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    loadProduto()
  }, [id])

  async function loadProduto() {
    try {
      const data = await fetchProdutoById(id)
      if (data) {
        setProduto(data)
      } else {
        // Fallback para mock
        const mock = produtosMock.find(p => p.id === id)
        setProduto(mock || null)
      }
    } catch {
      // Fallback para mock em caso de erro
      const mock = produtosMock.find(p => p.id === id)
      setProduto(mock || null)
    }
    setLoading(false)
  }

  function handleConfirmWhatsApp(nomeUsuario) {
    const link = buildWhatsAppLink(produto, nomeUsuario)
    window.open(link, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-950">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-sm sm:text-base">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!produto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-noir-950 px-4">
        <div className="text-center">
          <Gem className="text-gold/20 mx-auto mb-4" size={48} />
          <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-lg sm:text-xl mb-4">Produto não encontrado</p>
          <Link to="/loja" className="inline-block text-gold hover:text-gold-light transition-colors text-sm sm:text-base">
            ← Voltar à loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-noir-950 pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-ivory/40 sm:text-ivory/50 hover:text-gold transition-colors duration-300 mb-6 sm:mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          <span className="font-display">Voltar à coleção</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
          {/* Image section */}
          <div className="relative">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden luxury-card" style={{ minHeight: '300px', background: '#1a1a1a' }}>
              {produto.imagem_url ? (
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-noir-900">
                  <Gem className="text-gold/20" size={64} />
                </div>
              )}
            </div>
            
            {/* Decorative corners - hidden on mobile */}
            <div className="hidden sm:block absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-gold/20 rounded-tl-lg" />
            <div className="hidden sm:block absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-gold/20 rounded-br-lg" />
          </div>

          {/* Details section */}
          <div className="flex flex-col">
            {/* Tags */}
            {(() => {
              const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
              const tagsVisiveis = emMassa
                ? ['SUPER PROMOÇÃO']
                : (produto.tags || []).filter(t => t !== 'SUPER PROMOÇÃO')
              return tagsVisiveis.length > 0 ? (
                <div className="flex gap-2 mb-3 sm:mb-4">
                  {tagsVisiveis.map((tag) => (
                    <Badge key={tag} variant={tagColors[tag] || 'default'}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null
            })()}

            {/* Brand */}
            <p className="font-accent text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold/50 sm:text-gold/60 mb-1 sm:mb-2">
              {produto.marcas?.nome}
            </p>

            {/* Name */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory mb-3 sm:mb-4 leading-tight">
              {produto.nome}
            </h1>

            {/* Price */}
            <div className="mb-6 sm:mb-8">
              {(() => {
                const preco = Number(produto.preco_original) || 0
                const precoPromo = Number(produto.preco_promocional) || preco
                const precoEmMassa = Number(produto.preco_em_massa)
                const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
                const temPromo = !emMassa && (produto.tags?.includes('promoção') || produto.tags?.includes('oferta relâmpago')) && precoPromo

                if (emMassa && precoEmMassa) {
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-ivory/40 line-through text-xl sm:text-2xl">
                          R$ {preco.toFixed(2)}
                        </span>
                        <span className="price-tag text-3xl sm:text-4xl md:text-5xl text-emerald-400">
                          R$ {precoEmMassa.toFixed(2)}
                        </span>
                      </div>
                      <CountdownTimer dataFim={produto.promocoes_em_massa.data_fim} size="md" />
                    </div>
                  )
                }
                if (temPromo) {
                  return (
                    <div className="flex items-center gap-3">
                      <span className="text-ivory/40 line-through text-xl sm:text-2xl">
                        R$ {preco.toFixed(2)}
                      </span>
                      <span className="price-tag text-3xl sm:text-4xl md:text-5xl text-emerald-400">
                        R$ {precoPromo.toFixed(2)}
                      </span>
                    </div>
                  )
                }
                return (
                  <p className="price-tag text-3xl sm:text-4xl md:text-5xl">
                    R$ {preco.toFixed(2)}
                  </p>
                )
              })()}
            </div>

            {/* Description */}
            {produto.descricao && (
              <div className="mb-6 sm:mb-8">
                <p className="font-display text-sm sm:text-base text-ivory/60 sm:text-ivory/70 italic leading-relaxed">
                  {produto.descricao}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="ornate-divider my-6 sm:my-8">
              <span>✦</span>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full btn-whatsapp text-base sm:text-lg py-3.5 sm:py-4"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Comprar no WhatsApp
            </button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 sm:mt-8">
              <div 
                className="text-center p-2.5 sm:p-4 rounded-lg bg-noir-900"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
              >
                <Shield className="text-gold/50 sm:text-gold/60 mx-auto mb-1.5 sm:mb-2" size={20} />
                <p className="text-ivory/40 text-[10px] sm:text-xs font-medium leading-tight">Produto Original</p>
              </div>
              <div 
                className="text-center p-2.5 sm:p-4 rounded-lg bg-noir-900"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
              >
                <Truck className="text-gold/50 sm:text-gold/60 mx-auto mb-1.5 sm:mb-2" size={20} />
                <p className="text-ivory/40 text-[10px] sm:text-xs font-medium leading-tight">Envio Todo Brasil</p>
              </div>
              <div 
                className="text-center p-2.5 sm:p-4 rounded-lg bg-noir-900"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
              >
                <Gift className="text-gold/50 sm:text-gold/60 mx-auto mb-1.5 sm:mb-2" size={20} />
                <p className="text-ivory/40 text-[10px] sm:text-xs font-medium leading-tight">Embalagem Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        produto={produto}
        onConfirm={handleConfirmWhatsApp}
      />
    </div>
  )
}
