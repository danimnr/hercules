import { useMetrics } from '../hooks/useMetrics'
import { usePlatform } from '../hooks/usePlatform'
import MetricCard from '../components/metrics/MetricCard'
import CpuCores from '../components/metrics/CpuCores'
import './Dashboard.css'

function formatKiB(kb: number): string {
  if (kb >= 1_048_576) return `${(kb / 1_048_576).toFixed(2)} GiB`
  if (kb >= 1_024)     return `${(kb / 1_024).toFixed(1)} MiB`
  return `${kb.toFixed(0)} KiB`
}

// Bytes/s → Mbps
function formatNetMbps(bytesPerSec: number): string {
  const mbps = (bytesPerSec * 8) / 1_000_000
  if (mbps >= 1000) return `${(mbps / 1000).toFixed(2)} Gbps`
  if (mbps >= 1)    return `${mbps.toFixed(1)} Mbps`
  const kbps = (bytesPerSec * 8) / 1_000
  return `${kbps.toFixed(0)} Kbps`
}

// Verde < 10 Mbps · Amarillo 10–100 Mbps · Rojo > 100 Mbps
function netStressPercent(bytesPerSec: number): number {
  const mbps = (bytesPerSec * 8) / 1_000_000
  if (mbps <= 0)   return 0
  if (mbps < 10)   return (mbps / 10) * 30           // 0–30% verde
  if (mbps < 100)  return 30 + ((mbps - 10) / 90) * 40  // 30–70% amarillo
  return Math.min(70 + ((mbps - 100) / 900) * 30, 100)  // 70–100% rojo
}

export default function Dashboard() {
  const { metrics, loading } = useMetrics(2000)
  usePlatform()

  const ram = metrics.ram
  const ramUsedPct = ram.total_kb > 0 ? (ram.used_kb / ram.total_kb) * 100 : 0

  const disk = metrics.disks[0]
  const diskUsedPct = disk && disk.total_kb > 0 ? (disk.used_kb / disk.total_kb) * 100 : 0

  const rx = metrics.network.bytes_received_per_sec
  const tx = metrics.network.bytes_sent_per_sec
  const netPct = netStressPercent(Math.max(rx, tx))

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="page-subtitle">
          {loading ? 'Conectando con el sistema…' : 'Monitorización en tiempo real'}
        </span>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="CPU"
          value={`${metrics.cpu.global_usage.toFixed(1)}%`}
          percent={metrics.cpu.global_usage}
          detail={`${metrics.cpu.core_count} núcleos · ${metrics.cpu.frequency_mhz} MHz`}
          loading={loading}
        />
        <MetricCard
          label="RAM"
          value={formatKiB(ram.used_kb)}
          percent={ramUsedPct}
          detail={`de ${formatKiB(ram.total_kb)} · ${formatKiB(ram.available_kb)} libre`}
          loading={loading}
        />
        <MetricCard
          label="Disco"
          value={disk ? formatKiB(disk.used_kb) : '—'}
          percent={diskUsedPct}
          detail={disk ? `de ${formatKiB(disk.total_kb)} · ${formatKiB(disk.total_kb - disk.used_kb)} libre` : 'Sin datos'}
          loading={loading}
        />
        <MetricCard
          label="Red"
          value={`↓ ${formatNetMbps(rx)}`}
          percent={netPct}
          detail={`↑ ${formatNetMbps(tx)}`}
          loading={loading}
        />
      </div>

      <CpuCores cores={metrics.cpu.per_core} loading={loading} />
    </div>
  )
}
