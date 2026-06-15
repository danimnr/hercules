import { useEffect, useState } from 'react'
import './WelcomeModal.css'

const STORAGE_KEY = 'hercules_welcomed'

interface Props {
  forceOpen?: boolean
  onClose?: () => void
}

export default function WelcomeModal({ forceOpen = false, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (forceOpen) {
      setClosing(false)
      setVisible(true)
    }
  }, [forceOpen])

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY)
    if (!seen) setVisible(true)
  }, [])

  function close() {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      localStorage.setItem(STORAGE_KEY, '1')
      onClose?.()
    }, 300)
  }

  if (!visible) return null

  return (
    <div className={`modal-backdrop ${closing ? 'modal-backdrop--out' : ''}`} onClick={close}>
      <div
        className={`modal ${closing ? 'modal--out' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          <span className="modal__emoji">⚡</span>
          <h2 className="modal__title">Bienvenido a Hércules</h2>
          <p className="modal__subtitle">Monitor y optimizador del sistema</p>
        </div>

        <div className="modal__features">
          <div className="modal__feature">
            <span>⬡</span>
            <div>
              <strong>Dashboard en tiempo real</strong>
              <p>CPU, RAM, disco y red actualizándose cada 2 segundos</p>
            </div>
          </div>
          <div className="modal__feature">
            <span>☰</span>
            <div>
              <strong>Gestor de procesos</strong>
              <p>Ordena, filtra y termina procesos fácilmente</p>
            </div>
          </div>
          <div className="modal__feature">
            <span>🧹</span>
            <div>
              <strong>Acciones del sistema</strong>
              <p>Limpia temporales, caché y libera RAM con un clic</p>
            </div>
          </div>
        </div>

        <div className="modal__author">
          <p>Desarrollado por <a href="https://github.com/danimnr" target="_blank" rel="noopener noreferrer">danimnr</a></p>
          <p>Hércules es <strong>gratuito y open source</strong>. Si te resulta útil:</p>
          
            href="https://ko-fi.com/danidev_mnr"
            target="_blank"
            rel="noopener noreferrer"
            className="kofi-btn"
          >
            ☕ Apóyame en Ko-fi
          </a>
        </div>

        <button className="modal__close" onClick={close}>
          Empezar a usar Hércules →
        </button>
      </div>
    </div>
  )
}
