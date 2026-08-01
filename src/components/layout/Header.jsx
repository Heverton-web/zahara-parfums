import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Store } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-3 shadow-lg'
          : 'bg-noir-950/90 backdrop-blur-md py-3.5 border-b border-ivory/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Botão Voltar para a Home (Visível em todas as rotas exceto na própria Home) */}
          {!isHome ? (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-noir-900/90 hover:bg-gold/15 text-ivory/80 hover:text-gold border border-gold/25 text-xs font-semibold transition-all active:scale-95 shadow-md group"
            >
              <ArrowLeft size={14} className="text-gold group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Voltar para a Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
          ) : (
            <div className="w-16 sm:w-28" />
          )}

          {/* Logo Centralizada Zahara Parfums */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-gold text-xl sm:text-2xl font-accent">✦</span>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-lg sm:text-xl font-bold text-gradient-gold">
                Zahara
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-gold/50">
                Parfums
              </span>
            </div>
          </Link>

          {/* Atalho para a Loja Geral se não for Home */}
          {!isHome ? (
            <Link
              to="/loja"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 hover:bg-gold text-gold hover:text-noir-950 border border-gold/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Store size={14} />
              <span className="hidden sm:inline">Loja</span>
            </Link>
          ) : (
            <div className="w-16 sm:w-28" />
          )}
        </div>
      </div>
    </header>
  )
}
