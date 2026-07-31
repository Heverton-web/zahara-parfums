import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Footer() {
  const [config, setConfig] = useState({})

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      const { data } = await supabase.from('config').select('chave, valor')
      if (data) {
        const map = {}
        for (const row of data) map[row.chave] = row.valor
        setConfig(map)
      }
    } catch {}
  }

  const instagram = config.instagram_url || '#'
  const facebook = config.facebook_url || '#'
  const tiktok = config.tiktok_url || '#'
  const whatsapp = config.whatsapp_numero || ''
  const telefone = config.telefone || '(11) 99999-9999'
  const email = config.email_contato || 'contato@zaharaparfums.com.br'
  const endereco = config.endereco || 'São Paulo, SP - Brasil'
  const footerTexto = config.footer_texto || 'Descubra a exclusividade dos perfumes árabes. Fragrâncias importadas que despertam suas emoções e transportam você a um mundo de sofisticação.'

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
              <div className="flex items-center gap-2">
                <span className="text-gold text-lg sm:text-xl">✦</span>
                <div className="flex flex-col leading-none">
                  <span className="font-heading text-xl sm:text-2xl font-bold text-ivory">
                    Zahara
                  </span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold/50 sm:text-gold/60">
                    Parfums
                  </span>
                </div>
              </div>
            </div>
            
            <p className="font-display text-sm sm:text-base text-ivory/50 sm:text-ivory/60 italic mb-5 sm:mb-6 max-w-md">
              {footerTexto}
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {instagram && instagram !== '#' && (
                <a href={instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300">
                  <Instagram size={16} />
                </a>
              )}
              {facebook && facebook !== '#' && (
                <a href={facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300">
                  <Facebook size={16} />
                </a>
              )}
              {tiktok && tiktok !== '#' && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.77a8.16 8.16 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.2z"/>
                  </svg>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.56-2.809 9.86 9.86 0 011.56-3.81l.235-.374-.998-3.648 3.741.982.361-.214a9.87 9.87 0 015.031-1.378h.004c2.74 0 5.013 1.85 5.718 4.35l.077.276c.458 1.62.458 3.18 0 4.6-.373 1.312-1.15 2.448-2.253 3.254m-4.338-8.03c-.208 0-.414.014-.618.041-.674.092-1.25.363-1.718.778l-.11.1-.693-1.86.11-.1c.738-.648 1.77-1.029 2.874-1.029.328 0 .65.039.963.115l.11.03c.18.064.35.145.512.24l.063.04c.38.233.69.543.903.903l.04.063c.095.162.176.332.24.512l.03.11c.076.313.115.635.115.963z"/>
                  </svg>
                </a>
              )}
              <a href={`mailto:${email}`}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gold/15 sm:border-gold/20 flex items-center justify-center text-gold/50 sm:text-gold/60 hover:text-gold hover:border-gold/40 transition-all duration-300">
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
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60">{telefone}</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <Mail size={14} className="text-gold/50 sm:text-gold/60 mt-0.5" />
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60 break-all">{email}</span>
              </li>
              <li className="flex items-start gap-2.5 sm:gap-3">
                <MapPin size={14} className="text-gold/50 sm:text-gold/60 mt-0.5" />
                <span className="text-sm sm:text-base text-ivory/50 sm:text-ivory/60">{endereco}</span>
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
