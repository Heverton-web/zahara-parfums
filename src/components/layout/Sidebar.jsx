import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, LogOut } from 'lucide-react'
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
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-4">
      <Link to="/admin" className="font-display text-xl font-bold text-gold block mb-8">
        Zahara Admin
      </Link>

      <nav className="flex flex-col gap-2">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              location.pathname === to
                ? 'bg-gold/10 text-gold'
                : 'text-gray-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={signOut}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-zinc-800 mt-8 w-full transition-colors"
      >
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  )
}
