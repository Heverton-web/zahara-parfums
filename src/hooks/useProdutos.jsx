import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { produtosMock, marcasMock } from '../data/mock'

export function useProdutos(filtros = {}) {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProdutos()
  }, [filtros.genero, filtros.marca, filtros.tag, filtros.ativo])

  async function fetchProdutos() {
    setLoading(true)
    setError(null)

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

      query = query.order('nome', { ascending: true })

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.warn('Supabase indisponível, usando dados mock')
        setProdutos(produtosMock)
      } else {
        setProdutos(data || [])
      }
    } catch {
      console.warn('Supabase indisponível, usando dados mock')
      setProdutos(produtosMock)
    }

    setLoading(false)
  }

  return { produtos, loading, error, refetch: fetchProdutos }
}

export async function fetchProdutoById(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*, marcas(id, nome, logo_url)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProduto(produto) {
  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar produto:', error)
    throw error
  }
  return data
}

export async function updateProduto(id, updates) {
  const { data, error } = await supabase
    .from('produtos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao atualizar produto:', error)
    throw error
  }
  return data
}

export async function deleteProduto(id) {
  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao deletar produto:', error)
    throw error
  }
}

export async function toggleProdutoAtivo(id, currentAtivo) {
  const newAtivo = !currentAtivo
  
  const { data, error } = await supabase
    .from('produtos')
    .update({ ativo: newAtivo })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erro ao toggle produto:', error)
    throw error
  }
  
  return data
}

export function useMarcas() {
  const [marcas, setMarcas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMarcas()
  }, [])

  async function fetchMarcas() {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from('marcas')
        .select('*')
        .order('nome')

      if (fetchError) {
        console.warn('Supabase indisponível, usando dados mock')
        setMarcas(marcasMock)
      } else {
        setMarcas(data || [])
      }
    } catch {
      console.warn('Supabase indisponível, usando dados mock')
      setMarcas(marcasMock)
    }

    setLoading(false)
  }

  return { marcas, loading, error, refetch: fetchMarcas }
}
