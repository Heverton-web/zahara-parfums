# Zahara Parfums — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium perfume store with public catalog, WhatsApp checkout, and admin CRUD panel with tracking.

**Architecture:** React SPA with Vite + Tailwind CSS, Supabase for backend (auth, database, storage), React Router for routing. Admin panel protected by Supabase Auth. Tracking captures IP, user-agent, device, browser, OS, country, and fingerprint.

**Tech Stack:** React 18, Vite, Tailwind CSS, React Router 6, Supabase JS v2, ua-parser-js, Recharts, Lucide React (icons)

---

## File Structure

```
proj_omo-slim/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── .env
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── tracking.js
│   │   └── whatsapp.js
│   ├── hooks/
│   │   ├── useAuth.jsx
│   │   └── useProdutos.jsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Select.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── product/
│   │       ├── CardProduto.jsx
│   │       ├── ListaProdutos.jsx
│   │       ├── Filtros.jsx
│   │       └── FormProduto.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Loja.jsx
│       ├── Produto.jsx
│       ├── Marcas.jsx
│       ├── NotFound.jsx
│       └── admin/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Produtos.jsx
│           └── MarcasAdmin.jsx
```

---

### Task 1: Scaffold do Projeto

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `.env`
- Create: `src/main.jsx`
- Create: `src/index.css`

- [ ] **Step 1: Criar package.json**

```json
{
  "name": "zahara-parfums",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "ua-parser-js": "^1.0.38",
    "recharts": "^2.12.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.40",
    "autoprefixer": "^10.4.20"
  }
}
```

- [ ] **Step 2: Criar vite.config.js**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Criar tailwind.config.js**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#0A0A0A',
          900: '#1A1A1A',
          800: '#2A2A2A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8D5A3',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Criar postcss.config.js**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Criar index.html**

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Zahara Parfums</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  </head>
  <body class="bg-zinc-950 text-gray-100 font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Criar .env**

```
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

- [ ] **Step 7: Criar src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  min-height: 100vh;
}
```

- [ ] **Step 8: Criar src/main.jsx**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: Instalar dependências e testar**

Run: `npm install`
Expected: Sucesso sem erros

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold projeto Zahara Parfums com Vite + Tailwind"
```

---

### Task 2: Supabase Client + Rotas Base

**Files:**
- Create: `src/lib/supabase.js`
- Create: `src/App.jsx`

- [ ] **Step 1: Criar src/lib/supabase.js**

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Criar src/App.jsx com rotas base**

```jsx
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
```

- [ ] **Step 3: Criar páginas placeholder**

Crie arquivos temporários em `src/pages/`:
- `Home.jsx` → `<div>Home</div>`
- `Loja.jsx` → `<div>Loja</div>`
- `Produto.jsx` → `<div>Produto</div>`
- `Marcas.jsx` → `<div>Marcas</div>`
- `NotFound.jsx` → `<div>404</div>`
- `admin/Login.jsx` → `<div>Login</div>`
- `admin/Dashboard.jsx` → `<div>Dashboard</div>`
- `admin/Produtos.jsx` → `<div>Produtos</div>`
- `admin/MarcasAdmin.jsx` → `<div>Marcas Admin</div>`

- [ ] **Step 4: Criar AdminLayout placeholder**

```jsx
// src/components/layout/AdminLayout.jsx
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 5: Testar rotas**

Run: `npm run dev`
Expected: App roda, Home exibe "Home", `/admin` exibe "Dashboard"

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: adiciona Supabase client e rotas base"
```

---

### Task 3: Hooks de Autenticação

**Files:**
- Create: `src/hooks/useAuth.jsx`

- [ ] **Step 1: Criar src/hooks/useAuth.jsx**

```jsx
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

- [ ] **Step 2: Envolver App com AuthProvider**

Em `src/main.jsx`, adicione o AuthProvider:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './hooks/useAuth'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: adiciona hook useAuth com Supabase Auth"
```

---

### Task 4: Componentes UI

**Files:**
- Create: `src/components/ui/Button.jsx`
- Create: `src/components/ui/Input.jsx`
- Create: `src/components/ui/Card.jsx`
- Create: `src/components/ui/Badge.jsx`
- Create: `src/components/ui/Modal.jsx`
- Create: `src/components/ui/Select.jsx`

- [ ] **Step 1: Criar Button.jsx**

```jsx
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-gold text-zinc-950 hover:bg-gold-light',
    secondary: 'bg-zinc-800 text-gray-100 hover:bg-zinc-700 border border-zinc-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-400 hover:text-white hover:bg-zinc-800',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Criar Input.jsx**

```jsx
export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <input
        className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
}
```

- [ ] **Step 3: Criar Card.jsx**

