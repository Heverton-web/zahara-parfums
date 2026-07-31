import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useProdutos, toggleProdutoAtivo, deleteProduto } from '../../hooks/useProdutos'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormProduto from '../../components/product/FormProduto'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search, MoreVertical } from 'lucide-react'

export default function AdminProdutos() {
  const [marcas, setMarcas] = useState([])
  const [filtros, setFiltros] = useState({ ativo: undefined })
  const { produtos, loading, refetch } = useProdutos(filtros)
  const [modalOpen, setModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [busca, setBusca] = useState('')
  const [expandedCard, setExpandedCard] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [produtoToDelete, setProdutoToDelete] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  function handleEdit(produto) {
    setProdutoEditando(produto)
    setModalOpen(true)
    setExpandedCard(null)
  }

  function handleNew() {
    setProdutoEditando(null)
    setModalOpen(true)
  }

  function handleDeleteClick(id) {
    setProdutoToDelete(id)
    setConfirmOpen(true)
    setExpandedCard(null)
  }

  async function handleDeleteConfirm() {
    if (produtoToDelete) {
      try {
        await deleteProduto(produtoToDelete)
        await refetch()
      } catch (err) {
        console.error('Erro ao deletar:', err)
      }
    }
    setProdutoToDelete(null)
  }

  async function handleToggle(produto) {
    setTogglingId(produto.id)
    try {
      await toggleProdutoAtivo(produto.id, produto.ativo)
      await refetch()
    } catch (err) {
      console.error('Erro ao toggle:', err)
    }
    setTogglingId(null)
    setExpandedCard(null)
  }

  function handleSuccess() {
    setModalOpen(false)
    setProdutoEditando(null)
    refetch()
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Produtos
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleNew} className="w-full sm:w-auto text-sm">
          <Plus size={16} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-luxury w-full pl-9 text-sm"
          />
        </div>
        <select
          value={filtros.ativo === undefined ? '' : filtros.ativo.toString()}
          onChange={(e) => setFiltros({
            ativo: e.target.value === '' ? undefined : e.target.value === 'true'
          })}
          className="input-luxury sm:min-w-[140px] text-sm"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
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
                  Produto
                </th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Marca
                </th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Gênero
                </th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Preço
                </th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Tags
                </th>
                <th className="text-left px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Status
                </th>
                <th className="text-right px-5 py-3 font-accent text-[10px] uppercase tracking-wider text-ivory/40">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center">
                    <p className="text-ivory/25 italic text-sm">Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className="hover:bg-noir-800 transition-colors duration-200"
                    style={{ borderBottom: '0.25px solid rgba(212, 175, 55, 0.1)' }}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {produto.imagem_url ? (
                          <img
                            src={produto.imagem_url}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                          />
                        ) : (
                          <div 
                            className="h-10 w-10 rounded-lg bg-noir-800 flex items-center justify-center text-ivory/15 text-[10px]"
                            style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                          >
                            IMG
                          </div>
                        )}
                        <span className="text-ivory/80 font-medium text-sm">{produto.nome}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ivory/40 text-sm">{produto.marcas?.nome || '-'}</td>
                    <td className="px-5 py-3 text-ivory/40 text-sm capitalize">{produto.genero}</td>
                    <td className="px-5 py-3">
                      <span className="price-tag text-sm">R$ {produto.preco.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {produto.tags?.map(tag => (
                          <Badge key={tag} variant="gold" className="text-[9px] px-1.5 py-0.5">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={produto.ativo ? 'success' : 'danger'} className="text-[10px]">
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleToggle(produto)}
                          disabled={togglingId === produto.id}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all duration-300 disabled:opacity-50"
                          style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                          title={produto.ativo ? 'Inativar' : 'Ativar'}
                        >
                          {togglingId === produto.id ? (
                            <div className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin" />
                          ) : (
                            produto.ativo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(produto)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold transition-all duration-300"
                          style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(produto.id)}
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
        ) : produtosFiltrados.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ivory/25 italic">Nenhum produto encontrado</p>
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-noir-900 rounded-xl p-4"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
            >
              <div className="flex items-start gap-3">
                {/* Image */}
                {produto.imagem_url ? (
                  <img
                    src={produto.imagem_url}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  />
                ) : (
                  <div 
                    className="h-16 w-16 rounded-lg bg-noir-800 flex items-center justify-center text-ivory/15 text-[10px] flex-shrink-0"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  >
                    IMG
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-ivory/40 text-[10px] font-accent uppercase tracking-wider mb-0.5">
                    {produto.marcas?.nome || 'Sem marca'}
                  </p>
                  <h3 className="text-ivory/80 font-medium text-sm mb-1 truncate">
                    {produto.nome}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="price-tag text-sm">R$ {produto.preco.toFixed(2)}</span>
                    <Badge variant={produto.ativo ? 'success' : 'danger'} className="text-[9px] px-1.5 py-0">
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  {/* Tags */}
                  {produto.tags?.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {produto.tags.map(tag => (
                        <Badge key={tag} variant="gold" className="text-[8px] px-1.5 py-0">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions menu */}
                <div className="relative">
                  <button
                    onClick={() => setExpandedCard(expandedCard === produto.id ? null : produto.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-ivory/30 hover:text-ivory/60 transition-all"
                    style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Dropdown */}
                  {expandedCard === produto.id && (
                    <div 
                      className="absolute right-0 top-10 w-36 bg-noir-900 rounded-xl shadow-lg z-10 overflow-hidden"
                      style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
                    >
                      <button
                        onClick={() => handleToggle(produto)}
                        disabled={togglingId === produto.id}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-gold hover:bg-noir-800 transition-all disabled:opacity-50"
                      >
                        {togglingId === produto.id ? (
                          <div className="w-3 h-3 border border-gold/30 border-t-gold rounded-full animate-spin" />
                        ) : (
                          produto.ativo ? <ToggleLeft size={14} /> : <ToggleRight size={14} />
                        )}
                        {produto.ativo ? 'Inativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleEdit(produto)}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-ivory/60 hover:text-gold hover:bg-noir-800 transition-all"
                      >
                        <Pencil size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(produto.id)}
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

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setProdutoEditando(null) }} size="lg">
        <FormProduto
          produto={produtoEditando}
          marcas={marcas}
          onSuccess={handleSuccess}
          onCancel={() => { setModalOpen(false); setProdutoEditando(null) }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setProdutoToDelete(null) }}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        variant="danger"
      />
    </div>
  )
}
