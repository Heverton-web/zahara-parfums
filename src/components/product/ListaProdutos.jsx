import CardProduto from './CardProduto'

export default function ListaProdutos({ produtos }) {
  if (produtos.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
      {produtos.map((produto, index) => (
        <div
          key={produto.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <CardProduto produto={produto} />
        </div>
      ))}
    </div>
  )
}
