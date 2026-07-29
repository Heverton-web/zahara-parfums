import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  const { user, loading } = useAuth()

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
      <Sidebar />
      <main className="flex-1 p-8 ml-64">
        <Outlet />
      </main>
    </div>
  )
}
