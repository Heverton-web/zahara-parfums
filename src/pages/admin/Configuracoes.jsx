import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Loader2, Instagram, Facebook, MessageCircle, Mail, Phone, MapPin, FileText } from 'lucide-react'
import Button from '../../components/ui/Button'

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-ivory placeholder-ivory/25 focus:outline-none transition-all bg-noir-800/50 border border-ivory/5 focus:border-gold/30 hover:border-ivory/10"

const configKeys = [
  { key: 'instagram_url', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/zaharaparfums' },
  { key: 'facebook_url', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/zaharaparfums' },
  { key: 'tiktok_url', label: 'TikTok', icon: MessageCircle, placeholder: 'https://tiktok.com/@zaharaparfums' },
  { key: 'whatsapp_numero', label: 'WhatsApp', icon: Phone, placeholder: '5511999999999' },
  { key: 'telefone', label: 'Telefone', icon: Phone, placeholder: '(11) 99999-9999' },
  { key: 'email_contato', label: 'E-mail', icon: Mail, placeholder: 'contato@zaharaparfums.com.br' },
  { key: 'endereco', label: 'Endereço', icon: MapPin, placeholder: 'São Paulo, SP - Brasil' },
  { key: 'footer_texto', label: 'Texto do Rodapé', icon: FileText, placeholder: 'Descrição da marca no rodapé...', multiline: true },
]

export default function Configuracoes() {
  const [config, setConfig] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchConfig()
  }, [])

  async function fetchConfig() {
    try {
      const { data, error } = await supabase
        .from('config')
        .select('chave, valor')

      if (error) throw error

      const map = {}
      for (const row of (data || [])) {
        map[row.chave] = row.valor || ''
      }
      setConfig(map)
    } catch (err) {
      console.error('Erro ao buscar config:', err)
    }
    setLoading(false)
  }

  function handleChange(key, value) {
    setConfig(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    try {
      for (const { key } of configKeys) {
        const valor = config[key] || ''
        const { error } = await supabase
          .from('config')
          .upsert({ chave: key, valor }, { onConflict: 'chave' })
        if (error) throw error
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Erro ao salvar config:', err)
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-ivory mb-2">
            Configurações
          </h1>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-gold/40 sm:from-gold/50 to-transparent" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto text-sm">
          {saving ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Save size={16} className="mr-2" />}
          {saved ? 'Salvo!' : 'Salvar'}
        </Button>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-bold text-ivory/70 mb-4">Redes Sociais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {configKeys.filter(c => c.key.includes('url') || c.key === 'whatsapp_numero').map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                <Icon size={12} className="inline mr-1.5" />
                {label}
              </label>
              <input
                type="url"
                value={config[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Contact Info */}
      <div className="mb-8">
        <h2 className="font-heading text-lg font-bold text-ivory/70 mb-4">Informações de Contato</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {configKeys.filter(c => c.key === 'telefone' || c.key === 'email_contato' || c.key === 'endereco').map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
                <Icon size={12} className="inline mr-1.5" />
                {label}
              </label>
              <input
                type="text"
                value={config[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div>
        <h2 className="font-heading text-lg font-bold text-ivory/70 mb-4">Rodapé</h2>
        {configKeys.filter(c => c.key === 'footer_texto').map(({ key, label, icon: Icon, placeholder, multiline }) => (
          <div key={key}>
            <label className="block text-ivory/50 text-xs font-accent uppercase tracking-wider mb-1.5">
              <Icon size={12} className="inline mr-1.5" />
              {label}
            </label>
            <textarea
              value={config[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
