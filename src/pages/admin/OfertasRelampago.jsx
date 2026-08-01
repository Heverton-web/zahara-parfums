import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Flame, Search, Loader2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import BulkPromotionModal from '../../components/admin/BulkPromotionModal'
import BulkPromotionList from '../../components/admin/BulkPromotionList'
import TabelaProdutosTag from '../../components/admin/TabelaProdutosTag'

export default function OfertasRelampago() {
  const [promocoes, setPromocoes] = useState([])
  const [produtosTag, setProdutosTag] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingProdutosTag, setLoadingProdutosTag] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [promocaoEditando, setPromocaoEditando] = useState(null)

  useEffect(() => {
    fetchPromocoes()
    fetchProdutosTag()
  }, [])

  async function fetchPromocoes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('promocoes_em_massa')
        .select(`
          *,
          promocao_em_massa_produtos (
            produto_id,
            produtos (id, nome, preco_original, imagem_url)
          )
        `)
        .ilike('tag', '%OFERTA RELÂMPAGO%')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromocoes(data || [])
    } catch (err) {
      console.error('Erro ao buscar ofertas relâmpago:', err)
    }
    setLoading(false)
  }

  async function fetchProdutosTag() {
    setLoadingProdutosTag(true)
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*, marcas(nome)')
        .eq('ativo', true)
        .or('tags.cs.{OFERTA RELÂMPAGO},tags.cs.{Oferta Relâmpago}')

      if (error) throw error
      setProdutosTag(data || [])
    } catch (err) {
      console.warn('Erro ao buscar produtos da tag Oferta Relâmpago:', err)
    }
    setLoadingProdutosTag(false)
  }

  function handleNovaPromocao() {
    setPromocaoEditando(null)
    setModalOpen(true)
  }

  function handleEditar(promocao) {
    setPromocaoEditando(promocao)
    setModalOpen(true)
  }

  async function handleToggleAtivo(id, statusAtual) {
    try {
      const { error } = await supabase
        .from('promocoes_em_massa')
        .update({ ativo: !statusAtual })
        .eq('id', id)

      if (error) throw error
      fetchPromocoes()
    } catch (err) {
      console.error('Erro ao alternar status da oferta relâmpago:', err)
    }
  }

  async function handleExcluir(id) {
    if (!window.confirm('Tem certeza que deseja excluir esta Oferta Relâmpago?')) return

    try {
      await supabase
        .from('produtos')
        .update({
          em_promocao_em_massa: false,
          preco_em_massa: null,
          promocao_em_massa_id: null,
        })
        .eq('promocao_em_massa_id', id)

      await supabase
        .from('promocao_em_massa_produtos')
        .delete()
        .eq('promocao_em_massa_id', id)

      const { error } = await supabase
        .from('promocoes_em_massa')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchPromocoes()
      fetchProdutosTag()
    } catch (err) {
      console.error('Erro ao excluir oferta relâmpago:', err)
    }
  }

  const promocoesFiltradas = promocoes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.tag && p.tag.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div className="pt-2 sm:pt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2 flex items-center gap-2">
            <Flame className="text-red-400" size={28} />
            <span>Ofertas Relâmpago</span>
          </h1>
          <p className="text-ivory/50 text-xs sm:text-sm">
            Gerencie promoções expressas com timer regressivo pré-definido (24h, 12h, 6h, 4h, 2h, 1h, 30min).
          </p>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-red-400/50 to-transparent mt-2" />
        </div>

        <Button onClick={handleNovaPromocao} className="w-full sm:w-auto text-sm">
          <Plus size={16} />
          <span>+ Nova Oferta Relâmpago</span>
        </Button>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/30" />
        <input
          type="text"
          placeholder="Buscar oferta relâmpago por nome ou tag..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-ivory bg-noir-900 border border-gold/15 focus:border-gold/40 focus:outline-none"
        />
      </div>

      {/* Conteúdo Campanhas */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 size={28} className="animate-spin text-red-400 mx-auto mb-3" />
          <p className="text-ivory/40 text-sm">Carregando ofertas relâmpago...</p>
        </div>
      ) : (
        <BulkPromotionList
          promocoes={promocoesFiltradas}
          onEditar={handleEditar}
          onToggleAtivo={handleToggleAtivo}
          onExcluir={handleExcluir}
        />
      )}

      {/* Tabela de Produtos vinculados à Tag "Oferta Relâmpago" */}
      <TabelaProdutosTag
        tituloTag="Oferta Relâmpago"
        produtos={produtosTag}
        loading={loadingProdutosTag}
      />

      {/* Modal */}
      <BulkPromotionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { fetchPromocoes(); fetchProdutosTag(); }}
        promocao={promocaoEditando}
        isRelampago={true}
      />
    </div>
  )
}
