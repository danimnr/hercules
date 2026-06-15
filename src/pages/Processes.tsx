import { useState } from 'react'
import { useProcesses } from '../hooks/useProcesses'
import ProcessTable from '../components/processes/ProcessTable'
import './Processes.css'

export default function Processes() {
  const { processes, loading, killProcess } = useProcesses(3000)
  const [toast, setToast] = useState<string | null>(null)

  async function handleKill(pid: number, name: string) {
    try {
      await killProcess(pid)
      showToast(`${name} (${pid}) terminado`)
    } catch (e) {
      showToast(`Error: ${e}`)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <div className="processes">
      <div className="page-header">
        <h1 className="page-title">Procesos</h1>
        <span className="page-subtitle">Top 100 procesos ordenados por CPU</span>
      </div>

      <ProcessTable
        processes={processes}
        loading={loading}
        onKill={handleKill}
      />

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  )
}
