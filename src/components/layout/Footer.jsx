import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-gradient relative">
      {/* Top ornament */}
      <div className="flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/20 sm:via-gold/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="text-gold text-2xl sm:text-3xl font-accent">✦</span>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl sm:text-2xl font-bold text-gradient-gold tracking-wide">
                  Zahara
                </span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/50 sm:text-gold/60">
                  Parfums
                </span>
              </div>
            </div>
            
            <p className="font-display text-sm sm:text-base text-ivory/50 sm:text-ivory/60 italic mb-5 sm:mb-6 max-w-md">
              Descubra a exclusividade dos perfumes árabes. Fragrâncias importadas que despertam suas emoções e transportam você a um mundo de sofisticação.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Facebook size={16} />
              </a>
              <a
                href="mailto:contato@zaharaparfums.com.br"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-base sm:text-lg font-bold text-ivory mb-4 sm:mb-6">
              Navegação
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link to="/" className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60 hover:text-gold transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60 hover:text-gold transition-colors duration-300">
                  Coleção
                </Link>
              </li>
              <li>
                <Link to="/marcas" className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60 hover:text-gold transition-colors duration-300">
                  Marcas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base sm:text-lg font-bold text-ivory mb-4 sm:mb-6">
              Contato
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-2.5 sm:gap-3">
                <Phone size={14} className="text-gold/50 sm:text-gold/60 mt-0.5" />
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60">(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <Mail size={14} className="text-gold/50 sm:text-gold/60 mt-0.5" />
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60 break-all">contato@zaharaparfums.com.br</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <MapPin size={14} className="text-gold/50 sm:text-gold/60 mt-0.5" />
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60">São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gold/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-ivory/30 sm:text-ivory/40 text-xs sm:text-sm">
              © 2026 Zahara Parfums. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-2 text-ivory/30 sm:text-ivory/40 text-xs sm:text-sm">
              <span>Feito com</span>
              <span className="text-gold">✦</span>
              <span>para quem aprecia o fino</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
