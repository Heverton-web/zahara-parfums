import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const sizes = {
  sm: 'max-w-[400px]',
  md: 'max-w-[540px]',
  lg: 'max-w-[680px]',
  xl: 'max-w-[820px]',
}

export default function Modal({ isOpen, onClose, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div 
        className={`relative w-full ${sizes[size] || sizes.md} rounded-2xl shadow-2xl mx-auto max-h-[90vh] flex flex-col`}
        style={{ 
          backgroundColor: '#0a0a0f',
          border: '1px solid rgba(212, 175, 55, 0.12)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-ivory/30 hover:text-ivory hover:bg-ivory/5 transition-all duration-200 z-20"
          style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
        >
          <X size={14} strokeWidth={1.5} />
        </button>
        
        {/* Content - scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
