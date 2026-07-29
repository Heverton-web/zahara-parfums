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