```jsx
export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Criar Badge.jsx**

```jsx
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-zinc-800 text-gray-300',
    gold: 'bg-gold/20 text-gold',
    success: 'bg-green-500/20 text-green-400',
    danger: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 5: Criar Modal.jsx**

```jsx
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Criar Select.jsx**

```jsx
export default function Select({ label, options, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-400">{label}</label>}
      <select
        className={`bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: adiciona componentes UI (Button, Input, Card, Badge, Modal, Select)"
```

---

### Task 5: Layout (Header, Footer, Sidebar, AdminLayout)

**Files:**
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/Footer.jsx`
- Create: `src/components/layout/Sidebar.jsx`
- Create: `src/components/layout/AdminLayout.jsx` (substituir placeholder)

- [ ] **Step 1: Criar Header.jsx**

```jsx
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-gold">
          Zahara Parfums
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
          <Link to="/loja" className="text-gray-300 hover:text-white transition-colors">Loja</Link>
          <Link to="/marcas" className="text-gray-300 hover:text-white transition-colors">Marcas</Link>
        </nav>

        <Link to="/loja" className="text-gray-400 hover:text-white">
          <Search size={20} />
        </Link>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Criar Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-display text-xl font-bold text-gold">Zahara Parfums</h3>
            <p className="text-gray-400 text-sm mt-1">Perfumes importados de qualidade</p>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 Zahara Parfums. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Criar Sidebar.jsx**

```jsx
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
```

- [ ] **Step 4: Criar AdminLayout.jsx**

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'

export default function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-gray-400">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 5: Atualizar App.jsx com layout**

Modifique `src/App.jsx` para usar o Header/Footer nas rotas públicas:

```jsx
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
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: adiciona layout (Header, Footer, Sidebar, AdminLayout)"
```

---

### Task 6: Login Admin

**Files:**
- Modify: `src/pages/admin/Login.jsx`

- [ ] **Step 1: Criar Login.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl font-bold text-gold text-center mb-8">
          Zahara Admin
        </h1>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Testar login**

Run: `npm run dev`
Expected: `/admin/login` mostra formulário, credenciais inválidas dão erro, credenciais válidas redirecionam para `/admin`

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: implementa login admin com Supabase Auth"
```

---

### Task 7: Tracking System

**Files:**
- Create: `src/lib/tracking.js`
- Create: `src/hooks/useTracking.jsx`

- [ ] **Step 1: Criar src/lib/tracking.js**

```js
import { supabase } from './supabase'
import UAParser from 'ua-parser-js'

export function parseUserAgent(ua) {
  const parser = new UAParser(ua)
  const result = parser.getResult()

  return {
    navegador: result.browser.name || 'Desconhecido',
    so: result.os.name || 'Desconhecido',
    dispositivo: result.device.type || 'desktop',
  }
}

export async function getCountry(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await res.json()
    return data.country || 'Desconhecido'
  } catch {
    return 'Desconhecido'
  }
}

export function generateFingerprint() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('fingerprint', 2, 2)

  const components = [
    screen.width + 'x' + screen.height,
    navigator.language,
    navigator.plugins.length,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ]

  return components.join('|')
}

export async function registerEvent(produtoId, tipo, ip) {
  const ua = navigator.userAgent
  const parsed = parseUserAgent(ua)
  const fingerprint = generateFingerprint()
  const pais = await getCountry(ip)

  await supabase.from('tracking').insert({
    produto_id: produtoId,
    tipo,
    ip,
    user_agent: ua,
    dispositivo: parsed.dispositivo,
    navegador: parsed.navegador,
    so: parsed.so,
    pais,
    fingerprint,
    referrer: document.referrer || null,
  })
}
```

- [ ] **Step 2: Criar src/hooks/useTracking.jsx**

```jsx
import { useCallback } from 'react'
import { registerEvent } from '../lib/tracking'

export function useTracking() {
  const trackView = useCallback(async (produtoId) => {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const { ip } = await res.json()
      await registerEvent(produtoId, 'view', ip)
    } catch (err) {
      console.error('Erro ao registrar view:', err)
    }
  }, [])

  const trackClick = useCallback(async (produtoId) => {
    try {
      const res = await fetch('https://api.ipify.org?format=json')
      const { ip } = await res.json()
      await registerEvent(produtoId, 'click', ip)
    } catch (err) {
      console.error('Erro ao registrar clique:', err)
    }
  }, [])

  return { trackView, trackClick }
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: adiciona sistema de tracking (view, click, fingerprint)"
```

---

### Task 8: WhatsApp Helper

**Files:**
- Create: `src/lib/whatsapp.js`

- [ ] **Step 1: Criar src/lib/whatsapp.js**

```js
import { supabase } from './supabase'

export async function getWhatsAppConfig() {
  const { data } = await supabase
    .from('config')
    .select('valor')
    .eq('chave', 'whatsapp_numero')
    .single()

  return data?.valor || '5511999999999'
}

export function buildWhatsAppLink(numero, produto) {
  const msg = `Olá! Vim pela Zahara Parfums e tenho interesse no perfume:

*${produto.nome}*
Marca: ${produto.marcas?.nome || 'N/A'}
Preço: R$ ${produto.preco.toFixed(2)}

Gostaria de mais informações!`

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${numero}?text=${encoded}`
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: adiciona helper de WhatsApp com mensagem pré-formatada"
```

---

### Task 9: Hook de Produtos

**Files:**
- Create: `src/hooks/useProdutos.jsx`

- [ ] **Step 1: Criar src/hooks/useProdutos.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProdutos(filtros = {}) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProdutos()
  }, [filtros.genero, filtros.marca, filtros.tag, filtros.ativo])

  async function fetchProdutos() {
    setLoading(true)

    let query = supabase
      .from('produtos')
      .select('*, marcas(id, nome, logo_url)')

    if (filtros.ativo !== undefined) {
      query = query.eq('ativo', filtros.ativo)
    }

    if (filtros.genero) {
      query = query.eq('genero', filtros.genero)
    }

    if (filtros.marca) {
      query = query.eq('marca_id', filtros.marca)
    }

    if (filtros.tag) {
      query = query.contains('tags', [filtros.tag])
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (!error) {
      setProdutos(data)
    }

    setLoading(false)
  }

  return { produtos, loading, refetch: fetchProdutos }
}

