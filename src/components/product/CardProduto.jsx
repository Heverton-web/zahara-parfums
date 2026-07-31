import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Gem } from 'lucide-react'
import Badge from '../ui/Badge'
import CountdownTimer from '../ui/CountdownTimer'
import WhatsAppModal from './WhatsAppModal'
import { buildWhatsAppLink } from '../../lib/whatsapp'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'wine',
  'oferta relâmpago': 'danger',
  'SUPER PROMOÇÃO': 'danger',
}

export default function CardProduto({ produto }) {
  const [showModal, setShowModal] = useState(false)
  const [imageError, setImageError] = useState(false)

  function handleWhatsAppClick(e) {
    e.preventDefault()
    e.stopPropagation()
    setShowModal(true)
  }

  function handleConfirmWhatsApp(nomeUsuario) {
    const link = buildWhatsAppLink(produto, nomeUsuario)
    window.open(link, '_blank')
  }

  return (
    <>
      <div 
        className="group relative bg-noir-900 rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-gold/5"
        style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'}
      >
        {/* Image container */}
        <Link to={`/produto/${produto.id}`} className="block">
          <div className="bg-noir-800 relative overflow-hidden" style={{ minHeight: '280px' }}>
            {produto.imagem_url && !imageError ? (
              <img
                src={produto.imagem_url}
                alt={produto.nome}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-noir-800 to-noir-900">
                <Gem className="text-gold/30 mb-3" size={40} />
                <span className="text-ivory/30 text-xs font-medium">{produto.nome}</span>
              </div>
            )}
            
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            
            {/* Tags */}
            {(() => {
              const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
              const tagsVisiveis = emMassa
                ? ['SUPER PROMOÇÃO']
                : (produto.tags || []).filter(t => t !== 'SUPER PROMOÇÃO')
              return tagsVisiveis.length > 0 ? (
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  {tagsVisiveis.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant={tagColors[tag] || 'default'} className="px-2.5 py-1 backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null
            })()}
            
            {/* Preço sobreposto na imagem */}
            <div className="absolute bottom-3 left-3">
              {(() => {
                const preco = Number(produto.preco_original) || 0
                const precoPromo = Number(produto.preco_promocional) || preco
                const precoEmMassa = Number(produto.preco_em_massa)
                const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
                const temPromo = !emMassa && (produto.tags?.includes('promoção') || produto.tags?.includes('oferta relâmpago')) && precoPromo

                if (emMassa && precoEmMassa) {
                  return (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white/50 line-through text-sm drop-shadow-lg">
                          R$ {preco.toFixed(2)}
                        </span>
                        <span className="text-emerald-400 font-bold text-lg drop-shadow-lg">
                          R$ {precoEmMassa.toFixed(2)}
                        </span>
                      </div>
                      <CountdownTimer dataFim={produto.promocoes_em_massa.data_fim} size="sm" />
                    </div>
                  )
                }
                if (temPromo) {
                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 line-through text-sm drop-shadow-lg">
                        R$ {preco.toFixed(2)}
                      </span>
                      <span className="text-emerald-400 font-bold text-lg drop-shadow-lg">
                        R$ {precoPromo.toFixed(2)}
                      </span>
                    </div>
                  )
                }
                return (
                  <span className="text-white font-bold text-lg drop-shadow-lg">
                    R$ {preco.toFixed(2)}
                  </span>
                )
              })()}
            </div>
          </div>
        </Link>

        {/* Conteúdo */}
        <div className="p-4">
          {/* Marca */}
          <p className="text-gold/60 text-[10px] uppercase tracking-widest font-medium mb-1.5">
            {produto.marcas?.nome}
          </p>
          
          {/* Nome */}
          <Link to={`/produto/${produto.id}`}>
            <h3 className="text-ivory font-semibold text-sm mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2 leading-snug min-h-[40px]">
              {produto.nome}
            </h3>
          </Link>

          {/* Botão WhatsApp */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden sm:inline">Comprar no WhatsApp</span>
            <span className="sm:hidden">Comprar</span>
          </button>
        </div>
      </div>

      <WhatsAppModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        produto={produto}
        onConfirm={handleConfirmWhatsApp}
      />
    </>
  )
}
