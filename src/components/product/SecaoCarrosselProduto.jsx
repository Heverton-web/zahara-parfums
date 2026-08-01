import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import CardProduto from './CardProduto'

const estilosVariante = {
  carmesim: {
    bgSection: 'bg-noir-950',
    glowOverlay: 'bg-red-500/5',
    borderBadge: 'rgba(239, 68, 68, 0.25)',
    bgBadge: 'rgba(239, 68, 68, 0.08)',
    textBadge: 'text-red-400',
    accentText: 'text-red-400',
    divider: 'from-transparent via-red-400/40 to-transparent',
  },
  ouro: {
    bgSection: 'bg-noir-900/60',
    glowOverlay: 'bg-gold/5',
    borderBadge: 'rgba(201, 168, 76, 0.3)',
    bgBadge: 'rgba(201, 168, 76, 0.1)',
    textBadge: 'text-gold',
    accentText: 'text-gold',
    divider: 'from-transparent via-gold/40 to-transparent',
  },
  esmeralda: {
    bgSection: 'bg-noir-950',
    glowOverlay: 'bg-emerald-500/5',
    borderBadge: 'rgba(16, 185, 129, 0.3)',
    bgBadge: 'rgba(16, 185, 129, 0.08)',
    textBadge: 'text-emerald-400',
    accentText: 'text-emerald-400',
    divider: 'from-transparent via-emerald-400/40 to-transparent',
  },
  safira: {
    bgSection: 'bg-noir-900/60',
    glowOverlay: 'bg-indigo-500/5',
    borderBadge: 'rgba(129, 140, 248, 0.3)',
    bgBadge: 'rgba(129, 140, 248, 0.08)',
    textBadge: 'text-indigo-300',
    accentText: 'text-indigo-300',
    divider: 'from-transparent via-indigo-400/40 to-transparent',
  },
  noir: {
    bgSection: 'bg-noir-950',
    glowOverlay: 'bg-gold/5',
    borderBadge: 'rgba(253, 249, 240, 0.15)',
    bgBadge: 'rgba(253, 249, 240, 0.05)',
    textBadge: 'text-ivory/80',
    accentText: 'text-gold-light',
    divider: 'from-transparent via-gold/30 to-transparent',
  },
}

export default function SecaoCarrosselProduto({
  titulo,
  subtitulo,
  badgeText,
  Icone,
  variante = 'ouro',
  produtos = [],
  loading = false,
}) {
  const scrollRef = useRef(null)
  const estilo = estilosVariante[variante] || estilosVariante.ouro

  function scroll(direcao) {
    if (scrollRef.current) {
      const amount = direcao === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  if (!loading && produtos.length === 0) return null

  return (
    <section className={`py-12 sm:py-16 ${estilo.bgSection} relative overflow-hidden border-b border-ivory/5`}>
      {/* Glow decorativo sutil */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] ${estilo.glowOverlay} rounded-full blur-[120px] pointer-events-none`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header da Seção */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            {badgeText && (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-3"
                style={{
                  background: estilo.bgBadge,
                  border: `1px solid ${estilo.borderBadge}`,
                }}
              >
                {Icone && <Icone size={14} className={estilo.textBadge} />}
                <span className={`text-[11px] font-bold uppercase tracking-wider ${estilo.textBadge}`}>
                  {badgeText}
                </span>
              </div>
            )}

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-ivory">
              {titulo}
            </h2>
            <div className={`w-16 h-px bg-gradient-to-r ${estilo.divider} mt-2 mb-1`} />
            {subtitulo && (
              <p className="font-display text-ivory/40 italic text-xs sm:text-sm">
                {subtitulo}
              </p>
            )}
          </div>

          {/* Botões de Navegação Lateral Desktop */}
          {produtos.length > 2 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl bg-noir-800/80 text-ivory/60 hover:text-gold hover:bg-noir-800 border border-ivory/10 transition-all active:scale-95"
                aria-label="Rolar para esquerda"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl bg-noir-800/80 text-ivory/60 hover:text-gold hover:bg-noir-800 border border-ivory/10 transition-all active:scale-95"
                aria-label="Rolar para direita"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Carrossel Horizontal */}
        {loading ? (
          <div className="py-12 text-center">
            <Loader2 size={24} className={`animate-spin ${estilo.textBadge} mx-auto mb-2`} />
            <p className="text-ivory/40 text-xs italic">Carregando coleção...</p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 scrollbar-luxury snap-x snap-mandatory"
          >
            {produtos.map(produto => (
              <div
                key={produto.id}
                className="w-[220px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-start"
              >
                <CardProduto produto={produto} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
