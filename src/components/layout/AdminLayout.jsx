import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import { Menu, X } from 'lucide-react'

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fechar sidebar ao navegar
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-noir-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display text-ivory/50 italic">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-noir-950">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-noir-900 border-b border-gold/10 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-ivory/60 hover:text-gold transition-colors"
          style={{ border: '0.25px solid rgba(212, 175, 55, 0.15)' }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="font-heading text-lg font-bold text-ivory">Zahara Admin</span>
        <div className="w-10" /> {/* spacer */}
      </div>

      {/* Sidebar - desktop always visible, mobile overlay */}
      <div className="hidden lg:block">
        <Sidebar collapsed={false} />
      </div>

      {/* Sidebar - mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50">
            <Sidebar collapsed={false} mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="pt-20 lg:pt-8 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  )
}
