import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { produtosMock, marcasMock } from '../data/mock'

// Verificar se o Supabase está configurado
const isSupabaseConfigured = import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_URL !== 'sua_url_aqui'

export function useProdutos(filtros = {}) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProdutos()
  }, [filtros.genero, filtros.marca, filtros.tag, filtros.ativo])

  async function fetchProdutos() {
    setLoading(true)

    // Se Supabase não está configurado, usar dados mock
    if (!isSupabaseConfigured) {
      setProdutos(filterProdutos(produtosMock, filtros))
      setLoading(false)
      return
    }

    // Tentar buscar do Supabase, fallback para mock se der erro
    try {
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

      if (error || !data || data.length === 0) {
        // Fallback para dados mock
        setProdutos(filterProdutos(produtosMock, filtros))
      } else {
        setProdutos(data)
      }
    } catch (err) {
      // Fallback para dados mock
      setProdutos(filterProdutos(produtosMock, filtros))
    }

    setLoading(false)
  }

  return { produtos, loading, refetch: fetchProdutos }
}

function filterProdutos(produtos, filtros) {
  let filtered = [...produtos]

  if (filtros.ativo !== undefined) {
    filtered = filtered.filter(p => p.ativo === filtros.ativo)
  }
  if (filtros.genero) {
    filtered = filtered.filter(p => p.genero === filtros.genero)
  }
  if (filtros.marca) {
    filtered = filtered.filter(p => p.marca_id === filtros.marca)
  }
  if (filtros.tag) {
    filtered = filtered.filter(p => p.tags?.includes(filtros.tag))
  }

  return filtered
}

export async function fetchProdutoById(id) {
  // Se Supabase não está configurado, usar dados mock
  if (!isSupabaseConfigured) {
    const produto = produtosMock.find(p => p.id === id)
    return { data: produto || null, error: produto ? null : new Error('Produto não encontrado') }
  }

  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('*, marcas(id, nome, logo_url)')
      .eq('id', id)
      .single()

    if (error || !data) {
      const produto = produtosMock.find(p => p.id === id)
      return { data: produto || null, error: produto ? null : new Error('Produto não encontrado') }
    }

    return { data, error }
  } catch (err) {
    const produto = produtosMock.find(p => p.id === id)
    return { data: produto || null, error: produto ? null : new Error('Produto não encontrado') }
  }
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

// Função para buscar marcas
export function useMarcas() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    setLoading(true)

    // Se Supabase não está configurado, usar dados mock
    if (!isSupabaseConfigured) {
      setMarcas(marcasMock)
      setLoading(false)
      return
    }

    // Tentar buscar do Supabase, fallback para mock
    try {
      const { data, error } = await supabase.from('marcas').select('*').order('nome')

      if (error || !data || data.length === 0) {
        setMarcas(marcasMock)
      } else {
        setMarcas(data)
      }
    } catch (err) {
      setMarcas(marcasMock)
    }

    setLoading(false)
  }

  return { marcas, loading, refetch: fetchMarcas }
}
