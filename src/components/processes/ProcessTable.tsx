import { useState } from 'react'
import { ProcessInfo } from '../../types/process'
import './ProcessTable.css'

type SortKey = 'name' | 'cpu_usage' | 'memory_kb' | 'pid'
type SortDir = 'asc' | 'desc'

interface Props {
  processes: ProcessInfo[]
  loading: boolean
  onKill: (pid: number, name: string) => void
}

function formatMem(kb: number): string {
  if (kb >= 1_000_000) return `${(kb / 1_000_000).toFixed(1)} GB`
  if (kb >= 1_000)     return `${(kb / 1_000).toFixed(1)} MB`
  return `${kb} KB`
}

export default function ProcessTable({ processes, loading, onKill }: Props) {
  const [sortKey, setSortKey]   = useState<SortKey>('cpu_usage')
  const [sortDir, setSortDir]   = useState<SortDir>('desc')
  const [filter, setFilter]     = useState('')
  const [confirmPid, setConfirmPid] = useState<number | null>(null)

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = processes
    .filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1
      if (sortKey === 'name') return mul * a.name.localeCompare(b.name)
      return mul * (a[sortKey] - b[sortKey])
    })

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="sort-icon sort-icon--inactive">↕</span>
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="process-table-wrap">
      <div className="process-toolbar">
        <input
          className="process-filter"
          placeholder="Filtrar por nombre…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <span className="process-count">
          {filtered.length} procesos
        </span>
      </div>

      <div className="process-table-scroll">
        <table className="process-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="th-sortable">
                Nombre <SortIcon col="name" />
              </th>
              <th onClick={() => handleSort('pid')} className="th-sortable th-num">
                PID <SortIcon col="pid" />
              </th>
              <th onClick={() => handleSort('cpu_usage')} className="th-sortable th-num">
                CPU <SortIcon col="cpu_usage" />
              </th>
              <th onClick={() => handleSort('memory_kb')} className="th-sortable th-num">
                RAM <SortIcon col="memory_kb" />
              </th>
              <th className="th-num">Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-empty">Cargando procesos…</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">Sin resultados</td>
              </tr>
            ) : (
              filtered.map(p => (
                <tr key={p.pid} className={`process-row ${confirmPid === p.pid ? 'process-row--confirm' : ''}`}>
                  <td className="td-name">{p.name}</td>
                  <td className="td-num td-muted">{p.pid}</td>
                  <td className="td-num">
                    <span className={`cpu-badge ${p.cpu_usage > 50 ? 'cpu-badge--high' : p.cpu_usage > 20 ? 'cpu-badge--mid' : ''}`}>
                      {p.cpu_usage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="td-num">{formatMem(p.memory_kb)}</td>
                  <td className="td-num td-muted">{p.status}</td>
                  <td className="td-action">
                    {confirmPid === p.pid ? (
                      <div className="confirm-row">
                        <span className="confirm-text">¿Terminar?</span>
                        <button
                          className="btn-kill btn-kill--confirm"
                          onClick={() => { onKill(p.pid, p.name); setConfirmPid(null) }}
                        >Sí</button>
                        <button
                          className="btn-kill btn-kill--cancel"
                          onClick={() => setConfirmPid(null)}
                        >No</button>
                      </div>
                    ) : (
                      <button
                        className="btn-kill"
                        onClick={() => setConfirmPid(p.pid)}
                      >✕</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
