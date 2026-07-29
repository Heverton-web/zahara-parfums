import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Gem } from 'lucide-react'

export default function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
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
    <div className="min-h-screen bg-noir-950 pt-24 pb-16">
      {/* Hero section */}
      <div className="relative py-16 mb-12">
        <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 to-noir-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <p className="font-accent text-sm uppercase tracking-[0.3em] text-gold/60 mb-4">
            Marcas Exclusivas
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            <span className="text-ivory">Nossas </span>
            <span className="text-gradient-gold">Marcas</span>
          </h1>
          <div className="ornate-divider">
            <span>✦</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/50 italic">Carregando marcas...</p>
          </div>
        ) : marcas.length === 0 ? (
          <div className="text-center py-20">
            <Gem className="text-gold/20 mx-auto mb-4" size={64} />
            <p className="font-display text-ivory/50 italic text-xl">
              Nenhuma marca cadastrada ainda
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {marcas.map((marca) => (
              <div key={marca.id} className="animate-fade-in">
                {/* Brand header */}
                <div className="flex items-center gap-6 mb-8">
                  {marca.logo_url ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-gold/20">
                      <img
                        src={marca.logo_url}
                        alt={marca.nome}
                        className="w-full h-full object-contain bg-noir-900"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <span className="text-gold font-accent text-xl font-bold">
                        {marca.nome[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-ivory">
                      {marca.nome}
                    </h2>
                    <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent mt-2" />
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-ivory group-hover:text-gold transition-colors duration-300 mb-2">
                          {produto.nome}
                        </h3>
                        <p className="price-tag text-lg">
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
