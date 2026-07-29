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
      const colors = ['#C9A84C', '#7a1c42', '#065f46', '#A0A0A0']
      setDispositivos(
        Object.entries(devs).map(([name, value], i) => ({
          name, value, color: colors[i % colors.length]
        }))
      )
    }
  }

  const statsCards = [
    {
      label: 'Produtos',
      value: `${stats.produtosAtivos}/${stats.totalProdutos}`,
      sublabel: 'ativos / total',
      icon: Package,
      color: 'text-gold',
    },
    {
      label: 'Views Hoje',
      value: stats.viewsHoje,
      icon: Eye,
      color: 'text-gold',
    },
    {
      label: 'Cliques Hoje',
      value: stats.cliquesHoje,
      icon: MousePointerClick,
      color: 'text-emerald-500',
    },
    {
      label: 'Taxa Conversão',
      value: `${stats.viewsHoje > 0 ? ((stats.cliquesHoje / stats.viewsHoje) * 100).toFixed(1) : 0}%`,
      icon: TrendingUp,
      color: 'text-gold',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-ivory mb-2">
          Dashboard
        </h1>
        <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className="group hover:border-gold/30 transition-all duration-300">
            <stat.icon className={`${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`} size={24} />
            <p className="text-ivory/50 text-sm font-accent uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-ivory">
              {stat.value}
            </p>
            {stat.sublabel && (
              <p className="text-xs text-ivory/30 mt-1">{stat.sublabel}</p>
            )}
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-heading text-lg font-bold text-ivory mb-4">
            Views vs Cliques
          </h2>
          <p className="text-ivory/40 text-xs mb-4">Últimos 7 dias</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={viewsChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="dia" stroke="#666" tick={{ fontSize: 11 }} />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(201, 168, 76, 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="views" fill="#C9A84C" name="Views" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cliques" fill="#065f46" name="Cliques" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="font-heading text-lg font-bold text-ivory mb-4">
            Top 5 Produtos
          </h2>
          <p className="text-ivory/40 text-xs mb-4">Últimos 7 dias</p>
          {topProdutos.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProdutos} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" width={120} stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#1a1a1a',
                    border: '1px solid rgba(201, 168, 76, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#C9A84C" name="Views" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              <p className="text-ivory/30 italic">Sem dados ainda</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-ivory mb-4">
            Dispositivos
          </h2>
          <p className="text-ivory/40 text-xs mb-4">Últimos 30 dias</p>
          {dispositivos.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dispositivos}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {dispositivos.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a1a',
                      border: '1px solid rgba(201, 168, 76, 0.2)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-ivory/30 italic">Sem dados ainda</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
