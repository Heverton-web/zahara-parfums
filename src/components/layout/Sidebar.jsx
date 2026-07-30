import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar() {
  const { signOut } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/marcas', icon: Tag, label: 'Marcas' },
  ]

  return (
    <aside className="admin-sidebar fixed left-0 top-0 bottom-0 w-64 z-40">
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <Link to="/admin" className="flex items-center gap-3 mb-10">
          <span className="text-gold text-2xl font-accent">✦</span>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-gradient-gold">
              Zahara
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-gold/50">
              Admin
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-gold/20 to-transparent mb-6" />

        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-ivory/50 hover:text-ivory hover:bg-noir-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-gold' : ''} />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-2">
          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-noir-700 to-transparent mb-4" />
          
          {/* Back to store */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-ivory/40 hover:text-gold transition-all duration-300"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Voltar à Loja</span>
          </Link>

          {/* Logout */}
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-ivory/40 hover:text-wine transition-all duration-300 w-full"
          >
            <LogOut size={18} />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
