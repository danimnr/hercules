import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { SystemMetrics } from '../types/metrics'

const DEFAULT_METRICS: SystemMetrics = {
  cpu:     { global_usage: 0, per_core: [], frequency_mhz: 0, core_count: 0 },
  ram:     { total_kb: 0, used_kb: 0, available_kb: 0 },
  disks:   [],
  network: { bytes_received_per_sec: 0, bytes_sent_per_sec: 0 },
  timestamp: 0,
}

export function useMetrics(intervalMs = 2000) {
  const [metrics, setMetrics] = useState<SystemMetrics>(DEFAULT_METRICS)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetch() {
      try {
        const data = await invoke<SystemMetrics>('get_system_metrics')
        if (cancelled) return
        setMetrics(data)
        setLoading(false)
      } catch (e) {
        if (!cancelled) setError(String(e))
      }
    }

    fetch()
    const id = setInterval(fetch, intervalMs)
    return () => { cancelled = true; clearInterval(id) }
  }, [intervalMs])

  return { metrics, loading, error }
}
