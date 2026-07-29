import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Loja from './pages/Loja'
import Produto from './pages/Produto'
import Marcas from './pages/Marcas'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminProdutos from './pages/admin/Produtos'
import MarcasAdmin from './pages/admin/MarcasAdmin'
import AdminLayout from './components/layout/AdminLayout'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/loja" element={<PublicLayout><Loja /></PublicLayout>} />
          <Route path="/produto/:id" element={<PublicLayout><Produto /></PublicLayout>} />
          <Route path="/marcas" element={<PublicLayout><Marcas /></PublicLayout>} />

          {/* Rotas admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="produtos" element={<AdminProdutos />} />
            <Route path="marcas" element={<MarcasAdmin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
