import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'
import { Sparkles, Crown, Gem, Flame, Tag } from 'lucide-react'
import SecaoCarrosselProduto from '../components/product/SecaoCarrosselProduto'

export default function Home() {
  const { produtos, loading } = useProdutos({ ativo: true })

  // 1. Ofertas Relâmpago
  const ofertasRelampago = produtos.filter(p =>
    (p.tags || []).some(t => t.toLowerCase() === 'oferta relâmpago') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('relâmpago'))
  )

  // 2. Super Promoções
  const superPromocoes = produtos.filter(p =>
    !ofertasRelampago.some(rel => rel.id === p.id) &&
    ((p.tags || []).some(t => t.toLowerCase() === 'super promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase().includes('super')))
  )

  // 3. Promoções Padrão
  const promocoes = produtos.filter(p =>
    !ofertasRelampago.some(rel => rel.id === p.id) &&
    !superPromocoes.some(sup => sup.id === p.id) &&
    ((p.tags || []).some(t => t.toLowerCase() === 'promoção') ||
    (p.em_promocao_em_massa && p.promocoes_em_massa?.tag?.toLowerCase() === 'promoção'))
  )

  // 4. Lançamentos
  const lancamentos = produtos.filter(p =>
    !ofertasRelampago.some(rel => rel.id === p.id) &&
    !superPromocoes.some(sup => sup.id === p.id) &&
    !promocoes.some(pro => pro.id === p.id) &&
    (p.tags || []).some(t => t.toLowerCase() === 'lançamento')
  )

  // 5. Convencionais (Exibidos sob o título elegante "Fragrâncias Exclusivas")
  const convencionais = produtos.filter(p =>
    !ofertasRelampago.some(rel => rel.id === p.id) &&
    !superPromocoes.some(sup => sup.id === p.id) &&
    !promocoes.some(pro => pro.id === p.id) &&
    !lancamentos.some(lan => lan.id === p.id)
  )

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16">
        <div className="absolute inset-0 bg-noir-950" />
        <div className="absolute inset-0 bg-pattern-arabic opacity-10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-4 sm:py-8">
          <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/70 text-lg">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          <p className="font-accent text-gold/60 text-[11px] uppercase tracking-[0.4em] mb-4 sm:mb-6">
            Zahara Parfums
          </p>

          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold mb-6 leading-[0.95]">
            <span className="text-ivory block mb-2">A Essência</span>
            <span className="text-gradient-gold block">Do Oriente</span>
          </h1>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mb-6 sm:mb-8" />

          <p className="font-display text-ivory/50 text-base sm:text-xl max-w-xl mx-auto mb-8 sm:mb-10 italic leading-relaxed">
            Fragrâncias árabes de luxo importadas direto do Oriente Médio.
            Cada gota carrega séculos de tradição em perfumaria.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/loja" 
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-noir-950 font-bold rounded-xl hover:shadow-xl hover:shadow-gold/30 transition-all duration-500 text-sm uppercase tracking-wider"
            >
              Explorar Coleção
            </Link>
            <Link
              to="/marcas"
              className="w-full sm:w-auto px-10 py-4 border border-gold/40 text-gold rounded-xl hover:bg-gold/10 transition-all duration-500 text-sm uppercase tracking-wider"
            >
              Nossas Marcas
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8 sm:mt-12">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <span className="text-gold/30 text-xs">◆</span>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="w-6 h-10 rounded-full border border-ivory/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-gold/50 rounded-full animate-scroll-wheel" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-noir-950 relative border-b border-ivory/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all duration-500">
                <Sparkles className="text-gold/70" size={24} />
              </div>
              <h3 className="text-ivory font-semibold mb-2">
                Qualidade Premium
              </h3>
              <p className="text-ivory/40 text-sm leading-relaxed">
                Selecionamos apenas as melhores fragrâncias do Oriente Médio e Europa
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all duration-500">
                <Crown className="text-gold/70" size={24} />
              </div>
              <h3 className="text-ivory font-semibold mb-2">
                Exclusividade
              </h3>
              <p className="text-ivory/40 text-sm leading-relaxed">
                Edições limitadas e fórmulas únicas que não encontrará em outro lugar
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all duration-500">
                <Gem className="text-gold/70" size={24} />
              </div>
              <h3 className="text-ivory font-semibold mb-2">
                Entrega Premium
              </h3>
              <p className="text-ivory/40 text-sm leading-relaxed">
                Entrega gratuita em Americana, Santa Bárbara D'Oeste e Nova Odessa acima de R$ 400,00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 SEÇÕES HORIZONTAIS DE PRODUTOS ── */}

      {/* 1. Ofertas Relâmpago (Carmesim & Fogo) */}
      <SecaoCarrosselProduto
        titulo="Ofertas Relâmpago"
        subtitulo="Preços expressos com temporizador de contagem regressiva"
        badgeText="Oferta Relâmpago"
        Icone={Flame}
        variante="carmesim"
        produtos={ofertasRelampago}
        loading={loading}
      />

      {/* 2. Super Promoções (Ouro Âmbar & Vinho) */}
      <SecaoCarrosselProduto
        titulo="Super Promoções"
        subtitulo="Nossos descontos mais expressivos selecionados a dedo"
        badgeText="Super Promoção"
        Icone={Sparkles}
        variante="ouro"
        produtos={superPromocoes}
        loading={loading}
      />

      {/* 3. Promoções (Verde Esmeralda Imperial) */}
      <SecaoCarrosselProduto
        titulo="Promoções"
        subtitulo="Oportunidades especiais de perfumaria fina"
        badgeText="Promoções"
        Icone={Tag}
        variante="esmeralda"
        produtos={promocoes}
        loading={loading}
      />

      {/* 4. Lançamentos (Azul Safira Nuit) */}
      <SecaoCarrosselProduto
        titulo="Lançamentos"
        subtitulo="As novidades mais desejadas direto do Oriente"
        badgeText="Lançamento"
        Icone={Sparkles}
        variante="safira"
        produtos={lancamentos}
        loading={loading}
      />

      {/* 5. Convencionais (Fragrâncias Exclusivas / Noir Clássico Zahara) */}
      <SecaoCarrosselProduto
        titulo="Fragrâncias Exclusivas"
        subtitulo="Nossa coleção clássica de perfumes refinados"
        badgeText="Coleção Clássica"
        Icone={Crown}
        variante="noir"
        produtos={convencionais}
        loading={loading}
      />

      {/* Brand Banner */}
      <section className="py-20 sm:py-28 bg-noir-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950 via-noir-900/50 to-noir-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/40 text-xl">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-ivory">
            A Arte da <span className="text-gradient-gold">Perfumaria</span>
          </h2>
          
          <p className="text-ivory/50 text-base sm:text-lg mb-8 leading-relaxed">
            Cada fragrância é uma jornada sensorial, uma história contada através de notas cuidadosamente selecionadas
          </p>
          
          <Link
            to="/loja"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-gold to-gold-light text-noir-950 font-semibold rounded-xl hover:shadow-lg hover:shadow-gold/25 transition-all duration-300"
          >
            Descobrir Agora
          </Link>
        </div>
      </section>
    </div>
  )
}
