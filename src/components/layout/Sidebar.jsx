import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, Zap, TrendingUp, Settings, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ collapsed, onToggle, mobile = false, onClose }) {
  const { signOut } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/marcas', icon: Tag, label: 'Marcas' },
    { to: '/admin/promocoes', icon: Zap, label: 'Promoções' },
    { to: '/admin/alterar-precos', icon: TrendingUp, label: 'Alterar Preços' },
    { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 admin-sidebar flex flex-col ${
        mobile ? 'w-64' : collapsed ? 'w-[68px]' : 'w-64'
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden" onClick={onClose}>
            <span className="text-gold text-xl">✦</span>
            {!collapsed && (
              <div className="flex flex-col leading-none">
                <span className="font-heading text-lg font-bold text-ivory">Zahara</span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-gold/50">Admin</span>
              </div>
            )}
          </Link>
          {!mobile && (
            <button
              onClick={onToggle}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ivory/30 hover:text-ivory/60 transition-all"
              style={{ border: '0.25px solid rgba(212, 175, 55, 0.1)' }}
            >
              {collapsed ? '→' : '←'}
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-gold/20 to-transparent mb-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-ivory/50 hover:text-ivory/80 hover:bg-noir-800/50'
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className={isActive ? 'text-gold' : ''} />
                {!collapsed && <span className="font-medium">{label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1.5">
          <div className="w-full h-px bg-gradient-to-r from-noir-700 to-transparent mb-3" />
          
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ivory/50 hover:text-ivory/80 hover:bg-noir-800/50 transition-all"
          >
            <ArrowLeft size={18} />
            {!collapsed && <span>Ver Loja</span>}
          </Link>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ivory/50 hover:text-wine hover:bg-noir-800/50 transition-all"
          >
            <LogOut size={18} />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
