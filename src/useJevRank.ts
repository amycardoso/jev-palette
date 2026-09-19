import { useEffect, useRef, useState } from 'react'

export interface RankEntry {
  id: string
  p: number
}

export interface RankResult {
  ranked: RankEntry[]
  confidence: number | null
  latencyMs: number
  usage: { input_tokens: number; output_tokens: number } | null
  costUsd: number
  model: string
  mock: boolean
}

interface State {
  result: RankResult | null
  loading: boolean
  error: string | null
}

const DEBOUNCE_MS = 200

/**
 * Debounced, abortable, cached ranking over /api/rank.
 * Keeps the last good result on screen while the next one is in flight.
 */
export function useJevRank(query: string): State {
  const [state, setState] = useState<State>({ result: null, loading: false, error: null })
  const cache = useRef(new Map<string, RankResult>())
  const inFlight = useRef<AbortController | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      inFlight.current?.abort()
      setState({ result: null, loading: false, error: null })
      return
    }
    const cached = cache.current.get(q)
    if (cached) {
      setState({ result: cached, loading: false, error: null })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    const timer = setTimeout(async () => {
      inFlight.current?.abort()
      const controller = new AbortController()
      inFlight.current = controller
      try {
        const res = await fetch('/api/rank', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
          signal: controller.signal,
        })
        const body = await res.json()
        if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
        cache.current.set(q, body)
        setState({ result: body, loading: false, error: null })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setState((s) => ({ ...s, loading: false, error: (err as Error).message }))
      }
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  return state
}
