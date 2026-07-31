import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Sparkles } from 'lucide-react'
import CardProduto from './CardProduto'

export default function Promocoes() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromocoes()
  }, [])

  async function fetchPromocoes() {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*, marcas(id, nome, logo_url)')
        .eq('ativo', true)
        .or('tags.cs.{promoção},tags.cs.{oferta relâmpago}')

      if (error) throw error

      // Excluir produtos que estão em promoção em massa
      const filtrados = (data || []).filter(p => !p.em_promocao_em_massa)

      setProdutos(filtrados)
    } catch (err) {
      console.warn('Erro ao buscar promoções:', err)
    }
    setLoading(false)
  }

  if (loading || produtos.length === 0) return null

  return (
    <section className="py-16 sm:py-24 bg-noir-950 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-wine/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 sm:mb-6"
            style={{
              background: 'rgba(201, 168, 76, 0.08)',
              border: '1px solid rgba(201, 168, 76, 0.25)',
            }}
          >
            <Sparkles size={16} className="text-gold" />
            <span className="text-gold text-xs sm:text-sm font-bold uppercase tracking-wider">
              Promoções
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-ivory mb-3 sm:mb-4">
            Aproveite os <span className="text-gold">Preços Especiais</span>
          </h2>
          <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-4 sm:mb-6" />
          <p className="font-display text-ivory/40 sm:text-ivory/50 italic text-sm sm:text-base max-w-xl mx-auto">
            Fragrâncias selecionadas com desconto por tempo limitado
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {produtos.map(produto => (
            <CardProduto key={produto.id} produto={produto} />
          ))}
        </div>
      </div>
    </section>
  )
}
