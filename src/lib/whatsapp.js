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
