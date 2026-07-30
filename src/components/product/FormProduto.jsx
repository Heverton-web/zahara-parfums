import { useState, useEffect } from 'react'
import { X, Upload, Check } from 'lucide-react'
import { createProduto, updateProduto } from '../../hooks/useProdutos'

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

      console.log('Salvando produto:', produtoData)

      if (produto) {
        const result = await updateProduto(produto.id, produtoData)
        console.log('Produto atualizado:', result)
      } else {
        const result = await createProduto(produtoData)
        console.log('Produto criado:', result)
      }
      onSuccess()
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setError(err.message || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: 'rgba(153, 27, 27, 0.2)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {/* Nome */}
      <div>
        <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
          Nome do Produto
        </label>
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Oud Mood"
          required
          className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all"
          style={{ 
            backgroundColor: '#12121a',
            border: '0.25px solid rgba(212, 175, 55, 0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
        />
      </div>

      {/* Marca */}
      <div>
        <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
          Marca
        </label>
        <select
          name="marca_id"
          value={form.marca_id}
          onChange={handleChange}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory focus:outline-none transition-all cursor-pointer"
          style={{ 
            backgroundColor: '#12121a',
            border: '0.25px solid rgba(212, 175, 55, 0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
        >
          <option value="">Selecione uma marca</option>
          {marcas.map(marca => (
            <option key={marca.id} value={marca.id}>{marca.nome}</option>
          ))}
        </select>
      </div>

      {/* Gênero e Preço */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
            Gênero
          </label>
          <select
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory focus:outline-none transition-all cursor-pointer"
            style={{ 
              backgroundColor: '#12121a',
              border: '0.25px solid rgba(212, 175, 55, 0.08)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
          >
            {generos.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
            Preço (R$)
          </label>
          <input
            type="number"
            name="preco"
            value={form.preco}
            onChange={handleChange}
            placeholder="0,00"
            step="0.01"
            min="0"
            required
            className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all"
            style={{ 
              backgroundColor: '#12121a',
              border: '0.25px solid rgba(212, 175, 55, 0.08)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
          />
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
          Descrição
        </label>
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição do produto..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all resize-none"
          style={{ 
            backgroundColor: '#12121a',
            border: '0.25px solid rgba(212, 175, 55, 0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-2 font-medium">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tagsDisponiveis.map(tag => (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagToggle(tag.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
              style={{ 
                backgroundColor: form.tags.includes(tag.value) ? 'rgba(212, 175, 55, 0.15)' : '#12121a',
                border: form.tags.includes(tag.value) 
                  ? '0.25px solid rgba(212, 175, 55, 0.4)' 
                  : '0.25px solid rgba(212, 175, 55, 0.08)',
                color: form.tags.includes(tag.value) ? '#c9a84c' : 'rgba(253, 249, 240, 0.5)'
              }}
            >
              {form.tags.includes(tag.value) && <Check size={12} />}
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Imagem URL */}
      <div>
        <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
          URL da Imagem
        </label>
        <input
          type="url"
          name="imagem_url"
          value={form.imagem_url}
          onChange={handleImageUrl}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all"
          style={{ 
            backgroundColor: '#12121a',
            border: '0.25px solid rgba(212, 175, 55, 0.08)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.3)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.08)'}
        />
        {preview && (
          <div className="mt-2 relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-lg"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
              onError={() => setPreview(null)}
            />
            <button
              type="button"
              onClick={() => { setPreview(null); setForm(prev => ({ ...prev, imagem_url: '' })) }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-noir-800 flex items-center justify-center text-ivory/50 hover:text-wine transition-colors"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
            >
              <X size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl text-ivory/50 hover:text-ivory/70 text-sm font-medium transition-all duration-200"
          style={{ 
            backgroundColor: '#12121a',
            border: '0.25px solid rgba(212, 175, 55, 0.08)' 
          }}
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
            produto ? 'Atualizar' : 'Criar Produto'
          )}
        </button>
      </div>
    </form>
  )
}
