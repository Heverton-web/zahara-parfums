import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProdutos } from '../hooks/useProdutos'
import { useTracking } from '../hooks/useTracking'
import { getWhatsAppConfig, buildWhatsAppLink } from '../lib/whatsapp'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'
import { Gem } from 'lucide-react'

export default function Loja() {
  const [filtros, setFiltros] = useState({ genero: '', marca: '', tag: '' })
  const [marcas, setMarcas] = useState([])
  const { produtos, loading } = useProdutos({ ...filtros, ativo: true })
  const { trackClick } = useTracking()

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  async function handleWhatsAppClick(produto) {
    await trackClick(produto.id)
    const numero = await getWhatsAppConfig()
    const link = buildWhatsAppLink(numero, produto)
    window.open(link, '_blank')
  }

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  return (
    <div className="min-h-screen bg-noir-950 pt-24 pb-16">
      {/* Hero section */}
      <div className="relative py-16 mb-12">
        <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 to-noir-950" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <p className="font-accent text-sm uppercase tracking-[0.3em] text-gold/60 mb-4">
            Coleção Exclusiva
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            <span className="text-ivory">Nossos </span>
            <span className="text-gradient-gold">Perfumes</span>
          </h1>
          <div className="ornate-divider">
            <span>✦</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters */}
        <div className="mb-12">
          <Filtros
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            marcas={marcas}
          />
        </div>

        {/* Products */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="font-display text-ivory/50 italic">Carregando coleção...</p>
          </div>
        ) : produtos.length > 0 ? (
          <ListaProdutos produtos={produtos} onWhatsAppClick={handleWhatsAppClick} />
        ) : (
          <div className="text-center py-20">
            <Gem className="text-gold/20 mx-auto mb-4" size={64} />
            <p className="font-display text-ivory/50 italic text-xl mb-2">
              Nenhum produto encontrado
            </p>
            <p className="text-ivory/30 text-sm">
              Tente ajustar os filtros para ver mais resultados
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
