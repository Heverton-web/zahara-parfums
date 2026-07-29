import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Badge from '../ui/Badge'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'warning',
  'oferta relâmpago': 'danger',
}

export default function CardProduto({ produto, onWhatsAppClick }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-gold/30 transition-colors">
      <Link to={`/produto/${produto.id}`}>
        <div className="aspect-square bg-zinc-800 overflow-hidden">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <ShoppingBag size={48} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {produto.tags?.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {produto.tags.map((tag) => (
              <Badge key={tag} variant={tagColors[tag] || 'default'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-sm">{produto.marcas?.nome}</p>
        <Link to={`/produto/${produto.id}`}>
          <h3 className="font-semibold text-lg mt-1 hover:text-gold transition-colors">
            {produto.nome}
          </h3>
        </Link>
        <p className="text-gold font-bold text-xl mt-2">
          R$ {produto.preco.toFixed(2)}
        </p>

        <button
          onClick={() => onWhatsAppClick(produto)}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar no WhatsApp
        </button>
      </div>
    </div>
  )
}
