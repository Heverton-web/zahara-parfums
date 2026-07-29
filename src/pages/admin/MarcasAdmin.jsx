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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ivory mb-2">
            Marcas
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Nova Marca
        </Button>
      </div>

      {/* Table */}
      <div className="bg-noir-900/50 border border-noir-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-noir-800">
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Marca
                </th>
                <th className="text-right px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : marcas.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-6 py-12 text-center">
                    <p className="text-ivory/30 italic">Nenhuma marca cadastrada</p>
                  </td>
                </tr>
              ) : (
                marcas.map((marca) => (
                  <tr
                    key={marca.id}
                    className="border-b border-noir-800/50 hover:bg-noir-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {marca.logo_url ? (
                          <img
                            src={marca.logo_url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-contain border border-noir-700 bg-noir-900"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <span className="text-gold font-accent text-sm font-bold">
                              {marca.nome[0]}
                            </span>
                          </div>
                        )}
                        <span className="text-ivory font-medium">{marca.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(marca)}
                          className="w-8 h-8 rounded-lg border border-noir-700 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(marca.id)}
                          className="w-8 h-8 rounded-lg border border-noir-700 flex items-center justify-center text-ivory/40 hover:text-wine hover:border-wine/30 transition-all duration-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setMarcaEditando(null) }}
        title={marcaEditando ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nome da Marca"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Amouage, Ajmal, Rasasi..."
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                marcaEditando ? 'Salvar Alterações' : 'Criar Marca'
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setModalOpen(false); setMarcaEditando(null) }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
