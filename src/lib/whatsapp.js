// Número fixo do WhatsApp da Zahara Parfums
const WHATSAPP_NUMERO = '5519981868198'

export function buildWhatsAppLink(produto, nomeUsuario) {
  const msg = `Olá! Me chamo *${nomeUsuario}* e vim pela Zahara Parfums!

Tenho interesse no perfume:
*${produto.nome}*
Marca: ${produto.marcas?.nome || 'N/A'}
Preço: R$ ${produto.preco.toFixed(2)}

Gostaria de mais informações!`

  const encoded = encodeURIComponent(msg)
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encoded}`
}

// Função legada para compatibilidade
export async function getWhatsAppConfig() {
  return WHATSAPP_NUMERO
}
