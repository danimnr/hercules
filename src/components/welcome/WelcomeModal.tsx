import { useEffect, useState } from "react"
import "./WelcomeModal.css"
import { openUrl } from "@tauri-apps/plugin-opener"
import logo from "../../assets/hercules_logo.svg"

const STORAGE_KEY = "hercules_welcomed"

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
      localStorage.setItem(STORAGE_KEY, "1")
      onClose?.()
    }, 300)
  }

  async function openKofi() {
    await openUrl("https://ko-fi.com/danidev_mnr")
  }

  if (!visible) return null

  return (
    <div
      className={closing ? "modal-backdrop modal-backdrop--out" : "modal-backdrop"}
      onClick={close}
    >
      <div
        className={closing ? "modal modal--out" : "modal"}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal__header">
          <img src={logo} alt="Hercules" className="modal__logo" />
          <h2 className="modal__title">Bienvenido a Hercules</h2>
          <p className="modal__subtitle">Monitor y optimizador del sistema</p>
        </div>

        <div className="modal__features">
          <div className="modal__feature">
            <div>
              <strong>Dashboard en tiempo real</strong>
              <p>CPU, RAM, disco y red actualizandose cada 2 segundos</p>
            </div>
          </div>
          <div className="modal__feature">
            <div>
              <strong>Gestor de procesos</strong>
              <p>Ordena, filtra y termina procesos facilmente</p>
            </div>
          </div>
          <div className="modal__feature">
            <div>
              <strong>Acciones del sistema</strong>
              <p>Limpia temporales, cache y libera RAM con un clic</p>
            </div>
          </div>
        </div>

        <div className="modal__author">
          <p>Desarrollado por danimnr</p>
          <p>Hercules es gratuito y open source. Si te resulta util:</p>
          <button className="kofi-btn" onClick={openKofi}>
            Invitame a un cafe
          </button>
        </div>

        <button className="modal__close" onClick={close}>
          Empezar a usar Hercules
        </button>
      </div>
    </div>
  )
}
