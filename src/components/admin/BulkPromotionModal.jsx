import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Search, Plus, Trash2, Loader2, Tag, Calendar, DollarSign, Percent, Clock, Flame } from 'lucide-react'
import Button from '../ui/Button'

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all bg-noir-800/50 border border-ivory/5 focus:border-gold/30 hover:border-ivory/10"

const timerOptions = [
  { label: '24h', minutos: 24 * 60 },
  { label: '12h', minutos: 12 * 60 },
  { label: '6h', minutos: 6 * 60 },
  { label: '4h', minutos: 4 * 60 },
  { label: '2h', minutos: 2 * 60 },
  { label: '1h', minutos: 60 },
  { label: '30min', minutos: 30 },
]

export default function BulkPromotionModal({ isOpen, onClose, onSuccess, promocao = null, isRelampago = false, defaultTag = 'PROMOÇÃO' }) {
  const initialTag = isRelampago ? 'OFERTA RELÂMPAGO' : defaultTag
  const [nome, setNome] = useState('')
  const [tag, setTag] = useState(initialTag)
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
        setTag(promocao.tag || initialTag)
        setDataInicio(formatDateTimeLocal(new Date(promocao.data_inicio)))
        setDataFim(formatDateTimeLocal(new Date(promocao.data_fim)))
        setTipoDesconto(promocao.tipo_desconto)
        setValorDesconto(String(promocao.valor_desconto))
        fetchProdutosVinculados(promocao.id)
      } else {
        // Criar: defaults
        const now = new Date()
        const defaultFim = new Date(now.getTime() + (isRelampago ? 6 : 168) * 60 * 60 * 1000)
        setNome(isRelampago ? 'Oferta Relâmpago Zahara' : '')
        setTag(initialTag)
        setDataInicio(formatDateTimeLocal(now))
        setDataFim(formatDateTimeLocal(defaultFim))
      }
    } else {
      resetForm()
    }
  }, [isOpen, promocao, isRelampago, initialTag])

  function formatDateTimeLocal(date) {
    const pad = n => String(n).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  function resetForm() {
    setNome('')
    setTag(initialTag)
    setDataInicio('')
    setDataFim('')
    setTipoDesconto('fixo')
    setValorDesconto('')
    setProdutosSelecionados([])
    setBusca('')
    setError('')
  }

  function aplicarTimerRapido(minutos) {
    const base = dataInicio ? new Date(dataInicio) : new Date()
    const dataFinal = new Date(base.getTime() + minutos * 60 * 1000)
    setDataFim(formatDateTimeLocal(dataFinal))
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
      const exists = prev.some(p => p.id === produto.id)
      if (exists) {
        return prev.filter(p => p.id !== produto.id)
      } else {
        return [...prev, produto]
      }
    })
  }

  function calcularPrecoEmMassa(precoOriginal) {
    const orig = Number(precoOriginal) || 0
    const val = Number(valorDesconto) || 0
    if (tipoDesconto === 'preco_fixo') {
      return val
    } else if (tipoDesconto === 'fixo') {
      return Math.max(0, orig - val)
    } else {
      return Math.max(0, orig - (orig * val / 100))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!nome.trim()) {
      setError('Nome da promoção é obrigatório.')
      return
    }
    if (!dataInicio || !dataFim) {
      setError('Datas de início e término são obrigatórias.')
      return
    }
    if (new Date(dataFim) <= new Date(dataInicio)) {
      setError('A data de término deve ser posterior à data de início.')
      return
    }
    if (!valorDesconto || Number(valorDesconto) <= 0) {
      setError('Informe um valor de desconto ou preço fixo válido.')
      return
    }
    if (produtosSelecionados.length === 0) {
      setError('Selecione pelo menos um produto.')
      return
    }

    setLoading(true)
    try {
      if (promocao) {
        // Atualizar promoção existente
        const { error: updateErr } = await supabase
          .from('promocoes_em_massa')
          .update({
            nome: nome.trim(),
            tag: tag.trim() || (isRelampago ? 'OFERTA RELÂMPAGO' : 'SUPER PROMOÇÃO'),
            data_inicio: new Date(dataInicio).toISOString(),
            data_fim: new Date(dataFim).toISOString(),
            tipo_desconto: tipoDesconto,
            valor_desconto: Number(valorDesconto),
            preco_fixo: tipoDesconto === 'preco_fixo' ? Number(valorDesconto) : null,
            desconto_valor: tipoDesconto === 'fixo' ? Number(valorDesconto) : null,
            desconto_percentual: tipoDesconto === 'percentual' ? Number(valorDesconto) : null,
          })
          .eq('id', promocao.id)

        if (updateErr) throw updateErr

        // Limpar junções antigas
        await supabase
          .from('promocao_em_massa_produtos')
          .delete()
          .eq('promocao_em_massa_id', promocao.id)

        // Resetar produtos antigos que não estão mais na promoção
        const { data: antigos } = await supabase
          .from('produtos')
          .select('id')
          .eq('promocao_em_massa_id', promocao.id)

        if (antigos && antigos.length > 0) {
          const idsNovos = produtosSelecionados.map(p => p.id)
          const idsRemovidos = antigos.filter(a => !idsNovos.includes(a.id)).map(a => a.id)

          if (idsRemovidos.length > 0) {
            await supabase
              .from('produtos')
              .update({
                em_promocao_em_massa: false,
                preco_em_massa: null,
                promocao_em_massa_id: null,
              })
              .in('id', idsRemovidos)
          }
        }

        // Criar novas junções
        const junctionRows = produtosSelecionados.map(p => ({
          promocao_em_massa_id: promocao.id,
          produto_id: p.id,
        }))
        await supabase.from('promocao_em_massa_produtos').insert(junctionRows)

        // Atualizar produtos
        for (const p of produtosSelecionados) {
          const precoMassa = calcularPrecoEmMassa(p.preco_original)
          await supabase
            .from('produtos')
            .update({
              em_promocao_em_massa: true,
              preco_em_massa: Number(precoMassa.toFixed(2)),
              preco_promocional: Number(precoMassa.toFixed(2)),
              promocao_em_massa_id: promocao.id,
            })
            .eq('id', p.id)
        }

      } else {
        // Criar nova promoção
        const { data: newPromo, error: createErr } = await supabase
          .from('promocoes_em_massa')
          .insert({
            nome: nome.trim(),
            tag: tag.trim() || (isRelampago ? 'OFERTA RELÂMPAGO' : 'SUPER PROMOÇÃO'),
            data_inicio: new Date(dataInicio).toISOString(),
            data_fim: new Date(dataFim).toISOString(),
            tipo_desconto: tipoDesconto,
            valor_desconto: Number(valorDesconto),
            preco_fixo: tipoDesconto === 'preco_fixo' ? Number(valorDesconto) : null,
            desconto_valor: tipoDesconto === 'fixo' ? Number(valorDesconto) : null,
            desconto_percentual: tipoDesconto === 'percentual' ? Number(valorDesconto) : null,
            ativo: true,
          })
          .select()
          .single()

        if (createErr) throw createErr

        // Criar junções
        const junctionRows = produtosSelecionados.map(p => ({
          promocao_em_massa_id: newPromo.id,
          produto_id: p.id,
        }))
        await supabase.from('promocao_em_massa_produtos').insert(junctionRows)

        // Atualizar produtos
        for (const p of produtosSelecionados) {
          const precoMassa = calcularPrecoEmMassa(p.preco_original)
          await supabase
            .from('produtos')
            .update({
              em_promocao_em_massa: true,
              preco_em_massa: Number(precoMassa.toFixed(2)),
              preco_promocional: Number(precoMassa.toFixed(2)),
              promocao_em_massa_id: newPromo.id,
            })
            .eq('id', p.id)
        }
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error('Erro ao salvar promoção:', err)
      setError(err.message || 'Erro ao salvar promoção em massa.')
    }
    setLoading(false)
  }

  if (!isOpen) return null

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-noir-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-noir-900 border border-gold/20 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl shadow-noir-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gold/10">
          <div className="flex items-center gap-2">
            {isRelampago ? <Flame className="text-red-400" size={20} /> : <Tag className="text-gold" size={20} />}
            <h2 className="font-heading text-lg sm:text-xl font-bold text-ivory">
              {promocao ? 'Editar Promoção' : isRelampago ? 'Nova Oferta Relâmpago' : 'Nova Super Promoção'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ivory/40 hover:text-ivory hover:bg-noir-800 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5 sm:space-y-4 pb-6 sm:pb-8">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
              Nome da Promoção
            </label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder={isRelampago ? "Ex: Oferta Relâmpago Zahara" : "Ex: Black Friday Zahara"}
              className={inputClass}
            />
          </div>

          {/* Tag */}
          <div>
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
              Tag da Promoção
            </label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/25" />
              <input
                type="text"
                value={tag}
                onChange={e => setTag(e.target.value)}
                placeholder={isRelampago ? "OFERTA RELÂMPAGO" : "SUPER PROMOÇÃO"}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          {/* Duração Rápida do Timer */}
          <div>
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-gold" />
                Duração Rápida (Timer Contagem Regressiva)
              </span>
              <span className="text-gold/70 text-[10px] font-normal normal-case">Clique para calcular a data final</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {timerOptions.map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => aplicarTimerRapido(opt.minutos)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-noir-800/80 text-gold hover:bg-gold/20 border border-gold/20 transition-all flex items-center gap-1"
                >
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
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
              <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
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

          {/* Tipo de Desconto / Preço */}
          <div>
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
              Tipo de Desconto / Preço
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipoDesconto('fixo')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  tipoDesconto === 'fixo'
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                }`}
              >
                <DollarSign size={14} />
                <span>Desconto R$</span>
              </button>
              <button
                type="button"
                onClick={() => setTipoDesconto('percentual')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  tipoDesconto === 'percentual'
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                }`}
              >
                <Percent size={14} />
                <span>Percentual %</span>
              </button>
              <button
                type="button"
                onClick={() => setTipoDesconto('preco_fixo')}
                className={`flex items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  tipoDesconto === 'preco_fixo'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                }`}
              >
                <Tag size={14} />
                <span>Preço Fixo R$</span>
              </button>
            </div>
          </div>

          {/* Valor do Desconto / Preço Fixo */}
          <div>
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
              {tipoDesconto === 'preco_fixo' ? 'Preço Fixo Final do Produto (R$)' : tipoDesconto === 'fixo' ? 'Valor do Desconto (R$)' : 'Porcentagem de Desconto (%)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/25 text-sm font-medium">
                {tipoDesconto === 'percentual' ? '%' : 'R$'}
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valorDesconto}
                onChange={e => setValorDesconto(e.target.value)}
                placeholder={tipoDesconto === 'preco_fixo' ? '99.90' : tipoDesconto === 'fixo' ? '150.00' : '20'}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Seleção de produtos */}
          <div className="pb-2">
            <label className="block text-ivory/50 text-[11px] sm:text-xs font-accent uppercase tracking-wider mb-1">
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
              className="max-h-[160px] sm:max-h-[200px] overflow-y-auto rounded-lg"
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
        <div className="p-4 sm:p-5 pt-3 border-t border-gold/10 bg-noir-950/80 backdrop-blur-sm rounded-b-2xl">
          <div className="flex gap-2 sm:gap-3">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-noir-800/50 text-ivory/50 hover:text-ivory/70 text-xs sm:text-sm py-2.5 sm:py-3"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 text-xs sm:text-sm py-2.5 sm:py-3"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Tag size={16} className="flex-shrink-0" />
              )}
              <span>{promocao ? 'Salvar Alterações' : isRelampago ? 'Criar Oferta Relâmpago' : 'Criar Promoção'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
