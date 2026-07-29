import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProdutos } from '../hooks/useProdutos'
import { useTracking } from '../hooks/useTracking'
import { getWhatsAppConfig, buildWhatsAppLink } from '../lib/whatsapp'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">
        Nossos <span className="text-gold">Perfumes</span>
      </h1>

      <Filtros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        marcas={marcas}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : (
        <ListaProdutos produtos={produtos} onWhatsAppClick={handleWhatsAppClick} />
      )}
    </div>
  )
}
