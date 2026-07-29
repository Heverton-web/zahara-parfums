import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'
import { Sparkles, Crown, Gem } from 'lucide-react'

export default function Home() {
  const { produtos } = useProdutos({ ativo: true })

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center overflow-hidden hero-bg">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-pattern-arabic opacity-30" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 via-noir-950/60 to-noir-950" />
        
        {/* Decorative elements - hidden on mobile */}
        <div className="hidden sm:block absolute top-20 left-10 text-gold/10 text-9xl font-accent animate-float">✦</div>
        <div className="hidden sm:block absolute bottom-20 right-10 text-gold/10 text-9xl font-accent animate-float" style={{ animationDelay: '3s' }}>✦</div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          {/* Ornate top decoration */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold text-lg sm:text-2xl">✦</span>
            <div className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>

          {/* Subtitle */}
          <p className="font-accent text-[10px] sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gold/60 sm:text-gold/70 mb-4 sm:mb-6">
            Experiência Única em Fragrâncias
          </p>

          {/* Main heading */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6 leading-[1.1]">
            <span className="text-ivory">Zahara</span>
            <br />
            <span className="text-gradient-gold">Parfums</span>
          </h1>

          {/* Description */}
          <p className="font-display text-base sm:text-lg md:text-xl text-ivory/60 sm:text-ivory/70 mb-8 sm:mb-10 max-w-xl mx-auto italic px-2">
            Perfumes importados que despertam suas emoções e transportam você a um mundo de sofisticação
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/loja" className="btn-luxury w-full sm:w-auto text-base sm:text-lg">
              Explorar Coleção
            </Link>
            <Link
              to="/marcas"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg border border-gold/20 sm:border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 text-base sm:text-lg text-center"
            >
              Nossas Marcas
            </Link>
          </div>

          {/* Ornate bottom decoration */}
          <div className="hidden sm:flex items-center justify-center gap-4 mt-12">
            <div className="w-24 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <span className="text-gold/50 text-sm">◆</span>
            <div className="w-24 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden sm:block absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-gold/40 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-noir-950 to-noir-900 relative">
        <div className="absolute inset-0 bg-pattern-ornate opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/15 sm:border-gold/20 group-hover:border-gold/40 transition-all duration-300">
                <Sparkles className="text-gold" size={28} />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ivory">
                Qualidade Premium
              </h3>
              <p className="font-display text-sm sm:text-base text-ivory/50 sm:text-ivory/60 italic">
                Selecionamos apenas as melhores fragrâncias importadas do Oriente Médio e Europa
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/15 sm:border-gold/20 group-hover:border-gold/40 transition-all duration-300">
                <Crown className="text-gold" size={28} />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ivory">
                Exclusividade
              </h3>
              <p className="font-display text-sm sm:text-base text-ivory/50 sm:text-ivory/60 italic">
                Edições limitadas e fórmulas únicas que não encontrará em qualquer lugar
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gold/10 flex items-center justify-center border border-gold/15 sm:border-gold/20 group-hover:border-gold/40 transition-all duration-300">
                <Gem className="text-gold" size={28} />
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-ivory">
                Entrega Personalizada
              </h3>
              <p className="font-display text-sm sm:text-base text-ivory/50 sm:text-ivory/60 italic">
                Atendimento VIP e entrega em todo o Brasil com embalagem de presente
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="py-16 sm:py-24 bg-noir-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-16">
            <p className="font-accent text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/60 sm:text-gold/70 mb-3 sm:mb-4">
              Descubra
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="text-ivory">Destaques </span>
              <span className="text-gradient-gold">da Semana</span>
            </h2>
            <div className="ornate-divider">
              <span>✦</span>
            </div>
          </div>

          {/* Products grid */}
          {produtos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
              {produtos.slice(0, 3).map((produto, index) => (
                <Link
                  key={produto.id}
                  to={`/produto/${produto.id}`}
                  className="luxury-card rounded-xl sm:rounded-2xl overflow-hidden group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image container */}
                  <div className="aspect-square bg-noir-900 relative overflow-hidden">
                    {produto.imagem_url ? (
                      <img
                        src={produto.imagem_url}
                        alt={produto.nome}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gem className="text-gold/20" size={48} />
                      </div>
                    )}
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Quick view badge - only on hover for desktop */}
                    <div className="hidden sm:block absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <div className="bg-gold/90 text-noir-950 text-center py-3 rounded-lg font-semibold text-sm">
                        Ver Detalhes
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-6">
                    <p className="font-accent text-[8px] sm:text-[10px] uppercase tracking-wider text-gold/50 mb-1 sm:mb-2">
                      {produto.marcas?.nome}
                    </p>
                    <h3 className="font-heading text-sm sm:text-lg font-bold text-ivory mb-2 sm:mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                      {produto.nome}
                    </h3>
                    <p className="price-tag text-base sm:text-xl">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <Gem className="text-gold/20 mx-auto mb-4" size={48} />
              <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-base sm:text-lg">
                Nenhum produto em destaque ainda.
              </p>
            </div>
          )}

          {/* View all button */}
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/loja"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg border border-gold/20 sm:border-gold/30 text-gold hover:bg-gold/10 transition-all duration-300 text-sm sm:text-base"
            >
              <span>Ver Toda Coleção</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-noir-950 via-noir-900 to-noir-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent to-gold/50" />
            <span className="text-gold text-2xl sm:text-3xl">✦</span>
            <div className="w-12 sm:w-20 h-px bg-gradient-to-l from-transparent to-gold/50" />
          </div>
          
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-ivory">
            A Arte da <span className="text-gradient-gold">Perfumaria</span>
          </h2>
          
          <p className="font-display text-base sm:text-lg text-ivory/60 sm:text-ivory/70 italic mb-6 sm:mb-8 max-w-2xl mx-auto">
            Cada fragrância é uma jornada sensorial, uma história contada através de notas cuidadosamente selecionadas
          </p>
          
          <Link
            to="/loja"
            className="btn-luxury inline-block text-sm sm:text-base"
          >
            Descobrir Agora
          </Link>
        </div>
      </section>
    </div>
  )
}
