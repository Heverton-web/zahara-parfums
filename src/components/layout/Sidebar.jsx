import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, Zap, LogOut, ArrowLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ collapsed, onToggle }) {
  const { signOut } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/marcas', icon: Tag, label: 'Marcas' },
    { to: '/admin/promocoes', icon: Zap, label: 'Promoções' },
  ]

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 z-40 admin-sidebar transition-all duration-300 ease-in-out flex flex-col ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header - Logo + Toggle */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2.5 overflow-hidden">
            <span className="text-gold text-xl font-accent flex-shrink-0">✦</span>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-heading text-lg font-bold text-gradient-gold truncate">
                  Zahara
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-gold/50">
                  Admin
                </span>
              </div>
            )}
          </Link>
          
          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ivory/30 hover:text-gold hover:bg-gold/10 transition-all duration-200 flex-shrink-0"
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-gold/20 to-transparent mb-4" />

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {links.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 rounded-lg transition-all duration-200 ${
                  collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
                } ${
                  isActive
                    ? 'bg-gold/10 text-gold border border-gold/20'
                    : 'text-ivory/50 hover:text-ivory hover:bg-noir-800 border border-transparent'
                }`}
              >
                <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-gold' : ''}`} />
                {!collapsed && (
                  <>
                    <span className="font-medium text-sm">{label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="space-y-1.5">
          <div className="w-full h-px bg-gradient-to-r from-noir-700 to-transparent mb-3" />
          
          <Link
            to="/"
            title={collapsed ? 'Voltar à Loja' : undefined}
            className={`flex items-center gap-3 rounded-lg text-ivory/40 hover:text-gold transition-all duration-200 ${
              collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
            }`}
          >
            <ArrowLeft size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Voltar à Loja</span>}
          </Link>

          <button
            onClick={signOut}
            title={collapsed ? 'Sair' : undefined}
            className={`flex items-center gap-3 rounded-lg text-ivory/40 hover:text-wine transition-all duration-200 w-full ${
              collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
