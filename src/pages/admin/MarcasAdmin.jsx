import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [marcaToDelete, setMarcaToDelete] = useState(null)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
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

  function handleDeleteClick(id) {
    setMarcaToDelete(id)
    setConfirmOpen(true)
    setExpandedCard(null)
  }

  async function handleDeleteConfirm() {
    if (marcaToDelete) {
      try {
        const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
          import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'
        
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('marcas').delete().eq('id', marcaToDelete)
          if (error) throw error
        }
        fetchMarcas()
      } catch (err) {
        console.error('Erro ao deletar marca:', err)
      }
    }
    setMarcaToDelete(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
        import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

      if (isSupabaseConfigured) {
        if (marcaEditando) {
          const { error } = await supabase.from('marcas').update({ nome }).eq('id', marcaEditando.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from('marcas').insert({ nome })
          if (error) throw error
        }
      } else {
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
      setMarcaEditando(null)
      setNome('')
      fetchMarcas()
    } catch (err) {
      console.error('Erro ao salvar marca:', err)
      setSaving(false)
    }
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
        className="hidden lg:block bg-noir-900 rounded-xl overflow-hidden"
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
                    className="hover:bg-noir-800 transition-colors duration-200"
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
                          onClick={() => handleDeleteClick(marca.id)}
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
              className="bg-noir-900 rounded-xl p-4"
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
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-gold hover:bg-noir-800 transition-all"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(marca.id)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-wine hover:bg-noir-800 transition-all"
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setMarcaEditando(null) }}>
        <div className="mb-4">
          <h3 className="font-heading text-lg font-semibold text-ivory">
            {marcaEditando ? 'Editar Marca' : 'Nova Marca'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-1.5 font-medium">
              Nome da Marca
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Amouage, Ajmal, Rasasi..."
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
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setModalOpen(false); setMarcaEditando(null) }}
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
              disabled={saving || !nome.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-noir-950 text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:from-gold-light hover:to-gold"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                marcaEditando ? 'Salvar' : 'Criar Marca'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setMarcaToDelete(null) }}
        onConfirm={handleDeleteConfirm}
        title="Excluir Marca"
        message="Tem certeza que deseja excluir esta marca? Produtos ficarão sem marca associada."
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
