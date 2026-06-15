import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ProcessInfo } from '../types/process'

export function useProcesses(intervalMs = 3000) {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function refresh() {
    try {
      const data = await invoke<ProcessInfo[]>('get_processes')
      setProcesses(data)
      setLoading(false)
    } catch (e) {
      setError(String(e))
    }
  }

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  async function killProcess(pid: number): Promise<string> {
    const result = await invoke<string>('kill_process', { pid })
    await refresh()
    return result
  }

  return { processes, loading, error, killProcess, refresh }
}
