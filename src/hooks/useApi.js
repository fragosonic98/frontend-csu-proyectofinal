/**  useApi.js — Hook personalizado para llamadas a la API
   
   ANALOGÍA: Es como contratar un "asistente" que hace el trabajo
   sucio por ti. Cada vez que necesitas datos de la API, en lugar
   de escribir 20 líneas de código con fetch, try/catch, estados
   de carga... solo le dices al asistente qué traer y él maneja todo.
   
   Sin hook: 20 líneas de código en cada componente
   Con hook:  const { data, loading, error } = useApi(alumnoAPI.getPerfil)
*/

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook genérico para llamadas a la API
 * @param {Function} fetchFn — La función de la API a llamar
 * @param {any} fallback — Valor mientras carga o si hay error
 * @param {boolean} immediate — Si debe llamar automáticamente al montar
 */
export function useApi(fetchFn, fallback = null, immediate = true) {
  const [data, setData]       = useState(fallback)
  const [loading, setLoading] = useState(immediate)
  const [error, setError]     = useState(null)

  // execute: llama la función de la API manualmente
  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  // Si immediate=true, llama automáticamente al montar el componente
  useEffect(() => {
    if (immediate) execute()
  }, []) // eslint-disable-line

  return { data, loading, error, execute, setData }
}

/**
 * Hook para mutaciones (POST, PUT, PATCH, DELETE)
 * No carga automáticamente — espera que lo llames tú
 */
export function useMutation(fetchFn) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(false)

  const mutate = async (...args) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const result = await fetchFn(...args)
      setSuccess(true)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error, success }
}
