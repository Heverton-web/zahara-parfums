import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className="relative w-full max-w-[360px] rounded-3xl shadow-2xl z-10 mx-auto overflow-hidden"
        style={{ 
          backgroundColor: '#0a0a0f',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(212, 175, 55, 0.1)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-noir-800 flex items-center justify-center text-ivory/40 hover:text-ivory hover:bg-noir-800 transition-all duration-200 z-20"
          style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
        >
          <X size={14} strokeWidth={1.5} />
        </button>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
