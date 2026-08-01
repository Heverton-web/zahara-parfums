import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, Tag, Package, Search, Loader2, Zap } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import BulkPromotionModal from '../../components/admin/BulkPromotionModal'

export default function PromocoesEmMassa() {
  const [promocoes, setPromocoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [promoEditando, setPromoEditando] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchPromocoes()
  }, [])

  async function fetchPromocoes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('promocoes_em_massa')
        .select(`
          *,
          promocao_em_massa_produtos (
            produto_id
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromocoes(data || [])
    } catch (err) {
      console.error('Erro ao buscar promoções:', err)
    }
    setLoading(false)
  }

  // ── Ativar/Inativar ──────────────────────────────────────
  async function handleToggle(promo) {
    setTogglingId(promo.id)
    const novaAtiva = !promo.ativa

    try {
      if (novaAtiva) {
        // Reativar: recalcular preços e aplicar aos produtos
        await applyPromotionToProducts(promo)
      } else {
        // Inativar: limpar preços dos produtos
        await removePromotionFromProducts(promo)
      }

      await supabase
        .from('promocoes_em_massa')
        .update({ ativa: novaAtiva })
        .eq('id', promo.id)

      await fetchPromocoes()
    } catch (err) {
      console.error('Erro ao toggle promoção:', err)
    }
    setTogglingId(null)
  }

  async function applyPromotionToProducts(promo) {
    const { data: junction } = await supabase
      .from('promocao_em_massa_produtos')
      .select('produto_id')
      .eq('promocao_em_massa_id', promo.id)

    for (const j of (junction || [])) {
      const { data: prod } = await supabase
        .from('produtos')
        .select('preco_original')
        .eq('id', j.produto_id)
        .single()

      if (!prod) continue
      const preco = Number(prod.preco_original) || 0
      const precoEmMassa = promo.tipo_desconto === 'fixo'
        ? Math.max(0, preco - Number(promo.valor_desconto))
        : Math.max(0, preco * (1 - Number(promo.valor_desconto) / 100))

      await supabase.from('produtos').update({
        preco_em_massa: precoEmMassa,
        em_promocao_em_massa: true,
        promocao_em_massa_id: promo.id,
        tags: [promo.tag || 'SUPER PROMOÇÃO'],
      }).eq('id', j.produto_id)
    }
  }

  async function removePromotionFromProducts(promo) {
    const { data: junction } = await supabase
      .from('promocao_em_massa_produtos')
      .select('produto_id')
      .eq('promocao_em_massa_id', promo.id)

    for (const j of (junction || [])) {
      await supabase.from('produtos').update({
        preco_em_massa: null,
        em_promocao_em_massa: false,
        promocao_em_massa_id: null,
        tags: [],
      }).eq('id', j.produto_id)
    }
  }

  // ── Deletar ──────────────────────────────────────────────
  async function handleDeleteConfirm() {
    if (!promoToDelete) return
    setDeleting(true)

    try {
      await removePromotionFromProducts(promoToDelete)

      const { error } = await supabase
        .from('promocoes_em_massa')
        .delete()
        .eq('id', promoToDelete.id)

      if (error) throw error
      await fetchPromocoes()
    } catch (err) {
      console.error('Erro ao deletar promoção:', err)
    }

    setDeleting(false)
    setPromoToDelete(null)
    setConfirmOpen(false)
  }

  // ── Editar ───────────────────────────────────────────────
  function handleEdit(promo) {
    setPromoEditando(promo)
    setModalOpen(true)
  }

  function handleNew() {
    setPromoEditando(null)
    setModalOpen(true)
  }

  function handleSuccess() {
    setModalOpen(false)
    setPromoEditando(null)
    fetchPromocoes()
  }

  // ── Helpers ──────────────────────────────────────────────
  function getStatus(promo) {
    const now = new Date()
    const inicio = new Date(promo.data_inicio)
    const fim = new Date(promo.data_fim)

    if (!promo.ativa) return { label: 'Inativa', variant: 'danger' }
    if (now < inicio) return { label: 'Agendada', variant: 'warning' }
    if (now > fim) return { label: 'Expirada', variant: 'danger' }
    return { label: 'Ativa', variant: 'success' }
  }

  function formatarData(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  function formatarHora(dateStr) {
    return new Date(dateStr).toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit',
    })
  }

  const promosFiltradas = promocoes.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.tag.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="pt-2 sm:pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Super Promoções
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto text-sm">
          <Plus size={16} />
          <span>Nova Super Promoção</span>
        </Button>
      </div>

      {/* Busca */}
      <div className="relative mb-5 sm:mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
        <input
          type="text"
          placeholder="Buscar promoção..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="input-luxury w-full pl-9 text-sm"
        />
      </div>

      {/* Desktop Table */}
      <div
        className="hidden lg:block bg-noir-900 rounded-xl overflow-hidden"
        style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.15)' }}>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Nome</th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Tag</th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Desconto</th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Período</th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Produtos</th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Status</th>
                <th className="text-right px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : promosFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <p className="text-ivory/25 italic text-sm">Nenhuma promoção encontrada</p>
                  </td>
                </tr>
              ) : (
                promosFiltradas.map((promo) => {
                  const status = getStatus(promo)
                  const qtdProdutos = promo.promocao_em_massa_produtos?.length || 0
                  return (
                    <tr
                      key={promo.id}
                      className="hover:bg-noir-800 transition-colors duration-200"
                      style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.1)' }}
                    >
                      <td className="px-5 py-3">
                        <span className="text-ivory/80 font-medium text-sm">{promo.nome}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant="gold" className="text-[9px]">{promo.tag}</Badge>
                      </td>
                      <td className="px-5 py-3 text-ivory/50 text-sm">
                        {promo.tipo_desconto === 'fixo'
                          ? `R$ ${Number(promo.valor_desconto).toFixed(2)}`
                          : `${promo.valor_desconto}%`}
                      </td>
                      <td className="px-5 py-3 text-ivory/40 text-xs">
                        <div>{formatarData(promo.data_inicio)}</div>
                        <div className="text-ivory/25">{formatarHora(promo.data_inicio)}</div>
                        <div className="text-ivory/25">até</div>
                        <div>{formatarData(promo.data_fim)}</div>
                        <div className="text-ivory/25">{formatarHora(promo.data_fim)}</div>
                      </td>
                      <td className="px-5 py-3 text-ivory/50 text-sm">
                        <span className="flex items-center gap-1">
                          <Package size={12} />
                          {qtdProdutos}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={status.variant} className="text-[10px]">{status.label}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleToggle(promo)}
                            disabled={togglingId === promo.id}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all duration-300 disabled:opacity-50"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                            title={promo.ativa ? 'Inativar' : 'Ativar'}
                          >
                            {togglingId === promo.id ? (
                              <div className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin" />
                            ) : (
                              promo.ativa ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(promo)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all duration-300"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                            title="Editar"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => { setPromoToDelete(promo); setConfirmOpen(true) }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-wine transition-all duration-300"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : promosFiltradas.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ivory/25 italic">Nenhuma promoção encontrada</p>
          </div>
        ) : (
          promosFiltradas.map((promo) => {
            const status = getStatus(promo)
            const qtdProdutos = promo.promocao_em_massa_produtos?.length || 0
            return (
              <div
                key={promo.id}
                className="bg-noir-900 rounded-xl p-4"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-ivory/80 font-medium text-sm truncate">{promo.nome}</h3>
                      <Badge variant={status.variant} className="text-[9px] px-1.5 py-0 flex-shrink-0">{status.label}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-ivory/30 text-xs">
                      <span className="flex items-center gap-1"><Tag size={10} />{promo.tag}</span>
                      <span className="flex items-center gap-1"><Package size={10} />{qtdProdutos} produtos</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-ivory/25 text-xs">
                    <span>{formatarData(promo.data_inicio)} → {formatarData(promo.data_fim)}</span>
                    <span className="ml-2">
                      {promo.tipo_desconto === 'fixo'
                        ? `R$ ${Number(promo.valor_desconto).toFixed(2)} off`
                        : `${promo.valor_desconto}% off`}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleToggle(promo)}
                      disabled={togglingId === promo.id}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all disabled:opacity-50"
                      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                    >
                      {togglingId === promo.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        promo.ativa ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(promo)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all"
                      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => { setPromoToDelete(promo); setConfirmOpen(true) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-wine transition-all"
                      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal */}
      <BulkPromotionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setPromoEditando(null) }}
        onSuccess={handleSuccess}
        promocao={promoEditando}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPromoToDelete(null) }}
        onConfirm={handleDeleteConfirm}
        title="Excluir Promoção em Massa"
        message={`Tem certeza que deseja excluir "${promoToDelete?.nome}"? Os produtos voltarão ao preço normal.`}
        confirmText={deleting ? 'Excluindo...' : 'Excluir'}
        variant="danger"
      />
    </div>
  )
}
