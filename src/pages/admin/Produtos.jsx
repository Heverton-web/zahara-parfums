import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useProdutos, toggleProdutoAtivo, deleteProduto } from '../../hooks/useProdutos'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import FormProduto from '../../components/product/FormProduto'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Search } from 'lucide-react'

export default function AdminProdutos() {
  const [marcas, setMarcas] = useState([])
  const [filtros, setFiltros] = useState({ ativo: undefined })
  const { produtos, loading, refetch } = useProdutos(filtros)
  const [modalOpen, setModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [busca, setBusca] = useState('')

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
  }

  function handleNew() {
    setProdutoEditando(null)
    setModalOpen(true)
  }

  async function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduto(id)
      refetch()
    }
  }

  async function handleToggle(produto) {
    await toggleProdutoAtivo(produto.id, produto.ativo)
    refetch()
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-ivory mb-2">
            Produtos
          </h1>
          <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-luxury w-full pl-10"
          />
        </div>
        <select
          value={filtros.ativo === undefined ? '' : filtros.ativo.toString()}
          onChange={(e) => setFiltros({
            ativo: e.target.value === '' ? undefined : e.target.value === 'true'
          })}
          className="input-luxury min-w-[140px]"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-noir-900/50 border border-noir-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-noir-800">
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Produto
                </th>
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Marca
                </th>
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Gênero
                </th>
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Preço
                </th>
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Tags
                </th>
                <th className="text-left px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Status
                </th>
                <th className="text-right px-6 py-4 font-accent text-xs uppercase tracking-wider text-ivory/50">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : produtosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <p className="text-ivory/30 italic">Nenhum produto encontrado</p>
                  </td>
                </tr>
              ) : (
                produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id}
                    className="border-b border-noir-800/50 hover:bg-noir-800/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {produto.imagem_url ? (
                          <img
                            src={produto.imagem_url}
                            alt=""
                            className="h-12 w-12 rounded-lg object-cover border border-noir-700"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-noir-800 flex items-center justify-center text-ivory/20 text-xs border border-noir-700">
                            IMG
                          </div>
                        )}
                        <span className="text-ivory font-medium">{produto.nome}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ivory/50">{produto.marcas?.nome || '-'}</td>
                    <td className="px-6 py-4 text-ivory/50 capitalize">{produto.genero}</td>
                    <td className="px-6 py-4">
                      <span className="price-tag">R$ {produto.preco.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {produto.tags?.map(tag => (
                          <Badge key={tag} variant="gold">{tag}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={produto.ativo ? 'success' : 'danger'}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggle(produto)}
                          className="w-8 h-8 rounded-lg border border-noir-700 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
                          title={produto.ativo ? 'Inativar' : 'Ativar'}
                        >
                          {produto.ativo ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(produto)}
                          className="w-8 h-8 rounded-lg border border-noir-700 flex items-center justify-center text-ivory/40 hover:text-gold hover:border-gold/30 transition-all duration-300"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
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
        onClose={() => { setModalOpen(false); setProdutoEditando(null) }}
        title={produtoEditando ? 'Editar Produto' : 'Novo Produto'}
      >
        <FormProduto
          produto={produtoEditando}
          onSuccess={handleSuccess}
          onCancel={() => { setModalOpen(false); setProdutoEditando(null) }}
        />
      </Modal>
    </div>
  )
}
