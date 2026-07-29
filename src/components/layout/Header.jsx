import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-gold">
          Zahara Parfums
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/loja" className="text-gray-300 hover:text-white transition-colors">Loja</Link>
          <Link to="/marcas" className="text-gray-300 hover:text-white transition-colors">Marcas</Link>
        </nav>

        <Link to="/loja" className="text-gray-400 hover:text-white">
          <Search size={20} />
        </Link>
      </div>
    </header>
  )
}
