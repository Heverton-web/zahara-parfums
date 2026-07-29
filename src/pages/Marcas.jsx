import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Gem } from 'lucide-react'
import { marcasMock, produtosMock } from '../data/mock'

export default function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    // Se Supabase não está configurado, usar mock
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'
    
    if (!isSupabaseConfigured) {
      // Criar marcas com seus produtos
      const marcasComProdutos = marcasMock.map(marca => ({
        ...marca,
        produtos: produtosMock.filter(p => p.marca_id === marca.id)
      })).filter(m => m.produtos.length > 0)
      
      setMarcas(marcasComProdutos)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('marcas')
      .select('*, produtos!inner(id, nome, imagem_url, preco, ativo)')
      .order('nome')

    if (data) {
      setMarcas(data.filter(m => m.produtos.some(p => p.ativo)))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-noir-950 pt-16 sm:pt-20 pb-12 sm:pb-16">
      {/* Hero section */}
      <div className="relative py-10 sm:py-16 mb-8 sm:mb-12">
        <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 to-noir-950" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <p className="font-accent text-[10px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/60 mb-3 sm:mb-4">
            Marcas Exclusivas
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            <span className="text-ivory">Nossas </span>
            <span className="text-gradient-gold">Marcas</span>
          </h1>
          <div className="ornate-divider">
            <span>✦</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-sm sm:text-base">Carregando marcas...</p>
          </div>
        ) : marcas.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <Gem className="text-gold/20 mx-auto mb-4" size={48} />
            <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-lg sm:text-xl">
              Nenhuma marca cadastrada ainda
            </p>
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-16">
            {marcas.map((marca) => (
              <div key={marca.id} className="animate-fade-in">
                {/* Brand header */}
                <div className="flex items-center gap-4 sm:gap-6 mb-5 sm:mb-8">
                  {marca.logo_url ? (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-gold/15 sm:border-gold/20 flex-shrink-0">
                      <img
                        src={marca.logo_url}
                        alt={marca.nome}
                        className="w-full h-full object-contain bg-noir-900"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold/10 border border-gold/15 sm:border-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-accent text-lg sm:text-xl font-bold">
                        {marca.nome[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-heading text-xl sm:text-2xl font-bold text-ivory">
                      {marca.nome}
                    </h2>
                    <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent mt-1.5 sm:mt-2" />
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  {marca.produtos.filter(p => p.ativo).slice(0, 4).map((produto) => (
                    <Link
                      key={produto.id}
                      to={`/produto/${produto.id}`}
                      className="luxury-card rounded-xl overflow-hidden group"
                    >
                      <div className="aspect-square bg-noir-900 relative overflow-hidden">
                        {produto.imagem_url ? (
                          <img
                            src={produto.imagem_url}
                            alt={produto.nome}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gem className="text-gold/20" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-4">
                        <h3 className="font-heading text-sm sm:font-bold text-ivory group-hover:text-gold transition-colors duration-300 mb-1.5 sm:mb-2 line-clamp-2">
                          {produto.nome}
                        </h3>
                        <p className="price-tag text-base sm:text-lg">
                          R$ {produto.preco.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
