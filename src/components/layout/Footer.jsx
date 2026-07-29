import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-gradient relative">
      {/* Top ornament */}
      <div className="flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gold text-3xl font-accent">✦</span>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-gradient-gold tracking-wide">
                  Zahara
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium -mt-1">
                  Parfums
                </span>
              </div>
            </div>
            
            <p className="font-display text-ivory/60 italic mb-6 max-w-md">
              Descubra a exclusividade dos perfumes árabes. Fragrâncias importadas que despertam suas emoções e transportam você a um mundo de sofisticação.
            </p>

            {/* Social links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
              <a
                href="mailto:contato@zaharaparfums.com.br"
                className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading text-lg font-bold text-ivory mb-6">
              Navegação
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  Coleção
                </Link>
              </li>
              <li>
                <Link to="/marcas" className="text-ivory/60 hover:text-gold transition-colors duration-300">
                  Marcas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-lg font-bold text-ivory mb-6">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold/60 mt-1" />
                <span className="text-ivory/60">(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold/60 mt-1" />
                <span className="text-ivory/60">contato@zaharaparfums.com.br</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold/60 mt-1" />
                <span className="text-ivory/60">São Paulo, SP - Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-ivory/40 text-sm">
              © 2026 Zahara Parfums. Todos os direitos reservados.
            </p>
            
            <div className="flex items-center gap-2 text-ivory/40 text-sm">
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
