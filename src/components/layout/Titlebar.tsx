import { useEffect, useState } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useAppStore } from '../../store/appStore'
import './Titlebar.css'

interface Props {
  onInfo: () => void
}

export default function Titlebar({ onInfo }: Props) {
  const platform = useAppStore(s => s.platform)
  const [time, setTime] = useState('')
  const win = getCurrentWindow()

  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="titlebar" data-tauri-drag-region>
      <div className="titlebar-left" data-tauri-drag-region>
        <div className="titlebar-dot dot-close"    onClick={() => win.close()} />
        <div className="titlebar-dot dot-minimize" onClick={() => win.minimize()} />
        <div className="titlebar-dot dot-maximize" onClick={() => win.toggleMaximize()} />
      </div>

      <div className="titlebar-center" data-tauri-drag-region>
        <span className="titlebar-title">Hércules</span>
        <span className="titlebar-platform">{platform}</span>
      </div>

      <div className="titlebar-right">
        <button className="titlebar-info-btn" onClick={onInfo} title="Acerca de Hércules">
          ℹ
        </button>
        <span className="titlebar-time" data-tauri-drag-region>{time}</span>
      </div>
    </div>
  )
}
