import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Tag as TagIcon, Search, Loader2, Check, RefreshCw, AlertCircle, Plus, X, Filter } from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { produtosMock } from '../../data/mock'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'wine',
  'oferta relâmpago': 'danger',
  'SUPER PROMOÇÃO': 'danger',
}

const tagsSugeridasPadrao = [
  'lançamento',
  'promoção',
  'oferta relâmpago',
  'SUPER PROMOÇÃO',
]

export default function GerenciarTags() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busca, setBusca] = useState('')
  const [tagFiltro, setTagFiltro] = useState(null) // Tag ativa para filtragem
  const [selecionados, setSelecionados] = useState([])

  // Formulário em massa
  const [acaoMassa, setAcaoMassa] = useState('adicionar') // 'adicionar' | 'remover' | 'substituir'
  const [tagsParaAplicar, setTagsParaAplicar] = useState([])
  const [novaTagFormInput, setNovaTagFormInput] = useState('')

  // Tag rápida em produto único
  const [produtoEditandoId, setProdutoEditandoId] = useState(null)
  const [novaTagUnicaInput, setNovaTagUnicaInput] = useState('')

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

  // Contagem de produtos por tag
  const contagemPorTag = {}
  tagsSugeridasPadrao.forEach(t => { contagemPorTag[t] = 0 })
  produtos.forEach(p => {
    (p.tags || []).forEach(t => {
      contagemPorTag[t] = (contagemPorTag[t] || 0) + 1
    })
  })

  const todasAsTagsExistentes = Array.from(
    new Set([...tagsSugeridasPadrao, ...Object.keys(contagemPorTag)])
  )

  // Filtragem dos produtos
  const produtosFiltrados = produtos.filter(p => {
    const combinaBusca =
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.marcas?.nome && p.marcas.nome.toLowerCase().includes(busca.toLowerCase())) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(busca.toLowerCase())))

    const combinaTag = tagFiltro ? (p.tags || []).includes(tagFiltro) : true

    return combinaBusca && combinaTag
  })

  // Checkbox de seleção
  function toggleSelecionar(id) {
    setSelecionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  function toggleSelecionarTodos() {
    const todosVisiveisIds = produtosFiltrados.map(p => p.id)
    const todosJaSelecionados = todosVisiveisIds.every(id => selecionados.includes(id))

    if (todosJaSelecionados) {
      setSelecionados(prev => prev.filter(id => !todosVisiveisIds.includes(id)))
    } else {
      setSelecionados(prev => Array.from(new Set([...prev, ...todosVisiveisIds])))
    }
  }

  // Toggle de tags no form em massa
  function toggleTagNoForm(tag) {
    setTagsParaAplicar(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function handleAddTagCustomForm(e) {
    e.preventDefault()
    const val = novaTagFormInput.trim()
    if (val && !tagsParaAplicar.includes(val)) {
      setTagsParaAplicar(prev => [...prev, val])
      setNovaTagFormInput('')
    }
  }

  // Persistir ação de tags em massa
  async function handleSalvarEmMassa(e) {
    e.preventDefault()
    setMensagemSucesso('')
    setErro('')

    if (selecionados.length === 0) {
      setErro('Selecione pelo menos 1 produto para alterar as tags.')
      return
    }

    if (tagsParaAplicar.length === 0 && acaoMassa !== 'substituir') {
      setErro('Selecione pelo menos uma tag para aplicar.')
      return
    }

    setSaving(true)

    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      const atualizacoes = produtos
        .filter(p => selecionados.includes(p.id))
        .map(produto => {
          const tagsAtuais = produto.tags || []
          let novasTags = [...tagsAtuais]

          if (acaoMassa === 'adicionar') {
            novasTags = Array.from(new Set([...tagsAtuais, ...tagsParaAplicar]))
          } else if (acaoMassa === 'remover') {
            novasTags = tagsAtuais.filter(t => !tagsParaAplicar.includes(t))
          } else if (acaoMassa === 'substituir') {
            novasTags = [...tagsParaAplicar]
          }

          return { id: produto.id, tags: novasTags }
        })

      if (isSupabaseConfigured) {
        for (const item of atualizacoes) {
          const { error } = await supabase
            .from('produtos')
            .update({ tags: item.tags })
            .eq('id', item.id)

          if (error) throw error
        }
      } else {
        setProdutos(prev =>
          prev.map(p => {
            const mod = atualizacoes.find(u => u.id === p.id)
            return mod ? { ...p, tags: mod.tags } : p
          })
        )
      }

      setMensagemSucesso(`Tags de ${atualizacoes.length} produto(s) atualizadas com sucesso!`)
      setTagsParaAplicar([])
      await fetchProdutos()
    } catch (err) {
      console.error('Erro ao atualizar tags em massa:', err)
      setErro(err.message || 'Erro ao salvar tags no banco de dados.')
    }

    setSaving(false)
  }

  // Alterar tag em produto único (Remover tag individual)
  async function handleRemoverTagUnica(produto, tagParaRemover) {
    setMensagemSucesso('')
    setErro('')
    try {
      const novasTags = (produto.tags || []).filter(t => t !== tagParaRemover)
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('produtos')
          .update({ tags: novasTags })
          .eq('id', produto.id)
        if (error) throw error
      }

      setProdutos(prev =>
        prev.map(p => (p.id === produto.id ? { ...p, tags: novasTags } : p))
      )
      setMensagemSucesso(`Tag "${tagParaRemover}" removida de ${produto.nome}`)
    } catch (err) {
      console.error('Erro ao remover tag:', err)
      setErro('Erro ao remover tag do produto.')
    }
  }

  // Alterar tag em produto único (Adicionar tag individual)
  async function handleAdicionarTagUnica(produto) {
    const val = novaTagUnicaInput.trim()
    if (!val) return

    setMensagemSucesso('')
    setErro('')

    try {
      const novasTags = Array.from(new Set([...(produto.tags || []), val]))
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('produtos')
          .update({ tags: novasTags })
          .eq('id', produto.id)
        if (error) throw error
      }

      setProdutos(prev =>
        prev.map(p => (p.id === produto.id ? { ...p, tags: novasTags } : p))
      )
      setMensagemSucesso(`Tag "${val}" adicionada a ${produto.nome}`)
      setProdutoEditandoId(null)
      setNovaTagUnicaInput('')
    } catch (err) {
      console.error('Erro ao adicionar tag:', err)
      setErro('Erro ao adicionar tag no produto.')
    }
  }

  const todosVisiveisSelecionados = produtosFiltrados.length > 0 && produtosFiltrados.every(p => selecionados.includes(p.id))

  return (
    <div className="pt-2 sm:pt-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Gerenciamento de Tags de Produtos
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Badge variant="gold" className="px-3 py-1.5 text-xs font-semibold">
          {selecionados.length} selecionado(s)
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

      {/* Painel de Métricas e Filtros Por Tag */}
      <div className="bg-noir-900 rounded-2xl p-4 sm:p-6 mb-8 border border-gold/15 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-ivory flex items-center gap-2">
            <Filter className="text-gold" size={18} />
            Métricas e Filtros Por Tag
          </h2>
          {tagFiltro && (
            <button
              onClick={() => setTagFiltro(null)}
              className="text-xs text-gold hover:underline flex items-center gap-1"
            >
              <X size={12} />
              Limpar Filtro ({tagFiltro})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setTagFiltro(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              tagFiltro === null
                ? 'bg-gold text-noir-950 shadow-md shadow-gold/20'
                : 'bg-noir-800 text-ivory/60 hover:text-ivory border border-ivory/10'
            }`}
          >
            <span>Todos os Produtos</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tagFiltro === null ? 'bg-noir-950 text-gold' : 'bg-noir-900 text-ivory/40'}`}>
              {produtos.length}
            </span>
          </button>

          {todasAsTagsExistentes.map(tag => {
            const count = contagemPorTag[tag] || 0
            const ativo = tagFiltro === tag
            return (
              <button
                key={tag}
                onClick={() => setTagFiltro(ativo ? null : tag)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  ativo
                    ? 'bg-gold text-noir-950 shadow-md shadow-gold/20'
                    : 'bg-noir-800/80 text-ivory/70 hover:text-ivory border border-ivory/10'
                }`}
              >
                <span>{tag}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${ativo ? 'bg-noir-950 text-gold' : 'bg-noir-900/80 text-gold/70'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Painel de Ações em Massa de Tags */}
      <form onSubmit={handleSalvarEmMassa} className="bg-noir-900 rounded-2xl p-4 sm:p-6 mb-8 border border-gold/15 shadow-xl">
        <h2 className="text-base font-semibold text-ivory mb-4 flex items-center gap-2">
          <TagIcon className="text-gold" size={18} />
          Modificar Tags dos Produtos Selecionados ({selecionados.length})
        </h2>

        <div className="space-y-4">
          {/* Ação */}
          <div>
            <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
              Escolha a Ação
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'adicionar', label: 'Ativar / Adicionar Tags' },
                { id: 'remover', label: 'Inativar / Remover Tags' },
                { id: 'substituir', label: 'Substituir Todas as Tags' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAcaoMassa(item.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                    acaoMassa === item.id
                      ? 'bg-gold/15 text-gold border border-gold/30'
                      : 'bg-noir-800/60 text-ivory/40 border border-ivory/5 hover:border-ivory/15'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Seletor de Tags */}
          <div>
            <label className="block text-ivory/50 text-[11px] font-accent uppercase tracking-wider mb-2">
              Tags a Aplicar
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tagsSugeridasPadrao.map(tag => {
                const ativa = tagsParaAplicar.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTagNoForm(tag)}
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

            {/* Input Tag Customizada */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Digitar tag personalizada..."
                value={novaTagFormInput}
                onChange={e => setNovaTagFormInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl text-xs text-ivory bg-noir-800/60 border border-ivory/10 focus:border-gold/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTagCustomForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 transition-all flex items-center gap-1"
              >
                <Plus size={14} />
                Adicionar Tag
              </button>
            </div>
          </div>

          {/* Botão de Salvar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-ivory/5">
            <p className="text-ivory/40 text-xs italic text-center sm:text-left">
              * A alteração de tags será persistida imediatamente no banco de dados para os produtos marcados.
            </p>

            <Button
              type="submit"
              disabled={saving || selecionados.length === 0 || (tagsParaAplicar.length === 0 && acaoMassa !== 'substituir')}
              className="w-full sm:w-auto text-sm px-8 py-3"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              <span>Aplicar Tags em ({selecionados.length})</span>
            </Button>
          </div>
        </div>
      </form>

      {/* Barra de Filtro de Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            placeholder="Buscar por nome, marca ou tag..."
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

      {/* Tabela Desktop */}
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
                <th className="p-3 sm:p-4">Tags Ativas (Clique X para remover)</th>
                <th className="p-3 sm:p-4 text-right">Ação Rápida (Produto Único)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    <Loader2 size={24} className="animate-spin text-gold/50 mx-auto mb-2" />
                    <p className="text-ivory/40 italic">Carregando produtos...</p>
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-ivory/30 italic">
                    Nenhum produto encontrado com este filtro.
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map(produto => {
                  const estaSelecionado = selecionados.includes(produto.id)
                  const editandoEstaLinha = produtoEditandoId === produto.id

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

                      {/* Lista de Tags com X para remover */}
                      <td className="p-3 sm:p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {(produto.tags || []).length > 0 ? (
                            produto.tags.map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30"
                              >
                                <span>{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoverTagUnica(produto, tag)}
                                  className="text-gold/60 hover:text-red-400 transition-colors"
                                  title={`Remover tag ${tag}`}
                                >
                                  <X size={12} />
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-ivory/25 text-xs italic">Sem tags ativas</span>
                          )}
                        </div>
                      </td>

                      {/* Adicionar Tag Rápida */}
                      <td className="p-3 sm:p-4 text-right" onClick={e => e.stopPropagation()}>
                        {editandoEstaLinha ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="text"
                              placeholder="Nome da tag..."
                              value={novaTagUnicaInput}
                              onChange={e => setNovaTagUnicaInput(e.target.value)}
                              className="px-2.5 py-1 rounded-lg text-xs text-ivory bg-noir-800 border border-gold/30 focus:outline-none"
                              autoFocus
                              onKeyDown={e => { if (e.key === 'Enter') handleAdicionarTagUnica(produto) }}
                            />
                            <button
                              onClick={() => handleAdicionarTagUnica(produto)}
                              className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setProdutoEditandoId(null)}
                              className="p-1 bg-noir-800 text-ivory/40 rounded-lg hover:text-ivory"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setProdutoEditandoId(produto.id); setNovaTagUnicaInput('') }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-noir-800 text-gold hover:bg-gold/15 border border-gold/20 transition-all inline-flex items-center gap-1"
                          >
                            <Plus size={12} />
                            Adicionar Tag
                          </button>
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

      {/* Cards Mobile */}
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
            const editandoEstaLinha = produtoEditandoId === produto.id

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

                {/* Badges de Tags */}
                <div className="mb-3 pt-2 border-t border-ivory/5" onClick={e => e.stopPropagation()}>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {(produto.tags || []).length > 0 ? (
                      produto.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoverTagUnica(produto, tag)}
                            className="text-gold/60 hover:text-red-400"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-ivory/25 text-[11px] italic">Sem tags ativas</span>
                    )}
                  </div>
                </div>

                {/* Adicionar Tag Rápida Mobile */}
                <div className="pt-2 border-t border-ivory/5 flex justify-end" onClick={e => e.stopPropagation()}>
                  {editandoEstaLinha ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="text"
                        placeholder="Nome da tag..."
                        value={novaTagUnicaInput}
                        onChange={e => setNovaTagUnicaInput(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg text-xs text-ivory bg-noir-800 border border-gold/30 focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleAdicionarTagUnica(produto)}
                        className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setProdutoEditandoId(null)}
                        className="p-1.5 bg-noir-800 text-ivory/40 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setProdutoEditandoId(produto.id); setNovaTagUnicaInput('') }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-noir-800 text-gold border border-gold/20 flex items-center gap-1"
                    >
                      <Plus size={12} />
                      Adicionar Tag
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
