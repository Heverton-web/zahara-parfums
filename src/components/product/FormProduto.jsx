import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const tagOptions = [
  { value: 'lançamento', label: 'Lançamento' },
  { value: 'promoção', label: 'Promoção' },
  { value: 'oferta relâmpago', label: 'Oferta Relâmpago' },
]

export default function FormProduto({ produto, onSuccess, onCancel }) {
  const [marcas, setMarcas] = useState([])
  const [form, setForm] = useState({
    nome: '',
    marca_id: '',
    genero: 'feminino',
    preco: '',
    descricao: '',
    tags: [],
    imagem: null,
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    fetchMarcas()
    if (produto) {
      setForm({
        nome: produto.nome || '',
        marca_id: produto.marca_id || '',
        genero: produto.genero || 'feminino',
        preco: produto.preco || '',
        descricao: produto.descricao || '',
        tags: produto.tags || [],
        imagem: null,
      })
      setPreview(produto.imagem_url || null)
    }
  }, [produto])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, imagem: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  function handleTagToggle(tag) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let imagem_url = produto?.imagem_url || null

    if (form.imagem) {
      const fileExt = form.imagem.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData } = await supabase.storage
        .from('produtos')
        .upload(fileName, form.imagem)

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path)
        imagem_url = urlData.publicUrl
      }
    }

    const payload = {
      nome: form.nome,
      marca_id: form.marca_id || null,
      genero: form.genero,
      preco: parseFloat(form.preco),
      descricao: form.descricao,
      tags: form.tags,
      imagem_url,
    }

    if (produto) {
      await supabase.from('produtos').update(payload).eq('id', produto.id)
    } else {
      await supabase.from('produtos').insert(payload)
    }

    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Produto"
        value={form.nome}
        onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
        required
      />

      <Select
        label="Marca"
        value={form.marca_id}
        onChange={(e) => setForm(prev => ({ ...prev, marca_id: e.target.value }))}
        options={[
          { value: '', label: 'Selecione...' },
          ...marcas.map(m => ({ value: m.id, label: m.nome }))
        ]}
      />

      <Select
        label="Gênero"
        value={form.genero}
        onChange={(e) => setForm(prev => ({ ...prev, genero: e.target.value }))}
        options={[
          { value: 'feminino', label: 'Feminino' },
          { value: 'masculino', label: 'Masculino' },
          { value: 'unissex', label: 'Unissex' },
        ]}
      />

      <Input
        label="Preço (R$)"
        type="number"
        step="0.01"
        min="0"
        value={form.preco}
        onChange={(e) => setForm(prev => ({ ...prev, preco: e.target.value }))}
        required
      />

      <div>
        <label className="text-sm text-gray-400 block mb-1">Descrição</label>
        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold h-24"
          value={form.descricao}
          onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 block mb-2">Tags</label>
        <div className="flex gap-2">
          {tagOptions.map(tag => (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagToggle(tag.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.tags.includes(tag.value)
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 block mb-1">Imagem</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-gray-300 hover:file:bg-zinc-700"
        />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : produto ? 'Salvar Alterações' : 'Criar Produto'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
