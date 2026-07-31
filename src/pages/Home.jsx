import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'
import { Sparkles, Crown, Gem } from 'lucide-react'
import CardProduto from '../components/product/CardProduto'
import SuperPromocoes from '../components/product/SuperPromocoes'
import Promocoes from '../components/product/Promocoes'

export default function Home() {
  const { produtos } = useProdutos({ ativo: true })

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background escuro sólido */}
        <div className="absolute inset-0 bg-noir-950" />
        
        {/* Pattern sutil */}
        <div className="absolute inset-0 bg-pattern-arabic opacity-10" />
        
        {/* Gradiente dourado sutil no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Decoração superior */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold/70 text-lg">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* Marca */}
          <p className="font-accent text-gold/60 text-[11px] uppercase tracking-[0.4em] mb-8">
            Zahara Parfums
          </p>

          {/* Título principal */}
          <h1 className="font-heading text-6xl sm:text-8xl md:text-9xl font-bold mb-8 leading-[0.9]">
            <span className="text-ivory block mb-2">A Essência</span>
            <span className="text-gradient-gold block">Do Oriente</span>
          </h1>

          {/* Linha decorativa */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent mx-auto mb-8" />

          {/* Descrição */}
          <p className="font-display text-ivory/50 text-lg sm:text-xl max-w-xl mx-auto mb-12 italic leading-relaxed">
            Fragrâncias árabes de luxo importadas direto do Oriente Médio.
            Cada gota carrega séculos de tradição em perfumaria.
          </p>

          {/* Botões */}
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

          {/* Decoração inferior */}
          <div className="flex items-center justify-center gap-4 mt-16">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-gold/20" />
            <span className="text-gold/30 text-xs">◆</span>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </div>

        {/* Scroll indicator - mouse */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
          <div className="w-6 h-10 rounded-full border border-ivory/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2.5 bg-gold/50 rounded-full animate-scroll-wheel" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 bg-noir-950 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border border-gold/10 group-hover:border-gold/30 transition-all duration-500">
                <Gem className="text-gold/70" size={24} />
              </div>
              <h3 className="text-ivory font-semibold mb-2">
                Entrega Premium
              </h3>
              <p className="text-ivory/40 text-sm leading-relaxed">
                Atendimento VIP e entrega em todo o Brasil com embalagem de presente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="py-20 sm:py-28 bg-noir-950 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header da seção */}
          <div className="text-center mb-12">
            <p className="text-gold/50 text-xs uppercase tracking-[0.2em] mb-3 font-medium">
              Descubra
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ivory mb-4">
              Destaques da Semana
            </h2>
            <div className="w-12 h-px bg-gold/30 mx-auto" />
          </div>

          {/* Grid de produtos - exclui promo e super promo */}
          {(() => {
            const destaque = produtos.filter(p =>
              !p.em_promocao_em_massa &&
              !p.tags?.includes('promoção') &&
              !p.tags?.includes('oferta relâmpago')
            ).slice(0, 3)
            return destaque.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {destaque.map((produto, index) => (
                <div
                  key={produto.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardProduto produto={produto} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gem className="text-gold/20 mx-auto mb-4" size={48} />
              <p className="text-ivory/40 italic">
                Nenhum produto em destaque ainda.
              </p>
            </div>
            )
          })()}

          {/* Botão ver todos */}
          <div className="text-center mt-12">
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition-all duration-300"
            >
              <span>Ver Toda Coleção</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Super Promoções */}
      <SuperPromocoes />

      {/* Promoções */}
      <Promocoes />

      {/* Brand Banner */}
      <section className="py-20 sm:py-28 bg-noir-950 relative overflow-hidden">
        {/* Background decorativo */}
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
