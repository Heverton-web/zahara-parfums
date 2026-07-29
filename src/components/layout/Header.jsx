import { Link } from 'react-router-dom'
import { Search, Menu, X, ShoppingBag } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fechar menu ao clicar em um link
  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass py-3 shadow-lg'
          : 'bg-noir-950/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link text-sm">
              Home
            </Link>
            <Link to="/loja" className="nav-link text-sm">
              Coleção
            </Link>
            <Link to="/marcas" className="nav-link text-sm">
              Marcas
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/loja"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-gold/20 text-gold/70 hover:text-gold hover:border-gold/40 transition-all duration-300 text-sm"
            >
              <Search size={14} />
              <span>Buscar</span>
            </Link>

            {/* Mobile icons */}
            <Link
              to="/loja"
              className="md:hidden text-ivory/60 hover:text-gold p-2"
              onClick={closeMenu}
            >
              <Search size={20} />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-ivory/60 hover:text-gold p-2 -mr-2"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gold/10 pt-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                className="py-3 px-4 text-ivory/70 hover:text-gold hover:bg-noir-800/50 rounded-lg transition-all text-sm font-medium"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                to="/loja"
                className="py-3 px-4 text-ivory/70 hover:text-gold hover:bg-noir-800/50 rounded-lg transition-all text-sm font-medium"
                onClick={closeMenu}
              >
                Coleção
              </Link>
              <Link
                to="/marcas"
                className="py-3 px-4 text-ivory/70 hover:text-gold hover:bg-noir-800/50 rounded-lg transition-all text-sm font-medium"
                onClick={closeMenu}
              >
                Marcas
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
