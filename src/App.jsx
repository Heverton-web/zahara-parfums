import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/produto/:id" element={<Produto />} />
        <Route path="/marcas" element={<Marcas />} />

        {/* Rotas admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<AdminProdutos />} />
          <Route path="marcas" element={<MarcasAdmin />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
