import CardProduto from './CardProduto'

export default function ListaProdutos({ produtos, onWhatsAppClick }) {
  if (produtos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produtos.map((produto) => (
        <CardProduto
          key={produto.id}
          produto={produto}
          onWhatsAppClick={onWhatsAppClick}
        />
      ))}
    </div>
  )
}
