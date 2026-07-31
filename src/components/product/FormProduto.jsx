import { useState, useEffect } from 'react'
import { X, Check, Image as ImageIcon, Link2, Loader2, Sparkles, Search } from 'lucide-react'
import { createProduto, updateProduto } from '../../hooks/useProdutos'
import { searchAndScrape, scrapeFragrantica, isFragranticaUrl, matchMarca, openFragranticaSearch } from '../../lib/fragrantica'

const generos = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'unissex', label: 'Unissex' },
]

const tagsDisponiveis = [
  { value: 'lançamento', label: 'Lançamento' },
  { value: 'promoção', label: 'Promoção' },
  { value: 'oferta relâmpago', label: 'Oferta Relâmpago' },
]

function InputField({ label, children }) {
  return (
    <div>
      <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all bg-noir-800/50 border border-ivory/5 focus:border-gold/30 hover:border-ivory/10"

// Spinner animado brilhante
function ShimmerSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-14 h-14 mb-3">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
        <div 
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold"
          style={{ animation: 'spin 1s linear infinite' }}
        />
        <div 
          className="absolute inset-2 rounded-full border-2 border-transparent border-b-gold-light/50"
          style={{ animation: 'spin 1.5s linear infinite reverse' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-3 h-3 rounded-full bg-gold/40"
            style={{ 
              animation: 'pulse-glow 1.5s ease-in-out infinite',
              boxShadow: '0 0 15px rgba(201, 168, 76, 0.5)'
            }}
          />
        </div>
      </div>
      <p className="text-ivory/60 text-sm font-medium">Extraindo dados do perfume...</p>
      <p className="text-ivory/30 text-xs mt-1">Preenchendo formulário automaticamente</p>
      
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  )
}

export default function FormProduto({ produto, marcas = [], onSuccess, onCancel }) {
  const [form, setForm] = useState({
    nome: '',
    marca_id: '',
    genero: 'masculino',
    preco: '',
    descricao: '',
    tags: [],
    imagem_url: '',
  })
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fragrantica state
  const [fragQuery, setFragQuery] = useState('')
  const [fragUrl, setFragUrl] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [scraping, setScraping] = useState(false)
  const [scrapeMsg, setScrapeMsg] = useState('')

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome || '',
        marca_id: produto.marca_id || '',
        genero: produto.genero || 'masculino',
        preco: produto.preco?.toString() || '',
        descricao: produto.descricao || '',
        tags: produto.tags || [],
        imagem_url: produto.imagem_url || '',
      })
      if (produto.imagem_url) setPreview(produto.imagem_url)
    }
  }, [produto])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleTagToggle(tag) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  function handleImageUrl(e) {
    const url = e.target.value
    setForm(prev => ({ ...prev, imagem_url: url }))
    if (url) setPreview(url)
  }

  // Buscar perfume por nome
  async function handleSearch() {
    if (!fragQuery.trim() || fragQuery.trim().length < 2) return

    setScraping(true)
    setSearchResults([])
    setScrapeMsg('')
    setError('')

    try {
      const results = await searchAndScrape(fragQuery)
      if (results && results.length > 0) {
        if (results[0]?.notFound) {
          setError('Não encontrado. Tente outro nome ou abra o Fragrantica manualmente.')
        } else {
          setSearchResults(results)
        }
      } else {
        setError('Nenhum resultado encontrado.')
      }
    } catch (err) {
      // Edge Function não deployada ou erro de rede
      if (err?.message?.includes('FunctionsHttpError') || err?.message?.includes('404') || err?.message?.includes('Failed')) {
        setError('Busca automática indisponível. Use o link abaixo para buscar manualmente no Fragrantica.')
      } else {
        setError('Erro ao buscar. Tente novamente.')
      }
    } finally {
      setScraping(false)
    }
  }

  // Selecionar resultado da busca
  async function handleSelectResult(result) {
    if (!result.url) return

    setScraping(true)
    setSearchResults([])

    try {
      const data = await scrapeFragrantica(result.url)
      if (data) {
        setForm(prev => ({
          ...prev,
          nome: data.name || result.name || prev.nome,
          genero: data.gender || prev.genero,
          descricao: data.description || prev.descricao,
          imagem_url: data.image || prev.imagem_url,
        }))
        if (data.image) setPreview(data.image)
        if (data.brand && marcas.length > 0) {
          const matched = matchMarca(data.brand, marcas)
          if (matched) setForm(prev => ({ ...prev, marca_id: matched.id }))
        }
        setScrapeMsg('Dados preenchidos automaticamente!')
      }
    } catch {
      setError('Erro ao extrair dados. Preencha manualmente.')
    } finally {
      setScraping(false)
      setFragQuery('')
    }
  }

  // Abrir busca manual
  function handleOpenSearch() {
    openFragranticaSearch(fragQuery || form.nome || '')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const produtoData = {
        nome: form.nome,
        marca_id: form.marca_id || null,
        genero: form.genero,
        preco: parseFloat(form.preco) || 0,
        descricao: form.descricao,
        tags: form.tags,
        imagem_url: form.imagem_url || null,
        ativo: produto?.ativo ?? true,
      }

      if (produto) {
        await updateProduto(produto.id, produtoData)
      } else {
        await createProduto(produtoData)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  const isEditing = !!produto

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-heading text-lg font-semibold text-ivory">
          {isEditing ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <div className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent mt-2" />
      </div>

      {/* Fragrantica helper - apenas para novos produtos */}
      {!isEditing && (
        <div className="mb-4 p-3 rounded-xl bg-noir-800/30 border border-ivory/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={13} className="text-gold/70" />
            <span className="text-[11px] font-medium text-ivory/50">
              Buscar no Fragrantica
            </span>
          </div>

          {/* Busca por nome */}
          <div className="flex gap-2">
            <input
              type="text"
              value={fragQuery}
              onChange={(e) => setFragQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              placeholder="Nome do perfume (ex: Sauvage, Aventus)"
              className={`${inputClass} flex-1 text-xs`}
              disabled={scraping}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={scraping || fragQuery.trim().length < 2}
              className="px-3 py-2 rounded-lg bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {scraping ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              <span className="text-xs">Buscar</span>
            </button>
          </div>

          {/* Link manual */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-ivory/30">ou</span>
            <button
              type="button"
              onClick={handleOpenSearch}
              className="text-[11px] text-gold/60 hover:text-gold transition-colors underline underline-offset-2"
            >
              buscar manualmente no site
            </button>
          </div>

          {/* Loading */}
          {scraping && <ShimmerSpinner />}

          {/* Resultados da busca */}
          {searchResults.length > 0 && !scraping && (
            <div className="mt-3 space-y-2">
              <p className="text-[10px] text-ivory/30 uppercase tracking-wider">Selecione:</p>
              {searchResults.map((result, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-noir-800/50 border border-ivory/5 hover:border-gold/20 hover:bg-gold/5 transition-all text-left"
                >
                  {result.image ? (
                    <img src={result.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-noir-700 flex items-center justify-center flex-shrink-0">
                      <ImageIcon size={14} className="text-ivory/20" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-ivory/80 text-sm font-medium truncate">{result.name}</p>
                    {result.brand && <p className="text-ivory/40 text-xs truncate">{result.brand}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {scrapeMsg && !scraping && (
            <p className="mt-2 text-xs text-green-400">{scrapeMsg}</p>
          )}
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-lg text-sm mb-3 bg-red-500/10 text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          <InputField label="Nome do Produto">
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Oud Mood"
              required
              className={inputClass}
            />
          </InputField>

          <InputField label="Marca">
            <select
              name="marca_id"
              value={form.marca_id}
              onChange={handleChange}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="">Selecione uma marca</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>{marca.nome}</option>
              ))}
            </select>
          </InputField>

          <div className="grid grid-cols-2 gap-3">
            <InputField label="Gênero">
              <select
                name="genero"
                value={form.genero}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                {generos.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </InputField>
            <InputField label="Preço (R$)">
              <input
                type="number"
                name="preco"
                value={form.preco}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
                className={inputClass}
              />
            </InputField>
          </div>

          <InputField label="Descrição">
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Descrição do produto..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </InputField>
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <InputField label="URL da Imagem">
            <input
              type="url"
              name="imagem_url"
              value={form.imagem_url}
              onChange={handleImageUrl}
              placeholder="https://exemplo.com/imagem.jpg"
              className={inputClass}
            />
          </InputField>

          <div 
            className="relative rounded-xl overflow-hidden bg-noir-800/50 border border-ivory/5"
            style={{ aspectRatio: '1' }}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreview(null)}
                />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setForm(prev => ({ ...prev, imagem_url: '' })) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-all"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-ivory/20">
                <ImageIcon size={32} strokeWidth={1} />
                <span className="text-xs mt-2">Preview da imagem</span>
              </div>
            )}
          </div>

          <InputField label="Tags">
            <div className="flex flex-wrap gap-2">
              {tagsDisponiveis.map(tag => {
                const active = form.tags.includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    type="button"
                    onClick={() => handleTagToggle(tag.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      active
                        ? 'bg-gold/15 text-gold border border-gold/30'
                        : 'bg-noir-800/50 text-ivory/40 border border-ivory/5 hover:border-ivory/15 hover:text-ivory/60'
                    }`}
                  >
                    {active && <Check size={12} />}
                    {tag.label}
                  </button>
                )
              })}
            </div>
          </InputField>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5 pt-4 border-t border-ivory/5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl text-ivory/50 hover:text-ivory/70 text-sm font-medium transition-all duration-200 bg-noir-800/50 border border-ivory/5 hover:border-ivory/15"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !form.nome}
          className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-noir-950 text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:from-gold-light hover:to-gold"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
              Salvando...
            </span>
          ) : (
            isEditing ? 'Atualizar' : 'Criar Produto'
          )}
        </button>
      </div>
    </form>
  )
}
