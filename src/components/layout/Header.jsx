import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

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
          : 'bg-noir-950 backdrop-blur-sm py-4'
      }`}
    >
      <div className="px-4 sm:px-6">
        <div className="flex justify-center">
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
        </div>
      </div>
    </header>
  )
}