export async function fetchProdutoById(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*, marcas(id, nome, logo_url)')
    .eq('id', id)
    .single()

  return { data, error }
}

export async function createProduto(produto) {
  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single()

  return { data, error }
}

export async function updateProduto(id, updates) {
  const { data, error } = await supabase
    .from('produtos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export async function deleteProduto(id) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  return { error }
}

export async function toggleProdutoAtivo(id, ativo) {
  const { data, error } = await supabase
    .from('produtos')
    .update({ ativo: !ativo })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: adiciona hook useProdutos com CRUD completo"
```

---

### Task 10: Componente CardProduto

**Files:**
- Create: `src/components/product/CardProduto.jsx`

- [ ] **Step 1: Criar CardProduto.jsx**

```jsx
import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import Badge from '../ui/Badge'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'warning',
  'oferta relâmpago': 'danger',
}

export default function CardProduto({ produto, onWhatsAppClick }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-gold/30 transition-colors">
      <Link to={`/produto/${produto.id}`}>
        <div className="aspect-square bg-zinc-800 overflow-hidden">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <ShoppingBag size={48} />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        {produto.tags?.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {produto.tags.map((tag) => (
              <Badge key={tag} variant={tagColors[tag] || 'default'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-gray-400 text-sm">{produto.marcas?.nome}</p>
        <Link to={`/produto/${produto.id}`}>
          <h3 className="font-semibold text-lg mt-1 hover:text-gold transition-colors">
            {produto.nome}
          </h3>
        </Link>
        <p className="text-gold font-bold text-xl mt-2">
          R$ {produto.preco.toFixed(2)}
        </p>

        <button
          onClick={() => onWhatsAppClick(produto)}
          className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar no WhatsApp
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: adiciona componente CardProduto com badges e botão WhatsApp"
```

---

### Task 11: Página Loja com Filtros

**Files:**
- Modify: `src/pages/Loja.jsx`
- Create: `src/components/product/Filtros.jsx`
- Create: `src/components/product/ListaProdutos.jsx`

- [ ] **Step 1: Criar Filtros.jsx**

```jsx
import Select from '../ui/Select'

const generos = [
  { value: '', label: 'Todos' },
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'unissex', label: 'Unissex' },
]

const tags = [
  { value: '', label: 'Todas' },
  { value: 'lançamento', label: 'Lançamento' },
  { value: 'promoção', label: 'Promoção' },
  { value: 'oferta relâmpago', label: 'Oferta Relâmpago' },
]

export default function Filtros({ filtros, onFiltroChange, marcas }) {
  const marcaOptions = [
    { value: '', label: 'Todas' },
    ...marcas.map((m) => ({ value: m.id, label: m.nome })),
  ]

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        label="Gênero"
        value={filtros.genero}
        onChange={(e) => onFiltroChange('genero', e.target.value)}
        options={generos}
      />
      <Select
        label="Marca"
        value={filtros.marca}
        onChange={(e) => onFiltroChange('marca', e.target.value)}
        options={marcaOptions}
      />
      <Select
        label="Tag"
        value={filtros.tag}
        onChange={(e) => onFiltroChange('tag', e.target.value)}
        options={tags}
      />
    </div>
  )
}
```

- [ ] **Step 2: Criar ListaProdutos.jsx**

```jsx
import CardProduto from './CardProduto'

export default function ListaProdutos({ produtos, onWhatsAppClick }) {
  if (produtos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhum produto encontrado.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produtos.map((produto) => (
        <CardProduto
          key={produto.id}
          produto={produto}
          onWhatsAppClick={onWhatsAppClick}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Criar Loja.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useProdutos } from '../hooks/useProdutos'
import { useTracking } from '../hooks/useTracking'
import { getWhatsAppConfig, buildWhatsAppLink } from '../lib/whatsapp'
import Filtros from '../components/product/Filtros'
import ListaProdutos from '../components/product/ListaProdutos'

export default function Loja() {
  const [filtros, setFiltros] = useState({ genero: '', marca: '', tag: '' })
  const [marcas, setMarcas] = useState([])
  const { produtos, loading } = useProdutos({ ...filtros, ativo: true })
  const { trackClick } = useTracking()

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  async function handleWhatsAppClick(produto) {
    await trackClick(produto.id)
    const numero = await getWhatsAppConfig()
    const link = buildWhatsAppLink(numero, produto)
    window.open(link, '_blank')
  }

  function handleFiltroChange(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">
        Nossos <span className="text-gold">Perfumes</span>
      </h1>

      <Filtros
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        marcas={marcas}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : (
        <ListaProdutos produtos={produtos} onWhatsAppClick={handleWhatsAppClick} />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: implementa página Loja com filtros e grid de produtos"
```

---

### Task 12: Página Home

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Criar Home.jsx**

```jsx
import { Link } from 'react-router-dom'
import { useProdutos } from '../hooks/useProdutos'

export default function Home() {
  const { produtos } = useProdutos({ ativo: true })

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-zinc-950" />
        <div className="relative text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
            Zahara <span className="text-gold">Parfums</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-md mx-auto">
            Perfumes importados que despertam suas emoções
          </p>
          <Link
            to="/loja"
            className="inline-block bg-gold text-zinc-950 font-semibold px-8 py-3 rounded-lg hover:bg-gold-light transition-colors"
          >
            Ver Coleção
          </Link>
        </div>
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold mb-8">
          Destaques
        </h2>

        {produtos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.slice(0, 3).map((produto) => (
              <Link
                key={produto.id}
                to={`/produto/${produto.id}`}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
              >
                <div className="aspect-square bg-zinc-800">
                  {produto.imagem_url ? (
                    <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">IMG</div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm">{produto.marcas?.nome}</p>
                  <h3 className="font-semibold text-lg">{produto.nome}</h3>
                  <p className="text-gold font-bold text-xl mt-2">R$ {produto.preco.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nenhum produto em destaque ainda.</p>
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: implementa página Home com hero e destaques"
```

---

### Task 13: Página Produto

**Files:**
- Modify: `src/pages/Produto.jsx`

- [ ] **Step 1: Criar Produto.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { fetchProdutoById } from '../hooks/useProdutos'
import { useTracking } from '../hooks/useTracking'
import { getWhatsAppConfig, buildWhatsAppLink } from '../lib/whatsapp'
import Badge from '../components/ui/Badge'

const tagColors = {
  'lançamento': 'gold',
  'promoção': 'warning',
  'oferta relâmpago': 'danger',
}

export default function Produto() {
  const { id } = useParams()
  const [produto, setProduto] = useState(null)
  const [loading, setLoading] = useState(true)
  const { trackView, trackClick } = useTracking()

  useEffect(() => {
    loadProduto()
  }, [id])

  async function loadProduto() {
    const { data } = await fetchProdutoById(id)
    if (data) {
      setProduto(data)
      trackView(data.id)
    }
    setLoading(false)
  }

  async function handleWhatsAppClick() {
    await trackClick(produto.id)
    const numero = await getWhatsAppConfig()
    const link = buildWhatsAppLink(numero, produto)
    window.open(link, '_blank')
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">Carregando...</div>
  }

  if (!produto) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">Produto não encontrado</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/loja" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8">
        <ArrowLeft size={18} />
        Voltar à loja
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
          {produto.imagem_url ? (
            <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <ShoppingBag size={96} />
            </div>
          )}
        </div>

        <div>
          {produto.tags?.length > 0 && (
            <div className="flex gap-2 mb-4">
              {produto.tags.map((tag) => (
                <Badge key={tag} variant={tagColors[tag] || 'default'}>{tag}</Badge>
              ))}
            </div>
          )}

          <p className="text-gray-400">{produto.marcas?.nome}</p>
          <h1 className="font-display text-4xl font-bold mt-2 mb-4">{produto.nome}</h1>
          <p className="text-gold text-3xl font-bold mb-6">R$ {produto.preco.toFixed(2)}</p>

          {produto.descricao && (
            <p className="text-gray-300 mb-8 leading-relaxed">{produto.descricao}</p>
          )}

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-lg"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Comprar no WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: implementa página de detalhe do produto"
```

---

### Task 14: Página Marcas

**Files:**
- Modify: `src/pages/Marcas.jsx`

- [ ] **Step 1: Criar Marcas.jsx**

```jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Marcas() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase
      .from('marcas')
      .select('*, produtos!inner(id, nome, imagem_url, preco, ativo)')
      .order('nome')

    if (data) {
      setMarcas(data.filter(m => m.produtos.some(p => p.ativo)))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">
        Nossas <span className="text-gold">Marcas</span>
      </h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : marcas.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nenhuma marca cadastrada.</div>
      ) : (
        <div className="space-y-12">
          {marcas.map((marca) => (
            <div key={marca.id}>
              <div className="flex items-center gap-4 mb-6">
                {marca.logo_url ? (
                  <img src={marca.logo_url} alt={marca.nome} className="h-12 w-12 object-contain" />
                ) : (
                  <div className="h-12 w-12 bg-zinc-800 rounded-full flex items-center justify-center text-gold font-bold">
                    {marca.nome[0]}
                  </div>
                )}
                <h2 className="font-display text-2xl font-bold">{marca.nome}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {marca.produtos.filter(p => p.ativo).slice(0, 4).map((produto) => (
                  <Link
                    key={produto.id}
                    to={`/produto/${produto.id}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-gold/30 transition-colors"
                  >
                    <div className="aspect-square bg-zinc-800">
                      {produto.imagem_url ? (
                        <img src={produto.imagem_url} alt={produto.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">IMG</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{produto.nome}</h3>
                      <p className="text-gold font-bold">R$ {produto.preco.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: implementa página Marcas com produtos"
```

---

### Task 15: Admin Dashboard

**Files:**
- Modify: `src/pages/admin/Dashboard.jsx`

- [ ] **Step 1: Criar Dashboard.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import { Package, Eye, MousePointerClick, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosAtivos: 0,
    viewsHoje: 0,
    cliquesHoje: 0,
  })
  const [viewsChart, setViewsChart] = useState([])
  const [topProdutos, setTopProdutos] = useState([])
  const [dispositivos, setDispositivos] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const [produtos, views, cliques, chartData, top, devices] = await Promise.all([
      supabase.from('produtos').select('id, ativo'),
      supabase.from('tracking').select('*').eq('tipo', 'view').gte('criado_em', hoje.toISOString()),
      supabase.from('tracking').select('*').eq('tipo', 'click').gte('criado_em', hoje.toISOString()),
      supabase.from('tracking').select('tipo, criado_em').gte('criado_em', new Date(Date.now() - 7 * 86400000).toISOString()),
      supabase.from('tracking').select('produto_id, produtos(nome)').eq('tipo', 'view').gte('criado_em', new Date(Date.now() - 7 * 86400000).toISOString()),
      supabase.from('tracking').select('dispositivo').gte('criado_em', new Date(Date.now() - 30 * 86400000).toISOString()),
    ])

    if (produtos.data) {
      setStats(prev => ({
        ...prev,
        totalProdutos: produtos.data.length,
        produtosAtivos: produtos.data.filter(p => p.ativo).length,
        viewsHoje: views.data?.length || 0,
        cliquesHoje: cliques.data?.length || 0,
      }))
    }

    // Processar dados do gráfico (7 dias)
    if (chartData.data) {
      const days = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000)
        const key = d.toISOString().split('T')[0]
        days[key] = { dia: key, views: 0, cliques: 0 }
      }
      chartData.data.forEach(item => {
        const key = item.criado_em.split('T')[0]
        if (days[key]) {
          days[key][item.tipo === 'view' ? 'views' : 'cliques']++
        }
      })
      setViewsChart(Object.values(days))
    }

    // Top produtos
    if (top.data) {
      const counts = {}
      top.data.forEach(item => {
        const nome = item.produtos?.nome || 'Desconhecido'
        counts[nome] = (counts[nome] || 0) + 1
      })
      const sorted = Object.entries(counts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }))
      setTopProdutos(sorted)
    }

    // Dispositivos
    if (devices.data) {
      const devs = {}
      devices.data.forEach(item => {
        devs[item.dispositivo] = (devs[item.dispositivo] || 0) + 1
      })
      const colors = ['#C9A84C', '#4CAF50', '#E53935', '#A0A0A0']
      setDispositivos(
        Object.entries(devs).map(([name, value], i) => ({
          name, value, color: colors[i % colors.length]
        }))
      )
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <Package className="text-gold mb-2" size={24} />
          <p className="text-gray-400 text-sm">Produtos</p>
          <p className="text-2xl font-bold">{stats.produtosAtivos}/{stats.totalProdutos}</p>
          <p className="text-xs text-gray-500">ativos / total</p>
        </Card>
        <Card>
          <Eye className="text-blue-400 mb-2" size={24} />
          <p className="text-gray-400 text-sm">Views Hoje</p>
          <p className="text-2xl font-bold">{stats.viewsHoje}</p>
        </Card>
        <Card>
          <MousePointerClick className="text-green-400 mb-2" size={24} />
          <p className="text-gray-400 text-sm">Cliques Hoje</p>
          <p className="text-2xl font-bold">{stats.cliquesHoje}</p>
        </Card>
        <Card>
          <TrendingUp className="text-gold mb-2" size={24} />
          <p className="text-gray-400 text-sm">Taxa Conversão</p>
          <p className="text-2xl font-bold">
            {stats.viewsHoje > 0 ? ((stats.cliquesHoje / stats.viewsHoje) * 100).toFixed(1) : 0}%
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Views vs Cliques (7 dias)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={viewsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
              <XAxis dataKey="dia" stroke="#A0A0A0" tick={{ fontSize: 12 }} />
              <YAxis stroke="#A0A0A0" />
              <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
              <Bar dataKey="views" fill="#C9A84C" name="Views" />
              <Bar dataKey="cliques" fill="#4CAF50" name="Cliques" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Top 5 Produtos (7 dias)</h2>
          {topProdutos.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProdutos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis type="number" stroke="#A0A0A0" />
                <YAxis dataKey="name" type="category" width={120} stroke="#A0A0A0" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
                <Bar dataKey="value" fill="#C9A84C" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados ainda</p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4">Dispositivos (30 dias)</h2>
          {dispositivos.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dispositivos}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dispositivos.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">Sem dados ainda</p>
          )}
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: implementa Dashboard admin com métricas e gráficos"
```

---

### Task 16: Admin CRUD Produtos

**Files:**
- Modify: `src/pages/admin/Produtos.jsx`
- Create: `src/components/product/FormProduto.jsx`

- [ ] **Step 1: Criar FormProduto.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const tagOptions = [
  { value: 'lançamento', label: 'Lançamento' },
  { value: 'promoção', label: 'Promoção' },
  { value: 'oferta relâmpago', label: 'Oferta Relâmpago' },
]

export default function FormProduto({ produto, onSuccess, onCancel }) {
  const [marcas, setMarcas] = useState([])
  const [form, setForm] = useState({
    nome: '',
    marca_id: '',
    genero: 'feminino',
    preco: '',
    descricao: '',
    tags: [],
    imagem: null,
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    fetchMarcas()
    if (produto) {
      setForm({
        nome: produto.nome || '',
        marca_id: produto.marca_id || '',
        genero: produto.genero || 'feminino',
        preco: produto.preco || '',
        descricao: produto.descricao || '',
        tags: produto.tags || [],
        imagem: null,
      })
      setPreview(produto.imagem_url || null)
    }
  }, [produto])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, imagem: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  function handleTagToggle(tag) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    let imagem_url = produto?.imagem_url || null

    if (form.imagem) {
      const fileExt = form.imagem.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { data: uploadData } = await supabase.storage
        .from('produtos')
        .upload(fileName, form.imagem)

      if (uploadData) {
        const { data: urlData } = supabase.storage
          .from('produtos')
          .getPublicUrl(uploadData.path)
        imagem_url = urlData.publicUrl
      }
    }

    const payload = {
      nome: form.nome,
      marca_id: form.marca_id || null,
      genero: form.genero,
      preco: parseFloat(form.preco),
      descricao: form.descricao,
      tags: form.tags,
      imagem_url,
    }

    if (produto) {
      await supabase.from('produtos').update(payload).eq('id', produto.id)
    } else {
      await supabase.from('produtos').insert(payload)
    }

    setLoading(false)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome do Produto"
        value={form.nome}
        onChange={(e) => setForm(prev => ({ ...prev, nome: e.target.value }))}
        required
      />

      <Select
        label="Marca"
        value={form.marca_id}
        onChange={(e) => setForm(prev => ({ ...prev, marca_id: e.target.value }))}
        options={[
          { value: '', label: 'Selecione...' },
          ...marcas.map(m => ({ value: m.id, label: m.nome }))
        ]}
      />

      <Select
        label="Gênero"
        value={form.genero}
        onChange={(e) => setForm(prev => ({ ...prev, genero: e.target.value }))}
        options={[
          { value: 'feminino', label: 'Feminino' },
          { value: 'masculino', label: 'Masculino' },
          { value: 'unissex', label: 'Unissex' },
        ]}
      />

      <Input
        label="Preço (R$)"
        type="number"
        step="0.01"
        min="0"
        value={form.preco}
        onChange={(e) => setForm(prev => ({ ...prev, preco: e.target.value }))}
        required
      />

      <div>
        <label className="text-sm text-gray-400 block mb-1">Descrição</label>
        <textarea
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold h-24"
          value={form.descricao}
          onChange={(e) => setForm(prev => ({ ...prev, descricao: e.target.value }))}
        />
      </div>

      <div>
        <label className="text-sm text-gray-400 block mb-2">Tags</label>
        <div className="flex gap-2">
          {tagOptions.map(tag => (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagToggle(tag.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                form.tags.includes(tag.value)
                  ? 'bg-gold/20 border-gold text-gold'
                  : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-400 block mb-1">Imagem</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:text-gray-300 hover:file:bg-zinc-700"
        />
        {preview && (
          <img src={preview} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-lg" />
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : produto ? 'Salvar Alterações' : 'Criar Produto'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Criar Produtos.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useProdutos, toggleProdutoAtivo, deleteProduto } from '../../hooks/useProdutos'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import FormProduto from '../../components/product/FormProduto'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'

export default function AdminProdutos() {
  const [marcas, setMarcas] = useState([])
  const [filtros, setFiltros] = useState({ ativo: undefined })
  const { produtos, loading, refetch } = useProdutos(filtros)
  const [modalOpen, setModalOpen] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
  }

  function handleEdit(produto) {
    setProdutoEditando(produto)
    setModalOpen(true)
  }

  function handleNew() {
    setProdutoEditando(null)
    setModalOpen(true)
  }

  async function handleDelete(id) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduto(id)
      refetch()
    }
  }

  async function handleToggle(produto) {
    await toggleProdutoAtivo(produto.id, produto.ativo)
    refetch()
  }

  function handleSuccess() {
    setModalOpen(false)
    setProdutoEditando(null)
    refetch()
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold flex-1"
        />
        <select
          value={filtros.ativo === undefined ? '' : filtros.ativo.toString()}
          onChange={(e) => setFiltros({
            ativo: e.target.value === '' ? undefined : e.target.value === 'true'
          })}
          className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:border-gold"
        >
          <option value="">Todos</option>
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Produto</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Marca</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Gênero</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Preço</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Tags</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-gray-500">Nenhum produto encontrado</td>
              </tr>
            ) : (
              produtosFiltrados.map((produto) => (
                <tr key={produto.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {produto.imagem_url ? (
                        <img src={produto.imagem_url} alt="" className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center text-gray-600 text-xs">IMG</div>
                      )}
                      <span>{produto.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{produto.marcas?.nome || '-'}</td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{produto.genero}</td>
                  <td className="px-4 py-3 text-gold font-medium">R$ {produto.preco.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {produto.tags?.map(tag => (
                        <Badge key={tag} variant="gold">{tag}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={produto.ativo ? 'success' : 'danger'}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(produto)}
                        className="text-gray-400 hover:text-gold transition-colors"
                        title={produto.ativo ? 'Inativar' : 'Ativar'}
                      >
                        {produto.ativo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                      <button
                        onClick={() => handleEdit(produto)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(produto.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setProdutoEditando(null) }}
        title={produtoEditando ? 'Editar Produto' : 'Novo Produto'}
      >
        <FormProduto
          produto={produtoEditando}
          onSuccess={handleSuccess}
          onCancel={() => { setModalOpen(false); setProdutoEditando(null) }}
        />
      </Modal>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: implementa CRUD de produtos no admin"
```

---

### Task 17: Admin CRUD Marcas

**Files:**
- Modify: `src/pages/admin/MarcasAdmin.jsx`

- [ ] **Step 1: Criar MarcasAdmin.jsx**

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function MarcasAdmin() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [marcaEditando, setMarcaEditando] = useState(null)
  const [nome, setNome] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    const { data } = await supabase.from('marcas').select('*').order('nome')
    if (data) setMarcas(data)
    setLoading(false)
  }

  function handleNew() {
    setMarcaEditando(null)
    setNome('')
    setModalOpen(true)
  }

  function handleEdit(marca) {
    setMarcaEditando(marca)
    setNome(marca.nome)
    setModalOpen(true)
  }

  async function handleDelete(id) {
    if (confirm('Excluir esta marca? Produtos ficarão sem marca.')) {
      await supabase.from('marcas').delete().eq('id', id)
      fetchMarcas()
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    if (marcaEditando) {
      await supabase.from('marcas').update({ nome }).eq('id', marcaEditando.id)
    } else {
      await supabase.from('marcas').insert({ nome })
    }

    setSaving(false)
    setModalOpen(false)
    fetchMarcas()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button onClick={handleNew}>
          <Plus size={18} className="mr-2" />
          Nova Marca
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Marca</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-400">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="px-4 py-8 text-center text-gray-400">Carregando...</td>
              </tr>
            ) : marcas.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-4 py-8 text-center text-gray-500">Nenhuma marca cadastrada</td>
              </tr>
            ) : (
              marcas.map((marca) => (
                <tr key={marca.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {marca.logo_url ? (
                        <img src={marca.logo_url} alt="" className="h-8 w-8 object-contain" />
                      ) : (
                        <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center text-gold text-sm font-bold">
                          {marca.nome[0]}
                        </div>
                      )}
                      <span>{marca.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(marca)}
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(marca.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setMarcaEditando(null) }}
        title={marcaEditando ? 'Editar Marca' : 'Nova Marca'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome da Marca"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : marcaEditando ? 'Salvar' : 'Criar'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => { setModalOpen(false); setMarcaEditando(null) }}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: implementa CRUD de marcas no admin"
```

---

### Task 18: SQL do Banco de Dados

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Criar schema.sql**

```sql
-- Tabela de marcas
CREATE TABLE marcas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  logo_url TEXT
);

-- Tabela de produtos
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  marca_id UUID REFERENCES marcas(id) ON DELETE SET NULL,
  genero TEXT CHECK (genero IN ('feminino', 'masculino', 'unissex')),
  preco NUMERIC(10,2) NOT NULL,
  imagem_url TEXT,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de tracking
CREATE TABLE tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  tipo TEXT CHECK (tipo IN ('view', 'click')),
  ip TEXT,
  user_agent TEXT,
  dispositivo TEXT,
  navegador TEXT,
  so TEXT,
  pais TEXT,
  referrer TEXT,
  fingerprint TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

-- Tabela de config
CREATE TABLE config (
  chave TEXT PRIMARY KEY,
  valor TEXT
);

-- Config inicial
INSERT INTO config (chave, valor) VALUES
  ('whatsapp_numero', '5511999999999');

-- Índices para performance
CREATE INDEX idx_produtos_ativo ON produtos(ativo);
CREATE INDEX idx_produtos_marca ON produtos(marca_id);
CREATE INDEX idx_tracking_produto ON tracking(produto_id);
CREATE INDEX idx_tracking_tipo ON tracking(tipo);
CREATE INDEX idx_tracking_criado ON tracking(criado_em);

-- RLS (Row Level Security)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (leitura)
CREATE POLICY "Produtos ativos são públicos" ON produtos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Marcas são públicas" ON marcas
  FOR SELECT USING (true);

-- Políticas admin (tudo)
CREATE POLICY "Admin pode tudo em produtos" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em marcas" ON marcas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode tudo em config" ON config
  FOR ALL USING (auth.role() = 'authenticated');

-- Tracking: inserção anônima permitida
CREATE POLICY "Anyone can insert tracking" ON tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin pode ler tracking" ON tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Storage bucket para imagens
INSERT INTO storage.buckets (id, name, public) VALUES ('produtos', 'produtos', true);

CREATE POLICY "Imagens são públicas" ON storage.objects
  FOR SELECT USING (bucket_id = 'produtos');

CREATE POLICY "Admin pode upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'produtos' AND auth.role() = 'authenticated');
```

- [ ] **Step 2: Executar no Supabase**

Copie e cole o SQL acima no SQL Editor do painel Supabase.

- [ ] **Step 3: Criar conta de admin no Supabase**

No painel Supabase → Authentication → Users → Invite User:
- Email: seu@email.com
- Defina uma senha

- [ ] **Step 4: Atualizar .env com credenciais reais**

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: adiciona schema SQL do banco de dados"
```

---

### Task 19: Teste Final e Deploy

**Files:** Nenhum novo arquivo

- [ ] **Step 1: Rodar projeto localmente**

Run: `npm run dev`
Expected: App roda sem erros

- [ ] **Step 2: Testar fluxo público**

1. Home carrega com hero
2. Loja mostra produtos (ou mensagem vazio)
3. Filtros funcionam
4. Produto detalhe carrega
5. Botão WhatsApp abre link

- [ ] **Step 3: Testar fluxo admin**

1. `/admin/login` mostra formulário
2. Login com credenciais do Supabase funciona
3. Dashboard mostra métricas
4. Criar produto funciona
5. Editar produto funciona
6. Ativar/inativar funciona
7. Excluir funciona
8. Criar/editar marca funciona

- [ ] **Step 4: Build para produção**

Run: `npm run build`
Expected: Pasta `dist/` criada sem erros

- [ ] **Step 5: Deploy no Vercel**

1. Crie conta no Vercel
2. Conecte o repositório Git
3. Configure as env vars do Supabase
4. Deploy automático

- [ ] **Step 6: Commit final**

```bash
git add .
git commit -m "feat: Zahara Parfums v1.0 completo"
```
