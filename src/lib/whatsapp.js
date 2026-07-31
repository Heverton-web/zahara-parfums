import { supabase } from './supabase'

// Fallback caso o config não esteja carregado
const WHATSAPP_DEFAULT = '5519981868198'

let cachedNumero = null

async function getWhatsAppNumero() {
  if (cachedNumero) return cachedNumero
  try {
    const { data } = await supabase
      .from('config')
      .select('valor')
      .eq('chave', 'whatsapp_numero')
      .single()
    if (data?.valor) {
      cachedNumero = data.valor
      return cachedNumero
    }
  } catch {}
  return WHATSAPP_DEFAULT
}

export async function buildWhatsAppLink(produto, nomeUsuario) {
  const numero = await getWhatsAppNumero()
  const preco = Number(produto.preco_original) || 0
  const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
  const temPromocao = !emMassa && (produto.tags?.includes('promoção') || produto.tags?.includes('oferta relâmpago')) && Number(produto.preco_promocional)
  const precoFinal = emMassa ? Number(produto.preco_em_massa) : temPromocao ? Number(produto.preco_promocional) : preco

  const msg = `Olá! Me chamo *${nomeUsuario}* e vim pela Zahara Parfums!\n\nTenho interesse no perfume:\n*${produto.nome}*\nMarca: ${produto.marcas?.nome || 'N/A'}\nPreço: R$ ${precoFinal.toFixed(2)}${(temPromocao || emMassa) ? ` (de R$ ${preco.toFixed(2)})` : ''}\n\nConsulte condições de entrega!\nFrete grátis para Americana, Santa Bárbara D'Oeste e Nova Odessa em compras acima de R$ 400,00.\n\nGostaria de mais informações!`

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${numero}?text=${encoded}`
}
