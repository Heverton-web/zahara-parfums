import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-noir-950/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md bg-noir-900 border border-noir-800 rounded-2xl p-6 shadow-luxury">
        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-gold/30 rounded-br-lg" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-xl font-bold text-ivory">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-noir-700 flex items-center justify-center text-ivory/50 hover:text-gold hover:border-gold/30 transition-all duration-300"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />
        
        {/* Content */}
        {children}
      </div>
    </div>
  )
}
