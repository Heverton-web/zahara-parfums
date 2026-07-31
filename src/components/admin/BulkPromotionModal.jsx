import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Search, Plus, Trash2, Loader2, Tag, Calendar, DollarSign, Percent } from 'lucide-react'
import Button from '../ui/Button'

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all bg-noir-800/50 border border-ivory/5 focus:border-gold/30 hover:border-ivory/10"

export default function BulkPromotionModal({ isOpen, onClose, onSuccess, promocao = null }) {
  const [nome, setNome] = useState('')
  const [tag, setTag] = useState('SUPER PROMOÇÃO')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [tipoDesconto, setTipoDesconto] = useState('fixo')
  const [valorDesconto, setValorDesconto] = useState('')
  const [produtos, setProdutos] = useState([])
  const [produtosSelecionados, setProdutosSelecionados] = useState([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingProdutos, setLoadingProdutos] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      fetchProdutos()
      if (promocao) {
        // Editar: preencher com dados existentes
        setNome(promocao.nome)
        setTag(promocao.tag || 'SUPER PROMOÇÃO')
        setDataInicio(formatDateTimeLocal(new Date(promocao.data_inicio)))
        setDataFim(formatDateTimeLocal(new Date(promocao.data_fim)))
        setTipoDesconto(promocao.tipo_desconto)
        setValorDesconto(String(promocao.valor_desconto))
        // Buscar produtos vinculados
        fetchProdutosVinculados(promocao.id)
      } else {
        // Criar: defaults
        const now = new Date()
        const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        setDataInicio(formatDateTimeLocal(now))
        setDataFim(formatDateTimeLocal(weekLater))
      }
    } else {
      resetForm()
    }
  }, [isOpen, promocao])

  function formatDateTimeLocal(date) {
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  function resetForm() {
    setNome('')
    setTag('SUPER PROMOÇÃO')
    setDataInicio('')
    setDataFim('')
    setTipoDesconto('fixo')
    setValorDesconto('')
    setProdutosSelecionados([])
    setBusca('')
    setError('')
  }

  async function fetchProdutos() {
    setLoadingProdutos(true)
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome, preco_original, em_promocao_em_massa')
        .eq('ativo', true)
        .order('nome')

      if (error) throw error
      setProdutos(data || [])
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    }
    setLoadingProdutos(false)
  }

  async function fetchProdutosVinculados(promocaoId) {
    try {
      const { data: junction } = await supabase
        .from('promocao_em_massa_produtos')
        .select('produto_id')
        .eq('promocao_em_massa_id', promocaoId)

      const ids = (junction || []).map(j => j.produto_id)
      if (ids.length > 0) {
        const { data: prods } = await supabase
          .from('produtos')
          .select('id, nome, preco_original, em_promocao_em_massa, promocao_em_massa_id')
          .in('id', ids)
        setProdutosSelecionados(prods || [])
      }
    } catch (err) {
      console.error('Erro ao buscar produtos vinculados:', err)
    }
  }

  function toggleProduto(produto) {
    setProdutosSelecionados(prev => {
      const exists = prev.find(p => p.id === produto.id)
      if (exists) return prev.filter(p => p.id !== produto.id)
      return [...prev, produto]
    })
  }

  function calcularPrecoEmMassa(precoOriginal) {
    if (!valorDesconto || !precoOriginal) return precoOriginal
    const val = Number(String(valorDesconto).replace(',', '.'))
    if (isNaN(val) || val <= 0) return precoOriginal
    const preco = Number(precoOriginal)
    if (tipoDesconto === 'fixo') {
      return Math.max(0, preco - val)
    }
    return Math.max(0, preco * (1 - val / 100))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!nome.trim()) { setError('Nome da promoção é obrigatório'); return }
    if (!dataInicio) { setError('Data de início é obrigatória'); return }
    if (!dataFim) { setError('Data de término é obrigatória'); return }
    if (new Date(dataFim) <= new Date(dataInicio)) { setError('Data de término deve ser posterior à data de início'); return }
    if (!valorDesconto || Number(valorDesconto) <= 0) { setError('Valor do desconto é obrigatório'); return }
    if (produtosSelecionados.length === 0) { setError('Selecione ao menos 1 produto'); return }

    setLoading(true)

    try {
      const isEdit = !!promocao
      const novaTag = tag.trim() || 'SUPER PROMOÇÃO'
      let promocaoId

      if (isEdit) {
        // 1. Atualizar promoção
        const { error: errUpdate } = await supabase
          .from('promocoes_em_massa')
          .update({
            nome: nome.trim(),
            tag: novaTag,
            data_inicio: new Date(dataInicio).toISOString(),
            data_fim: new Date(dataFim).toISOString(),
            tipo_desconto: tipoDesconto,
            valor_desconto: Number(String(valorDesconto).replace(',', '.')),
          })
          .eq('id', promocao.id)
        if (errUpdate) throw errUpdate
        promocaoId = promocao.id

        // 2. Limpar produtos antigos
        const { data: oldJunction } = await supabase
          .from('promocao_em_massa_produtos')
          .select('produto_id')
          .eq('promocao_em_massa_id', promocao.id)

        for (const j of (oldJunction || [])) {
          const { data: prod } = await supabase.from('produtos').select('tags').eq('id', j.produto_id).single()
          const tagsFiltradas = (prod?.tags || []).filter(t => t !== novaTag)
          await supabase.from('produtos').update({
            preco_em_massa: null, em_promocao_em_massa: false, promocao_em_massa_id: null, tags: tagsFiltradas,
          }).eq('id', j.produto_id)
        }

        // 3. Deletar junction antiga
        await supabase.from('promocao_em_massa_produtos').delete().eq('promocao_em_massa_id', promocao.id)
      } else {
        // Criar nova promoção
        const { data: novaPromo, error: errPromocao } = await supabase
          .from('promocoes_em_massa')
          .insert({
            nome: nome.trim(),
            tag: novaTag,
            data_inicio: new Date(dataInicio).toISOString(),
            data_fim: new Date(dataFim).toISOString(),
            tipo_desconto: tipoDesconto,
            valor_desconto: Number(String(valorDesconto).replace(',', '.')),
          })
          .select()
          .single()
        if (errPromocao) throw errPromocao
        promocaoId = novaPromo.id
      }

      // 4. Inserir nova junction
      const junctionRows = produtosSelecionados.map(p => ({
        promocao_em_massa_id: promocaoId,
        produto_id: p.id,
      }))
      const { error: errJunction } = await supabase
        .from('promocao_em_massa_produtos')
        .insert(junctionRows)
      if (errJunction) throw errJunction

      // 5. Atualizar cada produto
      for (const produto of produtosSelecionados) {
        const precoEmMassa = calcularPrecoEmMassa(produto.preco_original)
        const { error: errProd } = await supabase
          .from('produtos')
          .update({
            preco_em_massa: precoEmMassa,
            em_promocao_em_massa: true,
            promocao_em_massa_id: promocaoId,
            tags: [novaTag],
          })
          .eq('id', produto.id)
        if (errProd) throw errProd
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erro ao criar promoção em massa:', err)
      setError(err.message || 'Erro ao criar promoção em massa')
    }

    setLoading(false)
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div
        className="relative w-full max-w-[700px] rounded-2xl shadow-2xl mx-auto max-h-[90vh] flex flex-col"
        style={{ backgroundColor: '#0a0a0f', border: '1px solid rgba(212, 175, 55, 0.12)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <div>
            <h2 className="font-heading text-xl font-bold text-ivory">
              {promocao ? 'Editar Promoção' : 'Nova Promoção em Massa'}
            </h2>
            <div className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent mt-1.5" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-ivory/30 hover:text-ivory hover:bg-ivory/5 transition-all"
            style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
              Nome da Promoção
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Black Friday Zahara"
              className={inputClass}
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
              Tag da Promoção
            </label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/25" />
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder="SUPER PROMOÇÃO"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                Data de Início
              </label>
              <input
                type="datetime-local"
                value={dataInicio}
                onChange={e => setDataInicio(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                Data de Término
              </label>
              <input
                type="datetime-local"
                value={dataFim}
                onChange={e => setDataFim(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Tipo de desconto + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                Tipo de Desconto
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTipoDesconto('fixo')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    tipoDesconto === 'fixo'
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                  }`}
                >
                  <DollarSign size={14} />
                  Valor Fixo
                </button>
                <button
                  type="button"
                  onClick={() => setTipoDesconto('percentual')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    tipoDesconto === 'percentual'
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                  }`}
                >
                  <Percent size={14} />
                  Percentual
                </button>
              </div>
            </div>
            <div>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                {tipoDesconto === 'fixo' ? 'Valor (R$)' : 'Percentual (%)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/25 text-sm">
                  {tipoDesconto === 'fixo' ? 'R$' : '%'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorDesconto}
                  onChange={e => setValorDesconto(e.target.value)}
                  placeholder={tipoDesconto === 'fixo' ? '150.00' : '20'}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          {/* Seleção de produtos */}
          <div>
            <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
              Produtos na Promoção ({produtosSelecionados.length} selecionados)
            </label>

            {/* Busca */}
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/25" />
              <input
                type="text"
                value={busca}
                onChange={e => setBusca(e.target.value)}
                placeholder="Buscar produto..."
                className={`${inputClass} pl-9 text-xs`}
              />
            </div>

            {/* Lista de produtos */}
            <div
              className="max-h-[200px] overflow-y-auto rounded-lg"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
            >
              {loadingProdutos ? (
                <div className="p-6 text-center">
                  <Loader2 size={20} className="animate-spin text-gold/40 mx-auto" />
                </div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="p-6 text-center text-ivory/25 text-sm italic">
                  Nenhum produto encontrado
                </div>
              ) : (
                produtosFiltrados.map(produto => {
                  const selecionado = produtosSelecionados.some(p => p.id === produto.id)
                  const precoEmMassa = calcularPrecoEmMassa(produto.preco_original)
                  return (
                    <button
                      key={produto.id}
                      type="button"
                      onClick={() => toggleProduto(produto)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-all text-sm ${
                        selecionado
                          ? 'bg-gold/10 border-l-2 border-l-gold'
                          : 'hover:bg-noir-800/50 border-l-2 border-l-transparent'
                      }`}
                      style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.06)' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${selecionado ? 'text-gold' : 'text-ivory/70'}`}>
                          {produto.nome}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-ivory/30 text-xs">
                            R$ {Number(produto.preco_original).toFixed(2)}
                          </span>
                          {selecionado && valorDesconto && (
                            <>
                              <span className="text-ivory/20 text-xs">→</span>
                              <span className="text-emerald-400 text-xs font-medium">
                                R$ {precoEmMassa.toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ml-2 ${
                        selecionado
                          ? 'bg-gold/20 text-gold'
                          : 'bg-noir-800 text-ivory/20'
                      }`}>
                        {selecionado ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <Plus size={12} />
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 pt-0">
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-noir-800/50 text-ivory/50 hover:text-ivory/70"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <Tag size={16} className="mr-2" />
              )}
              {promocao ? 'Salvar Alterações' : 'Criar Promoção'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
