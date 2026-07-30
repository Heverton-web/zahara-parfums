import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Plus, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { marcasMock } from '../../data/mock'

export default function MarcasAdmin() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [marcaEditando, setMarcaEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    // Se Supabase não está configurado, usar mock
    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'
    
    if (!isSupabaseConfigured) {
      setMarcas(marcasMock)
      setLoading(false)
      return
    }

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
    setExpandedCard(null)
  }

  async function handleDelete(id) {
    if (confirm('Excluir esta marca? Produtos ficarão sem marca.')) {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
        import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'
      
      if (isSupabaseConfigured) {
        await supabase.from('marcas').delete().eq('id', id)
      }
      setMarcas(marcas.filter(m => m.id !== id))
    }
    setExpandedCard(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
      import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

    if (isSupabaseConfigured) {
      if (marcaEditando) {
        await supabase.from('marcas').update({ nome }).eq('id', marcaEditando.id)
      } else {
        await supabase.from('marcas').insert({ nome })
      }
    } else {
      // Mock mode
      if (marcaEditando) {
        setMarcas(marcas.map(m => m.id === marcaEditando.id ? { ...m, nome } : m))
      } else {
        const newMarca = {
          id: Date.now().toString(),
          nome,
          logo_url: null
        }
        setMarcas([...marcas, newMarca])
      }
    }

    setSaving(false)
    setModalOpen(false)
    fetchMarcas()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Marcas
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto text-sm">
          <Plus size={16} className="mr-2" />
          Nova Marca
        </Button>
      </div>

      {/* Desktop Table */}
      <div 
        className="hidden lg:block bg-noir-900/50 rounded-xl overflow-hidden"
        style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.15)' }}>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Marca
                </th>
                <th className="text-right px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="2" className="px-5 py-10 text-center">
                    <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : marcas.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-5 py-10 text-center">
                    <p className="text-ivory/25 italic text-sm">Nenhuma marca cadastrada</p>
                  </td>
                </tr>
              ) : (
                marcas.map((marca) => (
                  <tr
                    key={marca.id}
                    className="hover:bg-noir-800/20 transition-colors duration-200"
                    style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.1)' }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {marca.logo_url ? (
                          <img
                            src={marca.logo_url}
                            alt=""
                            className="h-9 w-9 rounded-lg object-contain bg-noir-900"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                          />
                        ) : (
                          <div 
                            className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                          >
                            <span className="text-gold font-accent text-sm font-bold">
                              {marca.nome[0]}
                            </span>
                          </div>
                        )}
                        <span className="text-ivory/80 font-medium text-sm">{marca.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(marca)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all duration-300"
                          style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(marca.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-wine transition-all duration-300"
                          style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                        >
                          <Trash2 size={14} />
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

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
          </div>
        ) : marcas.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ivory/25 italic">Nenhuma marca cadastrada</p>
          </div>
        ) : (
          marcas.map((marca) => (
            <div
              key={marca.id}
              className="bg-noir-900/50 rounded-xl p-4"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
            >
              <div className="flex items-center gap-3">
                {/* Logo */}
                {marca.logo_url ? (
                  <img
                    src={marca.logo_url}
                    alt=""
                    className="h-12 w-12 rounded-lg object-contain bg-noir-900 flex-shrink-0"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  />
                ) : (
                  <div 
                    className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  >
                    <span className="text-gold font-accent text-lg font-bold">
                      {marca.nome[0]}
                    </span>
                  </div>
                )}

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-ivory/80 font-medium truncate">
                    {marca.nome}
                  </h3>
                </div>

                {/* Actions */}
                <div className="relative">
                  <button
                    onClick={() => setExpandedCard(expandedCard === marca.id ? null : marca.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ivory/30 hover:text-ivory/60 transition-all"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {expandedCard === marca.id && (
                    <div 
                      className="absolute right-0 top-10 w-32 bg-noir-900 rounded-xl shadow-lg z-10 overflow-hidden"
                      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                    >
                      <button
                        onClick={() => handleEdit(marca)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-gold hover:bg-noir-800/50 transition-all"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(marca.id)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-wine hover:bg-noir-800/50 transition-all"
                      >
                        <Trash2 size={14} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setMarcaEditando(null) }}
        title={marcaEditando ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <Input
            label="Nome da Marca"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Amouage, Ajmal, Rasasi..."
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1 text-sm">
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
              className="text-sm"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
