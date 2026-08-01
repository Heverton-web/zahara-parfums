import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TrendingUp, TrendingDown, DollarSign, Percent, Search, Loader2, Check, RefreshCw, AlertCircle, Tag as TagIcon, Plus, X } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { produtosMock } from '../../data/mock'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'wine',
  'oferta relâmpago': 'danger',
  'SUPER PROMOÇÃO': 'danger',
}

const tagsSugeridas = [
  'lançamento',
  'promoção',
  'oferta relâmpago',
  'SUPER PROMOÇÃO',
]

export default function PrecosEmMassa() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busca, setBusca] = useState('')
  const [selecionados, setSelecionados] = useState([])
  
  // Parâmetros de Preço
  const [modificarPreco, setModificarPreco] = useState(true)
  const [operacao, setOperacao] = useState('aumentar') // 'aumentar' | 'diminuir'
  const [campoAfetado, setCampoAfetado] = useState('ambos') // 'original' | 'promocional' | 'ambos'
  const [tipoReajuste, setTipoReajuste] = useState('percentual') // 'fixo' | 'percentual'
  const [valorReajuste, setValorReajuste] = useState('')

  // Parâmetros de Tags
  const [acaoTag, setAcaoTag] = useState('nenhuma') // 'nenhuma' | 'adicionar' | 'remover' | 'substituir'
  const [tagsSelecionadas, setTagsSelecionadas] = useState([])
  const [novaTagInput, setNovaTagInput] = useState('')

  const [mensagemSucesso, setMensagemSucesso] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetchProdutos()
  }, [])

  async function fetchProdutos() {
    setLoading(true)
    setErro('')
    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      if (!isSupabaseConfigured) {
        setProdutos(produtosMock)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('produtos')
        .select('*, marcas(nome)')
        .order('nome')

      if (error) throw error
      setProdutos(data || [])
    } catch (err) {
      console.warn('Erro ao buscar produtos no Supabase, usando dados mock:', err)
      setProdutos(produtosMock)
    }
    setLoading(false)
  }

  // Filtrar produtos na lista
  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (p.marcas?.nome && p.marcas.nome.toLowerCase().includes(busca.toLowerCase())) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(busca.toLowerCase())))
  )

  // Toggle de seleção individual
  function toggleSelecionar(id) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Toggle selecionar todos os visíveis
  function toggleSelecionarTodos() {
    const todosIdsVisiveis = produtosFiltrados.map(p => p.id)
    const todosJaSelecionados = todosIdsVisiveis.every(id => selecionados.includes(id))

    if (todosJaSelecionados) {
      setSelecionados(prev => prev.filter(id => !todosIdsVisiveis.includes(id)))
    } else {
      setSelecionados(prev => Array.from(new Set([...prev, ...todosIdsVisiveis])))
    }
  }

  // Alternar tag na seleção do formulário
  function toggleTagForm(tag) {
    setTagsSelecionadas(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // Adicionar tag personalizada
  function handleAddCustomTag(e) {
    e.preventDefault()
    const tagFormatada = novaTagInput.trim()
    if (tagFormatada && !tagsSelecionadas.includes(tagFormatada)) {
      setTagsSelecionadas(prev => [...prev, tagFormatada])
      setNovaTagInput('')
    }
  }

  // Função utilitária para calcular novos preços e novas tags
  function calcularNovosDados(produto) {
    const val = Number(String(valorReajuste).replace(',', '.'))
    const precoOrig = Number(produto.preco_original) || 0
    const precoPromo = Number(produto.preco_promocional) || null
    const tagsAtuais = produto.tags || []

    let novoOriginal = precoOrig
    let novoPromocional = precoPromo
    let novasTags = [...tagsAtuais]

    // 1. Calcular novos preços (se ativo)
    if (modificarPreco && !isNaN(val) && val > 0 && selecionados.includes(produto.id)) {
      const fator = operacao === 'aumentar' ? 1 : -1

      if (campoAfetado === 'original' || campoAfetado === 'ambos') {
        if (tipoReajuste === 'fixo') {
          novoOriginal = Math.max(0, precoOrig + (val * fator))
        } else {
          novoOriginal = Math.max(0, precoOrig * (1 + (val / 100 * fator)))
        }
      }

      if ((campoAfetado === 'promocional' || campoAfetado === 'ambos') && precoPromo !== null) {
        if (tipoReajuste === 'fixo') {
          novoPromocional = Math.max(0, precoPromo + (val * fator))
        } else {
          novoPromocional = Math.max(0, precoPromo * (1 + (val / 100 * fator)))
        }
      }
    }

    // 2. Calcular novas tags (se selecionado)
    if (acaoTag !== 'nenhuma' && selecionados.includes(produto.id) && tagsSelecionadas.length > 0) {
      if (acaoTag === 'adicionar') {
        novasTags = Array.from(new Set([...tagsAtuais, ...tagsSelecionadas]))
      } else if (acaoTag === 'remover') {
        novasTags = tagsAtuais.filter(t => !tagsSelecionadas.includes(t))
      } else if (acaoTag === 'substituir') {
        novasTags = [...tagsSelecionadas]
      }
    }

    return { novoOriginal, novoPromocional, novasTags }
  }

  // Submeter a alteração em massa
  async function handleSalvarAlteracoes(e) {
    e.preventDefault()
    setMensagemSucesso('')
    setErro('')

    if (selecionados.length === 0) {
      setErro('Selecione pelo menos 1 produto para alterar.')
      return
    }

    const val = Number(String(valorReajuste).replace(',', '.'))
    const alterandoPrecoValido = modificarPreco && !isNaN(val) && val > 0
    const alterandoTagValida = acaoTag !== 'nenhuma' && tagsSelecionadas.length > 0

    if (!alterandoPrecoValido && !alterandoTagValida) {
      setErro('Preencha os valores de reajuste de preço ou selecione uma ação de tags válida.')
      return
    }

    setSaving(true)

    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      const atualizacoes = produtos
        .filter(p => selecionados.includes(p.id))
        .map(produto => {
          const { novoOriginal, novoPromocional, novasTags } = calcularNovosDados(produto)
          const payload = { id: produto.id }
          
          if (alterandoPrecoValido) {
            payload.preco_original = Number(novoOriginal.toFixed(2))
            payload.preco_promocional = novoPromocional !== null ? Number(novoPromocional.toFixed(2)) : null
          }

          if (alterandoTagValida) {
            payload.tags = novasTags
          }

          return payload
        })

      if (isSupabaseConfigured) {
        for (const item of atualizacoes) {
          const updateData = {}
          if (item.preco_original !== undefined) updateData.preco_original = item.preco_original
          if (item.preco_promocional !== undefined) updateData.preco_promocional = item.preco_promocional
          if (item.tags !== undefined) updateData.tags = item.tags

          const { error } = await supabase
            .from('produtos')
            .update(updateData)
            .eq('id', item.id)

          if (error) throw error
        }
      } else {
        // Atualizar estado local se mock
        setProdutos(prev =>
          prev.map(p => {
            const mod = atualizacoes.find(u => u.id === p.id)
            if (!mod) return p
            return {
              ...p,
              ...(mod.preco_original !== undefined && { preco_original: mod.preco_original }),
              ...(mod.preco_promocional !== undefined && { preco_promocional: mod.preco_promocional }),
              ...(mod.tags !== undefined && { tags: mod.tags }),
            }
          })
        )
      }

      setMensagemSucesso(`Preços e/ou Tags de ${atualizacoes.length} produto(s) atualizados com sucesso!`)
      setValorReajuste('')
      await fetchProdutos()
    } catch (err) {
      console.error('Erro ao atualizar produtos em massa:', err)
      setErro(err.message || 'Erro ao persistir alterações no banco de dados.')
    }

    setSaving(false)
  }

  const todosVisiveisSelecionados = produtosFiltrados.length > 0 && produtosFiltrados.every(p => selecionados.includes(p.id))

  return (
    <div className="pt-2 sm:pt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Alteração de Preços e Tags em Massa
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Badge variant="gold" className="px-3 py-1.5 text-xs font-semibold">
          {selecionados.length} produto(s) selecionado(s)
        </Badge>
      </div>

      {/* Alertas */}
      {mensagemSucesso && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Check size={18} />
            <span>{mensagemSucesso}</span>
          </div>
          <button onClick={() => setMensagemSucesso('')} className="text-emerald-400/60 hover:text-emerald-400">✕</button>
        </div>
      )}

      {erro && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{erro}</span>
          </div>
          <button onClick={() => setErro('')} className="text-red-400/60 hover:text-red-400">✕</button>
        </div>
      )}

      {/* Painel de Controles */}
      <form onSubmit={handleSalvarAlteracoes} className="bg-noir-900 rounded-2xl p-4 sm:p-6 mb-8 border border-gold/15 shadow-xl space-y-6">
        
        {/* Seção 1: Modificação de Preços */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-ivory flex items-center gap-2">
              <TrendingUp className="text-gold" size={18} />
              Reajuste de Preços
            </h2>
            <label className="inline-flex items-center cursor-pointer text-xs text-ivory/60 gap-2">
              <input
                type="checkbox"
                checked={modificarPreco}
                onChange={e => setModificarPreco(e.target.checked)}
                className="rounded border-gold/30 text-gold focus:ring-gold bg-noir-800"
              />
              <span>Ativar alteração de preço</span>
            </label>
          </div>

          {modificarPreco && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-noir-950/50 border border-gold/10">
              {/* 1. Operação */}
              <div>
                <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
                  Operação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperacao('aumentar')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      operacao === 'aumentar'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                    }`}
                  >
                    <TrendingUp size={14} />
                    Aumentar
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperacao('diminuir')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      operacao === 'diminuir'
                        ? 'bg-wine/20 text-wine-light border border-wine/40'
                        : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                    }`}
                  >
                    <TrendingDown size={14} />
                    Diminuir
                  </button>
                </div>
              </div>

              {/* 2. Campo Afetado */}
              <div>
                <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
                  Preço a Modificar
                </label>
                <select
                  value={campoAfetado}
                  onChange={e => setCampoAfetado(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs text-ivory bg-noir-800/60 border border-ivory/10 focus:border-gold/40 focus:outline-none transition-all"
                >
                  <option value="ambos">Ambos (Original + Promoção)</option>
                  <option value="original">Apenas Preço Original</option>
                  <option value="promocional">Apenas Preço Promoção</option>
                </select>
              </div>

              {/* 3. Tipo de Reajuste */}
              <div>
                <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
                  Tipo de Variação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoReajuste('percentual')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      tipoReajuste === 'percentual'
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                    }`}
                  >
                    <Percent size={14} />
                    Percentual (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoReajuste('fixo')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      tipoReajuste === 'fixo'
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                    }`}
                  >
                    <DollarSign size={14} />
                    Valor Fixo (R$)
                  </button>
                </div>
              </div>

              {/* 4. Valor do Reajuste */}
              <div>
                <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
                  {tipoReajuste === 'fixo' ? 'Valor do Reajuste (R$)' : 'Percentual (%)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/30 text-xs font-medium">
                    {tipoReajuste === 'fixo' ? 'R$' : '%'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={tipoReajuste === 'fixo' ? '20.00' : '10'}
                    value={valorReajuste}
                    onChange={e => setValorReajuste(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-xl text-xs text-ivory bg-noir-800/60 border border-ivory/10 focus:border-gold/40 focus:outline-none transition-all placeholder:text-ivory/20"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seção 2: Gerenciamento de Tags */}
        <div className="pt-4 border-t border-ivory/5">
          <h2 className="text-base font-semibold text-ivory mb-4 flex items-center gap-2">
            <TagIcon className="text-gold" size={18} />
            Gerenciamento de Tags
          </h2>

          <div className="space-y-4 p-4 rounded-xl bg-noir-950/50 border border-gold/10">
            {/* Ação de Tag */}
            <div>
              <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
                Ação com Tags nos Produtos Selecionados
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'nenhuma', label: 'Manter Atuais' },
                  { id: 'adicionar', label: 'Ativar / Adicionar' },
                  { id: 'remover', label: 'Inativar / Remover' },
                  { id: 'substituir', label: 'Substituir Todas' },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAcaoTag(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      acaoTag === item.id
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seleção de Tags */}
            {acaoTag !== 'nenhuma' && (
              <div className="space-y-3 pt-2">
                <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-1">
                  Selecione as Tags para aplicar ({tagsSelecionadas.length} selecionadas)
                </label>

                {/* Sugestões de Tags */}
                <div className="flex flex-wrap gap-2">
                  {tagsSugeridas.map(tag => {
                    const ativa = tagsSelecionadas.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTagForm(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          ativa
                            ? 'bg-gold text-noir-950 shadow-md shadow-gold/20 scale-105'
                            : 'bg-noir-800 text-ivory/60 hover:text-ivory border border-ivory/10'
                        }`}
                      >
                        {ativa && <Check size={12} />}
                        <span>{tag}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Tag Personalizada */}
                <div className="flex gap-2 max-w-md pt-1">
                  <input
                    type="text"
                    placeholder="Adicionar outra tag customizada..."
                    value={novaTagInput}
                    onChange={e => setNovaTagInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs text-ivory bg-noir-800/60 border border-ivory/10 focus:border-gold/40 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-all flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Adicionar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão de Ação Submit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ivory/5">
          <p className="text-ivory/40 text-xs italic text-center sm:text-left">
            * As alterações selecionadas acima serão gravadas diretamente nos produtos marcados.
          </p>

          <Button
            type="submit"
            disabled={saving || selecionados.length === 0}
            className="w-full sm:w-auto text-sm px-8 py-3"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            <span>Aplicar no Banco de Dados ({selecionados.length})</span>
          </Button>
        </div>
      </form>

      {/* Barra de Filtro e Seleção Rápida */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            placeholder="Buscar produto por nome, marca ou tag..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm text-ivory bg-noir-900 border border-gold/15 focus:border-gold/40 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={toggleSelecionarTodos}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-noir-800 text-gold border border-gold/20 hover:bg-gold/10 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          {todosVisiveisSelecionados ? 'Desmarcar Visíveis' : 'Selecionar Todos os Visíveis'}
        </button>
      </div>

      {/* Tabela de Produtos (Desktop) */}
      <div className="hidden md:block bg-noir-900 rounded-2xl overflow-hidden border border-gold/15 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gold/15 bg-noir-950/60 text-ivory/40 text-[10px] sm:text-xs uppercase tracking-wider font-accent">
                <th className="p-3 sm:p-4 text-center w-10">
                  <input
                    type="checkbox"
                    checked={todosVisiveisSelecionados}
                    onChange={toggleSelecionarTodos}
                    className="rounded border-gold/30 text-gold focus:ring-gold bg-noir-800 cursor-pointer"
                  />
                </th>
                <th className="p-3 sm:p-4">Produto</th>
                <th className="p-3 sm:p-4">Tags Atuais</th>
                <th className="p-3 sm:p-4">Preço Original</th>
                <th className="p-3 sm:p-4">Preço Promoção</th>
                <th className="p-3 sm:p-4 text-right">Novo Valor (Preview)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <Loader2 size={24} className="animate-spin text-gold/50 mx-auto mb-2" />
                    <p className="text-ivory/40 italic">Carregando produtos...</p>
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-ivory/30 italic">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map(produto => {
                  const estaSelecionado = selecionados.includes(produto.id)
                  const { novoOriginal, novoPromocional, novasTags } = calcularNovosDados(produto)
                  const precoOrig = Number(produto.preco_original) || 0
                  const precoPromo = Number(produto.preco_promocional) || null

                  const houveAlteracaoOrig = novoOriginal !== precoOrig
                  const houveAlteracaoPromo = precoPromo !== null && novoPromocional !== precoPromo

                  return (
                    <tr
                      key={produto.id}
                      onClick={() => toggleSelecionar(produto.id)}
                      className={`cursor-pointer transition-colors ${
                        estaSelecionado ? 'bg-gold/10 hover:bg-gold/15' : 'hover:bg-noir-800/40'
                      }`}
                    >
                      <td className="p-3 sm:p-4 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={estaSelecionado}
                          onChange={() => toggleSelecionar(produto.id)}
                          className="rounded border-gold/30 text-gold focus:ring-gold bg-noir-800 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 sm:p-4">
                        <div className="font-semibold text-ivory">{produto.nome}</div>
                        {produto.marcas?.nome && (
                          <div className="text-[10px] text-gold/60 uppercase tracking-widest font-accent mt-0.5">
                            {produto.marcas.nome}
                          </div>
                        )}
                      </td>

                      {/* Tags */}
                      <td className="p-3 sm:p-4">
                        <div className="flex flex-wrap gap-1">
                          {estaSelecionado && acaoTag !== 'nenhuma' ? (
                            novasTags.map(t => (
                              <Badge key={t} variant={tagColors[t] || 'gold'} className="text-[9px] px-2 py-0.5 whitespace-nowrap">
                                {t}
                              </Badge>
                            ))
                          ) : (
                            (produto.tags || []).length > 0 ? (
                              produto.tags.map(t => (
                                <Badge key={t} variant={tagColors[t] || 'default'} className="text-[9px] px-2 py-0.5 whitespace-nowrap">
                                  {t}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-ivory/25 text-xs italic">Sem tags</span>
                            )
                          )}
                        </div>
                      </td>

                      <td className="p-3 sm:p-4 text-ivory/70 whitespace-nowrap">
                        R$ {precoOrig.toFixed(2)}
                      </td>

                      <td className="p-3 sm:p-4 text-ivory/70 whitespace-nowrap">
                        {precoPromo !== null ? `R$ ${precoPromo.toFixed(2)}` : '-'}
                      </td>

                      <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                        {estaSelecionado && (modificarPreco && valorReajuste) ? (
                          <div className="flex flex-col items-end gap-1">
                            {houveAlteracaoOrig && (
                              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                                <span className="text-ivory/40 text-xs font-normal">Orig:</span>
                                <span>R$ {novoOriginal.toFixed(2)}</span>
                              </div>
                            )}
                            {houveAlteracaoPromo && (
                              <div className="flex items-center gap-1.5 text-gold font-bold">
                                <span className="text-ivory/40 text-xs font-normal font-sans">Promo:</span>
                                <span>R$ {novoPromocional.toFixed(2)}</span>
                              </div>
                            )}
                            {!houveAlteracaoOrig && !houveAlteracaoPromo && (
                              <span className="text-ivory/40 italic">Sem alteração</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-ivory/30 italic">
                            {estaSelecionado ? 'Simulando tags' : 'Marque para simular'}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lista de Produtos (Mobile Cards) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-8 text-center bg-noir-900 rounded-2xl border border-gold/15">
            <Loader2 size={24} className="animate-spin text-gold/50 mx-auto mb-2" />
            <p className="text-ivory/40 italic">Carregando produtos...</p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="p-8 text-center bg-noir-900 rounded-2xl border border-gold/15 text-ivory/30 italic">
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map(produto => {
            const estaSelecionado = selecionados.includes(produto.id)
            const { novoOriginal, novoPromocional, novasTags } = calcularNovosDados(produto)
            const precoOrig = Number(produto.preco_original) || 0
            const precoPromo = Number(produto.preco_promocional) || null

            const houveAlteracaoOrig = novoOriginal !== precoOrig
            const houveAlteracaoPromo = precoPromo !== null && novoPromocional !== precoPromo

            return (
              <div
                key={produto.id}
                onClick={() => toggleSelecionar(produto.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  estaSelecionado
                    ? 'bg-gold/10 border-gold/40 shadow-lg'
                    : 'bg-noir-900 border-gold/15 hover:border-gold/30'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={estaSelecionado}
                    onChange={() => toggleSelecionar(produto.id)}
                    onClick={e => e.stopPropagation()}
                    className="mt-1 rounded border-gold/30 text-gold focus:ring-gold bg-noir-800 cursor-pointer w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm leading-snug ${estaSelecionado ? 'text-gold' : 'text-ivory'}`}>
                      {produto.nome}
                    </h3>
                    {produto.marcas?.nome && (
                      <p className="text-[10px] text-gold/60 uppercase tracking-widest font-accent mt-0.5">
                        {produto.marcas.nome}
                      </p>
                    )}
                  </div>
                </div>

                {/* Exibição de Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {estaSelecionado && acaoTag !== 'nenhuma' ? (
                    novasTags.map(t => (
                      <Badge key={t} variant={tagColors[t] || 'gold'} className="text-[9px] px-2 py-0.5 whitespace-nowrap">
                        {t}
                      </Badge>
                    ))
                  ) : (
                    (produto.tags || []).length > 0 ? (
                      produto.tags.map(t => (
                        <Badge key={t} variant={tagColors[t] || 'default'} className="text-[9px] px-2 py-0.5 whitespace-nowrap">
                          {t}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-ivory/25 text-[11px] italic">Sem tags</span>
                    )
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-ivory/5">
                  <div>
                    <span className="text-ivory/40 block text-[10px] uppercase font-accent">Preço Atual</span>
                    <span className="text-ivory/80 font-medium block">R$ {precoOrig.toFixed(2)}</span>
                    {precoPromo !== null && (
                      <span className="text-gold/70 block text-[11px]">Promo: R$ {precoPromo.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-ivory/40 block text-[10px] uppercase font-accent">Novo Valor (Preview)</span>
                    {estaSelecionado && (modificarPreco && valorReajuste) ? (
                      <div className="space-y-0.5">
                        {houveAlteracaoOrig && (
                          <span className="text-emerald-400 font-bold block">
                            R$ {novoOriginal.toFixed(2)}
                          </span>
                        )}
                        {houveAlteracaoPromo && (
                          <span className="text-gold font-bold block text-[11px]">
                            Promo: R$ {novoPromocional.toFixed(2)}
                          </span>
                        )}
                        {!houveAlteracaoOrig && !houveAlteracaoPromo && (
                          <span className="text-ivory/30 italic text-[11px]">Sem alteração</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-ivory/30 italic text-[11px]">
                        {estaSelecionado ? 'Simulando tags' : 'Marque para simular'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
