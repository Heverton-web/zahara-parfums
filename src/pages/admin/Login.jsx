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
    <div className="min-h-screen bg-noir-950 flex items-center justify-center px-6">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pattern-arabic opacity-20" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-gold text-4xl font-accent">✦</span>
          </div>
          <h1 className="font-heading text-3xl font-bold text-gradient-gold mb-2">
            Zahara
          </h1>
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-gold/60">
            Painel Administrativo
          </p>
        </div>

        {/* Login form */}
        <div className="relative">
          {/* Decorative corners */}
          <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-gold/30 rounded-tl-lg" />
          <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-gold/30 rounded-br-lg" />
          
          <form
            onSubmit={handleSubmit}
            className="bg-noir-900/80 backdrop-blur-sm border border-noir-800 rounded-2xl p-8"
          >
            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
              
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-wine/10 border border-wine/20">
                <p className="text-wine-300 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="mt-8">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-ivory/40 hover:text-gold text-sm transition-colors duration-300"
          >
            ← Voltar à loja
          </a>
        </div>
      </div>
    </div>
  )
}
