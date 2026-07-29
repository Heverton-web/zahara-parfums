import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">
        Nossas <span className="text-gold">Marcas</span>
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : marcas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nenhuma marca cadastrada.</div>
      ) : (
        <div className="space-y-12">
          {marcas.map((marca) => (
            <div key={marca.id}>
              <div className="flex items-center gap-4 mb-6">
                {marca.logo_url ? (
                  <img src={marca.logo_url} alt={marca.nome} className="h-12 w-12 object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-gold font-bold">
                    {marca.nome[0]}
                  </div>
                )}
                <h2 className="font-display text-2xl font-bold">{marca.nome}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {marca.produtos.filter(p => p.ativo).slice(0, 4).map((produto) => (
                  <Link
                    key={produto.id}
                    to={`/produto/${produto.id}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
                  >
                    <div className="aspect-square bg-zinc-800">
                      {produto.imagem_url ? (
                        <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">IMG</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{produto.nome}</h3>
                      <p className="text-gold font-bold">R$ {produto.preco.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
