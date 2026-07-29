import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'

export default function Home() {
  const { produtos } = useProdutos({ ativo: true })

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-zinc-950" />
        <div className="relative text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Zahara <span className="text-gold">Parfums</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
            Perfumes importados que despertam suas emoções
          </p>
          <Link
            to="/loja"
            className="inline-block bg-gold text-zinc-950 font-semibold px-8 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            Ver Coleção
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold mb-8">
          Destaques
        </h2>

        {produtos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.slice(0, 3).map((produto) => (
              <Link
                key={produto.id}
                to={`/produto/${produto.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
              >
                <div className="aspect-square bg-zinc-800">
                  {produto.imagem_url ? (
                    <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">IMG</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm">{produto.marcas?.nome}</p>
                  <h3 className="font-semibold text-lg">{produto.nome}</h3>
                  <p className="text-gold font-bold text-xl mt-2">R$ {produto.preco.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum produto em destaque ainda.</p>
        )}
      </section>
    </div>
  )
}
