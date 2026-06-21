import { useEffect, useState } from "react"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { useAppStore } from "../../store/appStore"
import "./Titlebar.css"

interface Props {
  onInfo: () => void
}

export default function Titlebar({ onInfo }: Props) {
  const platform = useAppStore(s => s.platform)
  const titlebarStyle = useAppStore(s => s.titlebarStyle)
  const [time, setTime] = useState("")
  const win = getCurrentWindow()

  useEffect(() => {
    function tick() {
      const now = new Date()
      setTime(now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="titlebar" data-tauri-drag-region>
      <div className="titlebar-left" data-tauri-drag-region>
        {titlebarStyle === "macos" ? (
          <>
            <div className="titlebar-dot dot-close" onClick={() => win.close()} />
            <div className="titlebar-dot dot-minimize" onClick={() => win.minimize()} />
            <div className="titlebar-dot dot-maximize" onClick={() => win.toggleMaximize()} />
          </>
        ) : null}
      </div>

      <div className="titlebar-center" data-tauri-drag-region>
        <span className="titlebar-title">Hercules</span>
        <span className="titlebar-platform">{platform}</span>
      </div>

      <div className="titlebar-right">
        {titlebarStyle === "native" ? (
          <div className="titlebar-native-controls">
            <button className="native-btn" onClick={() => win.minimize()} title="Minimizar">
              <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1"/></svg>
            </button>
            <button className="native-btn" onClick={() => win.toggleMaximize()} title="Maximizar">
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1"/></svg>
            </button>
            <button className="native-btn native-btn--close" onClick={() => win.close()} title="Cerrar">
              <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1"/><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1"/></svg>
            </button>
          </div>
        ) : null}
        <button className="titlebar-info-btn" onClick={onInfo} title="Acerca de Hercules">
          i
        </button>
        <span className="titlebar-time" data-tauri-drag-region>{time}</span>
      </div>
    </div>
  )
}
