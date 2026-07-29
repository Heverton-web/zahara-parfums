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
