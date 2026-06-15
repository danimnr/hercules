import './MetricCard.css'

interface Props {
  label: string
  value: string
  percent: number
  detail: string
  loading?: boolean
}

function stressColor(pct: number): string {
  if (pct >= 80) return 'var(--danger)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--success)'
}

export default function MetricCard({ label, value, percent, detail, loading }: Props) {
  const clamped = Math.min(Math.max(percent, 0), 100)
  const color = stressColor(clamped)

  return (
    <div className={`metric-card ${loading ? 'metric-card--loading' : ''}`}>
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        <span className="metric-card__value" style={{ color: loading ? undefined : color }}>
          {loading ? '—' : value}
        </span>
      </div>
      <div className="metric-bar">
        <div
          className="metric-bar__fill"
          style={{ width: loading ? '0%' : `${clamped}%`, background: color }}
        />
      </div>
      <span className="metric-card__detail">{loading ? 'Cargando…' : detail}</span>
    </div>
  )
}
