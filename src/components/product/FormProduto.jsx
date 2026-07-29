import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'
import { Upload, X } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nome do Produto"
        value={form.nome}
        onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
        placeholder="Ex: Oud Royale, Amber Noir..."
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
        placeholder="0.00"
        required
      />

      <div>
        <label className="font-accent text-[10px] uppercase tracking-wider text-ivory/50 block mb-2">
          Descrição
        </label>
        <textarea
          className="input-luxury w-full h-24 resize-none"
          value={form.descricao}
          onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva o perfume, notas, características..."
        />
      </div>

      <div>
        <label className="font-accent text-[10px] uppercase tracking-wider text-ivory/50 block mb-3">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map(tag => (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagToggle(tag.value)}
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                form.tags.includes(tag.value)
                  ? 'bg-gold/15 border-gold/40 text-gold'
                  : 'bg-noir-800/50 border-noir-700 text-ivory/40 hover:border-gold/20 hover:text-ivory/60'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-accent text-[10px] uppercase tracking-wider text-ivory/50 block mb-2">
          Imagem
        </label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-noir-700 rounded-xl cursor-pointer hover:border-gold/30 transition-colors duration-300"
          >
            <Upload className="text-ivory/30 mb-2" size={24} />
            <span className="text-ivory/40 text-sm">
              {preview ? 'Trocar imagem' : 'Clique para enviar'}
            </span>
          </label>
        </div>
        
        {preview && (
          <div className="relative mt-4 inline-block">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-xl border border-noir-700"
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null)
                setForm(prev => ({ ...prev, imagem: null }))
              }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-noir-900 border border-noir-700 flex items-center justify-center text-ivory/50 hover:text-wine transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
              Salvando...
            </span>
          ) : (
            produto ? 'Salvar Alterações' : 'Criar Produto'
          )}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
