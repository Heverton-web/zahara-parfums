import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu ao navegar
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-3 shadow-lg'
          : 'bg-noir-950 backdrop-blur-sm py-4'
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-3 items-center">
          {/* Desktop Nav - Left */}
          <nav className="hidden md:flex items-center gap-6 justify-start">
            <Link to="/" className="nav-link text-sm">Home</Link>
            <Link to="/loja" className="nav-link text-sm">Coleção</Link>
            <Link to="/marcas" className="nav-link text-sm">Marcas</Link>
          </nav>

          {/* Mobile hamburger - Left */}
          <div className="md:hidden flex justify-start">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-ivory/60 hover:text-gold transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Logo - Center */}
          <Link to="/" className="flex items-center justify-center gap-2" onClick={() => setMobileMenuOpen(false)}>
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

          {/* Right spacer */}
          <div className="hidden md:block" />
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-gold/10 bg-noir-950/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2.5 rounded-lg text-sm text-ivory/60 hover:text-gold hover:bg-gold/5 transition-all">
              Home
            </Link>
            <Link to="/loja" className="block px-3 py-2.5 rounded-lg text-sm text-ivory/60 hover:text-gold hover:bg-gold/5 transition-all">
              Coleção
            </Link>
            <Link to="/marcas" className="block px-3 py-2.5 rounded-lg text-sm text-ivory/60 hover:text-gold hover:bg-gold/5 transition-all">
              Marcas
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
