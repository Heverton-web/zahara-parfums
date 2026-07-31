// Número fixo do WhatsApp da Zahara Parfums
const WHATSAPP_NUMERO = '5519981868198'

export function buildWhatsAppLink(produto, nomeUsuario) {
  const preco = Number(produto.preco_original) || 0
  const emMassa = produto.em_promocao_em_massa && produto.promocoes_em_massa?.data_fim && new Date(produto.promocoes_em_massa.data_fim) > new Date()
  const temPromocao = !emMassa && (produto.tags?.includes('promoção') || produto.tags?.includes('oferta relâmpago')) && Number(produto.preco_promocional)
  const precoFinal = emMassa ? Number(produto.preco_em_massa) : temPromocao ? Number(produto.preco_promocional) : preco

  const msg = `Olá! Me chamo *${nomeUsuario}* e vim pela Zahara Parfums!\n\nTenho interesse no perfume:\n*${produto.nome}*\nMarca: ${produto.marcas?.nome || 'N/A'}\nPreço: R$ ${precoFinal.toFixed(2)}${(temPromocao || emMassa) ? ` (de R$ ${preco.toFixed(2)})` : ''}\n\nConsulte condições de entrega!\nFrete grátis para Americana, Santa Bárbara D'Oeste e Nova Odessa em compras acima de R$ 400,00.\n\nGostaria de mais informações!`

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encoded}`
}

// Função legada para compatibilidade
export async function getWhatsAppConfig() {
  return WHATSAPP_NUMERO
}
