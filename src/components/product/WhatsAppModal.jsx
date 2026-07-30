import { useState } from 'react'
import { MessageCircle, ArrowRight, User } from 'lucide-react'
import Modal from '../ui/Modal'

export default function WhatsAppModal({ isOpen, onClose, produto, onConfirm }) {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) return
    setLoading(true)
    onConfirm(nome.trim())
    setNome('')
    setLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        {/* WhatsApp icon */}
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <MessageCircle className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-ivory mb-1">
          Falar no WhatsApp
        </h3>
        <p className="text-ivory/50 text-sm mb-5">
          Informe seu nome para atendimento personalizado
        </p>

        {/* Product Card */}
        {produto && (
          <div 
            className="flex items-center gap-3 p-3 rounded-xl mb-5 text-left"
            style={{ 
              backgroundColor: '#12121a',
              border: '0.25px solid rgba(212, 175, 55, 0.1)' 
            }}
          >
            {produto.imagem_url && (
              <img 
                src={produto.imagem_url} 
                alt={produto.nome}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gold/60 uppercase tracking-wider">
                Produto selecionado
              </p>
              <p className="text-ivory font-medium text-sm truncate">
                {produto.nome}
              </p>
              <p className="text-ivory/40 text-xs">
                {produto.marcas?.nome}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Input */}
          <div className="mb-4">
            <label className="block text-[10px] text-ivory/40 uppercase tracking-wider mb-2 text-left font-medium">
              Seu nome
            </label>
            <div className="relative">
              <User 
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                  isFocused ? 'text-gold/50' : 'text-ivory/20'
                }`} 
                strokeWidth={1.5}
              />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Como podemos te chamar?"
                required
                autoFocus
                className="input-whatsapp w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all duration-200"
                style={{ 
                  backgroundColor: isFocused ? '#1a1a24' : '#12121a',
                  border: isFocused 
                    ? '1px solid rgba(212, 175, 55, 0.3)' 
                    : '1px solid rgba(212, 175, 55, 0.08)'
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-ivory/50 hover:text-ivory/70 text-sm font-medium transition-all duration-200"
              style={{ 
                backgroundColor: '#12121a',
                border: '0.25px solid rgba(212, 175, 55, 0.08)' 
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !nome.trim()}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:from-emerald-500 hover:to-emerald-400 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Abrir WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
