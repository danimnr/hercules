import './CpuCores.css'

interface Props {
  cores: number[]
  loading?: boolean
}

function stressColor(pct: number): string {
  if (pct >= 80) return 'var(--danger)'
  if (pct >= 50) return 'var(--warning)'
  return 'var(--success)'
}

export default function CpuCores({ cores, loading }: Props) {
  if (loading || cores.length === 0) return null

  return (
    <div className="cpu-cores">
      <div className="cpu-cores__header">
        <span className="cpu-cores__title">Núcleos</span>
        <span className="cpu-cores__count">{cores.length} cores</span>
      </div>
      <div className="cpu-cores__grid">
        {cores.map((usage, i) => {
          const pct = Math.min(Math.max(usage, 0), 100)
          const color = stressColor(pct)
          return (
            <div key={i} className="core-item">
              <div className="core-item__bar-bg">
                <div
                  className="core-item__bar-fill"
                  style={{ height: `${pct}%`, background: color }}
                />
              </div>
              <span className="core-item__label">C{i + 1}</span>
              <span className="core-item__pct" style={{ color }}>{pct.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
