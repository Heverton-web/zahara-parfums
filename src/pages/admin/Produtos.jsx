import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useProdutos, toggleProdutoAtivo, deleteProduto } from '../../hooks/useProdutos'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import FormProduto from '../../components/product/FormProduto'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold flex-1"
        />
        <select
          value={filtros.ativo === undefined ? '' : filtros.ativo.toString()}
          onChange={(e) => setFiltros({
            ativo: e.target.value === '' ? undefined : e.target.value === 'true'
          })}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Produto</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Marca</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Gênero</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Preço</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Tags</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">Nenhum produto encontrado</td>
              </tr>
            ) : (
              produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {produto.imagem_url ? (
                        <img src={produto.imagem_url} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center text-gray-600 text-xs">IMG</div>
                      )}
                      <span>{produto.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{produto.marcas?.nome || '-'}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{produto.genero}</td>
                  <td className="px-4 py-3 text-gold font-medium">R$ {produto.preco.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {produto.tags?.map(tag => (
                        <Badge key={tag} variant="gold">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={produto.ativo ? 'success' : 'danger'}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(produto)}
                        className="text-gray-400 hover:text-gold transition-colors"
                        title={produto.ativo ? 'Inativar' : 'Ativar'}
                      >
                        {produto.ativo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(produto)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
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
