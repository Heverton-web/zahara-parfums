import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', sidebarCollapsed)
  }, [sidebarCollapsed])

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
    <div className="flex min-h-screen bg-noir-950">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(prev => !prev)} 
      />
      <main 
        className="flex-1 p-6 lg:p-8 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? '68px' : '256px' }}
      >
        <Outlet />
      </main>
    </div>
  )
}
