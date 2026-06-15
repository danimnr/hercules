import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ActionResult } from '../types/actions'
import './Actions.css'

interface Action {
  id: string
  label: string
  description: string
  icon: string
  command: string
}

const ACTIONS: Action[] = [
  {
    id: 'temp',
    label: 'Limpiar temporales',
    description: 'Elimina archivos de /tmp y /var/tmp',
    icon: '🗑',
    command: 'clear_temp_files',
  },
  {
    id: 'cache',
    label: 'Liberar caché',
    description: 'Limpia pagecache, dentries e inodes del kernel',
    icon: '⚡',
    command: 'clear_system_cache',
  },
  {
    id: 'ram',
    label: 'Liberar RAM',
    description: 'Libera la memoria inactiva del sistema',
    icon: '🧠',
    command: 'free_ram',
  },
]

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(2)} GB`
  if (bytes >= 1_048_576)     return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024)         return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

type ActionState = 'idle' | 'running' | 'success' | 'error'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface ActionCardProps {
  action: Action
  disabled: boolean
}

function ActionCard({ action, disabled }: ActionCardProps) {
  const [state, setState]   = useState<ActionState>('idle')
  const [result, setResult] = useState<ActionResult | null>(null)
  const [displayState, setDisplayState] = useState<ActionState>('idle')

  // displayState sigue a state pero con delay en la transición visual
  useEffect(() => {
    if (state === 'idle') {
      const t = setTimeout(() => setDisplayState('idle'), 600)
      return () => clearTimeout(t)
    }
    if (state === 'running') {
      setDisplayState('running')
    }
    if (state === 'success' || state === 'error') {
      // Pequeño delay antes de mostrar el resultado para que se vea el spinner terminar
      const t = setTimeout(() => setDisplayState(state), 300)
      return () => clearTimeout(t)
    }
  }, [state])

  async function run() {
    setState('running')
    setResult(null)

    const [res] = await Promise.all([
      invoke<ActionResult>(action.command).catch(e => ({
        success: false,
        message: String(e),
        freed_bytes: null,
      })) as Promise<ActionResult>,
      sleep(2500),
    ])

    setResult(res)
    setState(res.success ? 'success' : 'error')
    setTimeout(() => setState('idle'), 5000)
  }

  const isRunning = state === 'running'

  return (
    <div className={`action-card action-card--${displayState}`}>
      <div className="action-card__icon-wrap">
        <div className={`action-icon-slot ${displayState === 'running' ? 'slot--spin' : displayState === 'success' ? 'slot--success' : displayState === 'error' ? 'slot--error' : 'slot--idle'}`}>
          <span className="slot-idle">{action.icon}</span>
          <div className="slot-spinner" />
          <span className="slot-check">✓</span>
          <span className="slot-cross">✗</span>
        </div>
      </div>

      <div className="action-card__body">
        <span className="action-card__label">{action.label}</span>
        <span className="action-card__desc">{action.description}</span>

        <div className={`action-result ${displayState !== 'idle' && result ? 'action-result--visible' : ''}`}>
          {result && (
            <>
              <span>{result.message}</span>
              {result.freed_bytes != null && result.freed_bytes > 0 && (
                <span className="action-result__freed">
                  · {formatBytes(result.freed_bytes)} liberados
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <button
        className={`action-btn action-btn--${displayState}`}
        onClick={run}
        disabled={isRunning || disabled}
      >
        {isRunning ? 'Ejecutando…' : 'Ejecutar'}
      </button>
    </div>
  )
}

export default function Actions() {
  const [running, setRunning] = useState(false)

  return (
    <div className="actions">
      <div className="page-header">
        <h1 className="page-title">Acciones</h1>
        <span className="page-subtitle">Optimización y limpieza del sistema</span>
      </div>

      <div className="actions-grid">
        {ACTIONS.map(action => (
          <ActionCard
            key={action.id}
            action={action}
            disabled={running}
          />
        ))}
      </div>

      <div className="actions-note">
        <span>⚠</span>
        <span>Algunas acciones requieren permisos de administrador — aparecerá un diálogo de autenticación.</span>
      </div>
    </div>
  )
}
