import { Link } from 'react-router-dom'
import { ShoppingBag, Gem } from 'lucide-react'
import Badge from '../ui/Badge'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'wine',
  'oferta relâmpago': 'danger',
}

export default function CardProduto({ produto, onWhatsAppClick }) {
  return (
    <div className="luxury-card rounded-2xl overflow-hidden group">
      {/* Image container */}
      <Link to={`/produto/${produto.id}`}>
        <div className="aspect-square bg-noir-900 relative overflow-hidden">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gem className="text-gold/20" size={48} />
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Tags overlay */}
          {produto.tags?.length > 0 && (
            <div className="absolute top-4 left-4 flex gap-2">
              {produto.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant={tagColors[tag] || 'default'}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Quick view badge */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="bg-gold/90 text-noir-950 text-center py-3 rounded-lg font-semibold text-sm">
              Ver Detalhes
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        <p className="font-accent text-[10px] uppercase tracking-[0.2em] text-gold/50 mb-2">
          {produto.marcas?.nome}
        </p>
        
        {/* Name */}
        <Link to={`/produto/${produto.id}`}>
          <h3 className="font-heading text-lg font-bold text-ivory mb-3 group-hover:text-gold transition-colors duration-300 line-clamp-2">
            {produto.nome}
          </h3>
        </Link>
        
        {/* Price */}
        <p className="price-tag text-xl mb-4">
          R$ {produto.preco.toFixed(2)}
        </p>

        {/* WhatsApp button */}
        <button
          onClick={() => onWhatsAppClick(produto)}
          className="w-full btn-whatsapp text-sm"
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
