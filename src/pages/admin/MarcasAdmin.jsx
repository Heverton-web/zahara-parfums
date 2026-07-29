import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function MarcasAdmin() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [marcaEditando, setMarcaEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
    setLoading(false)
  }

  function handleNew() {
    setMarcaEditando(null)
    setNome('')
    setModalOpen(true)
  }

  function handleEdit(marca) {
    setMarcaEditando(marca)
    setNome(marca.nome)
    setModalOpen(true)
  }

  async function handleDelete(id) {
    if (confirm('Excluir esta marca? Produtos ficarão sem marca.')) {
      await supabase.from('marcas').delete().eq('id', id)
      fetchMarcas()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    if (marcaEditando) {
      await supabase.from('marcas').update({ nome }).eq('id', marcaEditando.id)
    } else {
      await supabase.from('marcas').insert({ nome })
    }

    setSaving(false)
    setModalOpen(false)
    fetchMarcas()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Nova Marca
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Marca</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : marcas.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-4 py-8 text-center text-gray-500">Nenhuma marca cadastrada</td>
              </tr>
            ) : (
              marcas.map((marca) => (
                <tr key={marca.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {marca.logo_url ? (
                        <img src={marca.logo_url} alt="" className="h-8 w-8 object-contain" />
                      ) : (
                        <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center text-gold text-sm font-bold">
                          {marca.nome[0]}
                        </div>
                      )}
                      <span>{marca.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(marca)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(marca.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setMarcaEditando(null) }}
        title={marcaEditando ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Marca"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : marcaEditando ? 'Salvar' : 'Criar'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); setMarcaEditando(null) }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
