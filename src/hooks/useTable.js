import { useEffect, useState } from 'react'
import { supabase } from '../libs/supabase.js'

/**
 * Loads published rows from a Supabase table, ordered by sort_order.
 * Falls back to local sample data if Supabase is not configured,
 * the request fails, or the table has no published rows.
 */
export function useTable(table, fallback) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!supabase) {
        setData(fallback)
        setUsingFallback(true)
        setLoading(false)
        return
      }

      const { data: rows, error } = await supabase
        .from(table)
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true })

      if (cancelled) return

      if (error || !rows || rows.length === 0) {
        if (error) console.error(`Supabase error loading "${table}":`, error.message)
        setData(fallback)
        setUsingFallback(true)
      } else {
        setData(rows)
        setUsingFallback(false)
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  return { data, loading, usingFallback }
}
