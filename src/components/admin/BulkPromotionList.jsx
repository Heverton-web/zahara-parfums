import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash2, Clock, Tag, Package, AlertCircle } from 'lucide-react'
import Badge from '../ui/Badge'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function BulkPromotionList({ refreshKey = 0, onDeleted }) {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPromocoes()
  }, [refreshKey])

  async function fetchPromocoes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('promocoes_em_massa')
        .select(`
          *,
          promocao_em_massa_produtos (
            produto_id,
            produtos ( id, nome )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromocoes(data || [])
    } catch (err) {
      console.error('Erro ao buscar promoções em massa:', err)
    }
    setLoading(false)
  }

  async function handleDeleteConfirm() {
    if (!promoToDelete) return
    setDeleting(true)

    try {
      // 1. Buscar produtos dessa promoção
      const { data: junction } = await supabase
        .from('promocao_em_massa_produtos')
        .select('produto_id')
        .eq('promocao_em_massa_id', promoToDelete.id)

      const produtoIds = (junction || []).map(j => j.produto_id)

      // 2. Limpar preços em massa dos produtos
      for (const pid of produtoIds) {
        // Buscar tags atuais e remover a tag da promoção
        const { data: prod } = await supabase
          .from('produtos')
          .select('tags')
          .eq('id', pid)
          .single()

        const tagsFiltradas = (prod?.tags || []).filter(t => t !== promoToDelete.tag)

        await supabase
          .from('produtos')
          .update({
            preco_em_massa: null,
            em_promocao_em_massa: false,
            promocao_em_massa_id: null,
            tags: tagsFiltradas,
          })
          .eq('id', pid)
      }

      // 3. Deletar a promoção (cascade deleta a junction)
      const { error } = await supabase
        .from('promocoes_em_massa')
        .delete()
        .eq('id', promoToDelete.id)

      if (error) throw error

      await fetchPromocoes()
      onDeleted?.()
    } catch (err) {
      console.error('Erro ao deletar promoção:', err)
    }

    setDeleting(false)
    setPromoToDelete(null)
    setConfirmOpen(false)
  }

  function getStatus(promo) {
    const now = new Date()
    const inicio = new Date(promo.data_inicio)
    const fim = new Date(promo.data_fim)

    if (!promo.ativa) return { label: 'Expirada', variant: 'danger' }
    if (now < inicio) return { label: 'Agendada', variant: 'warning' }
    if (now > fim) return { label: 'Expirada', variant: 'danger' }
    return { label: 'Ativa', variant: 'success' }
  }

  function formatarData(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (promocoes.length === 0) {
    return (
      <div className="py-8 text-center">
        <Tag className="text-ivory/15 mx-auto mb-3" size={32} />
        <p className="text-ivory/25 text-sm italic">Nenhuma promoção em massa criada</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {promocoes.map(promo => {
          const status = getStatus(promo)
          const qtdProdutos = promo.promocao_em_massa_produtos?.length || 0

          return (
            <div
              key={promo.id}
              className="bg-noir-900 rounded-xl p-4 flex items-center gap-4"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.12)' }}
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-ivory/80 font-medium text-sm truncate">{promo.nome}</h3>
                  <Badge variant={status.variant} className="text-[9px] px-1.5 py-0 flex-shrink-0">
                    {status.label}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-ivory/30 text-xs">
                  <span className="flex items-center gap-1">
                    <Tag size={10} />
                    {promo.tag}
                  </span>
                  <span className="flex items-center gap-1">
                    <Package size={10} />
                    {qtdProdutos} {qtdProdutos === 1 ? 'produto' : 'produtos'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {formatarData(promo.data_inicio)} → {formatarData(promo.data_fim)}
                  </span>
                </div>

                <p className="text-ivory/20 text-xs mt-1">
                  {promo.tipo_desconto === 'fixo' ? `R$ ${Number(promo.valor_desconto).toFixed(2)} off` : `${promo.valor_desconto}% off`}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => { setPromoToDelete(promo); setConfirmOpen(true) }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ivory/20 hover:text-wine transition-all flex-shrink-0"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
                title="Excluir promoção"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )
        })}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPromoToDelete(null) }}
        onConfirm={handleDeleteConfirm}
        title="Excluir Promoção em Massa"
        message={`Tem certeza que deseja excluir a promoção "${promoToDelete?.nome}"? Os produtos voltarão ao preço normal.`}
        confirmText={deleting ? 'Excluindo...' : 'Excluir'}
        variant="danger"
      />
    </>
  )
}
