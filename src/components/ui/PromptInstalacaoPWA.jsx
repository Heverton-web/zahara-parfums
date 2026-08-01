import { useState, useEffect } from 'react'
import { Download, X, Share } from 'lucide-react'

export default function PromptInstalacaoPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showIOSPrompt, setShowIOSPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Checar se o usuário já dispensou nesta sessão
    if (sessionStorage.getItem('pwa_prompt_dismissed') === 'true') {
      setDismissed(true)
      return
    }

    // Detectar se é iOS Safari e não está rodando em standalone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches

    if (isIOS && !isStandalone) {
      setShowIOSPrompt(true)
    }

    // Escutar o evento de instalação nativo (Android/Chrome/Edge)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  function handleInstallClick() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA instalado pelo usuário')
      }
      setDeferredPrompt(null)
    })
  }

  function handleDismiss() {
    setDismissed(true)
    sessionStorage.setItem('pwa_prompt_dismissed', 'true')
  }

  if (dismissed) return null
  if (!deferredPrompt && !showIOSPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in">
      <div 
        className="bg-noir-900/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl relative border overflow-hidden"
        style={{ borderColor: 'rgba(212, 175, 55, 0.25)' }}
      >
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-ivory/30 hover:text-ivory p-1 rounded-full hover:bg-noir-800 transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0 shadow-lg">
            <span className="text-xl">✦</span>
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h4 className="font-heading font-bold text-sm text-ivory leading-snug">
              Zahara Parfums App
            </h4>
            <p className="text-ivory/50 text-xs mt-0.5 line-clamp-2">
              Instale para acesso rápido e ofertas exclusivas no seu celular
            </p>
          </div>
        </div>

        {/* Botão para Android/Desktop */}
        {deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="mt-3.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-gold via-gold-light to-gold text-noir-950 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-gold/20 transition-all"
          >
            <Download size={14} />
            <span>Instalar Aplicativo</span>
          </button>
        )}

        {/* Guia para iOS Safari */}
        {showIOSPrompt && !deferredPrompt && (
          <div className="mt-3 pt-3 border-t border-gold/10 flex items-center gap-2 text-[11px] text-ivory/60">
            <Share size={14} className="text-gold flex-shrink-0" />
            <span>Toque em <strong className="text-gold">Compartilhar</strong> e depois em <strong className="text-gold">Adicionar à Tela de Início</strong></span>
          </div>
        )}
      </div>
    </div>
  )
}
