import { Link } from 'react-router-dom'
import { Gem } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-noir-950 flex items-center justify-center px-4 sm:px-6">
      <div className="text-center">
        <div className="relative mb-6 sm:mb-8">
          <span className="text-gold/5 sm:text-gold/10 text-[120px] sm:text-[200px] font-accent absolute -top-12 sm:-top-20 left-1/2 -translate-x-1/2">
            404
          </span>
          <Gem className="text-gold/20 sm:text-gold/30 mx-auto relative z-10" size={60} />
        </div>
        
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-ivory mb-3 sm:mb-4">
          Página Não Encontrada
        </h1>
        
        <p className="font-display text-sm sm:text-base text-ivory/40 sm:text-ivory/50 italic mb-6 sm:mb-8 max-w-md mx-auto">
          Parece que esta página se perfundiu no ar. Vamos te ajudar a encontrar o que procura.
        </p>
        
        <Link
          to="/"
          className="btn-luxury inline-block text-sm sm:text-base"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  )
}
