// Número fixo do WhatsApp da Zahara Parfums
const WHATSAPP_NUMERO = '5519981868198'

export function buildWhatsAppLink(produto, nomeUsuario) {
  const preco = Number(produto.preco_original) || 0
  const temPromocao = (produto.tags?.includes('promoção') || produto.tags?.includes('oferta relâmpago')) && Number(produto.preco_promocional)
  const precoFinal = temPromocao ? Number(produto.preco_promocional) : preco

  const msg = `Olá! Me chamo *${nomeUsuario}* e vim pela Zahara Parfums!

Tenho interesse no perfume:
*${produto.nome}*
Marca: ${produto.marcas?.nome || 'N/A'}
Preço: R$ ${precoFinal.toFixed(2)}${temPromocao ? ` (de R$ ${preco.toFixed(2)})` : ''}

Gostaria de mais informações!`

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encoded}`
}

// Função legada para compatibilidade
export async function getWhatsAppConfig() {
  return WHATSAPP_NUMERO
}
