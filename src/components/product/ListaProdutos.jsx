import CardProduto from './CardProduto'

export default function ListaProdutos({ produtos, onWhatsAppClick }) {
  if (produtos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {produtos.map((produto, index) => (
        <div
          key={produto.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardProduto
            produto={produto}
            onWhatsAppClick={onWhatsAppClick}
          />
        </div>
      ))}
    </div>
  )
}
