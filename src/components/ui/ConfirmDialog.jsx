import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const variants = {
    danger: {
      icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
      button: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      button: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400'
    }
  }

  const style = variants[variant] || variants.danger

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black" onClick={onClose} />
      
      <div 
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        style={{ 
          backgroundColor: '#0a0a0f',
          border: '1px solid rgba(212, 175, 55, 0.15)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-ivory/30 hover:text-ivory/60 transition-all duration-200 hover:bg-ivory/5"
        >
          <X size={14} strokeWidth={1.5} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-noir-800 flex items-center justify-center">
            {style.icon}
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-ivory">
              {title}
            </h3>
          </div>
        </div>

        <p className="text-ivory/60 text-sm mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl text-ivory/50 hover:text-ivory/70 text-sm font-medium transition-all duration-200"
            style={{ 
              backgroundColor: '#12121a',
              border: '0.25px solid rgba(212, 175, 55, 0.08)' 
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200 ${style.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
