import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import './Sidebar.css'

const NAV = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/processes', icon: '☰', label: 'Procesos'  },
  { to: '/actions',   icon: '⚡', label: 'Acciones'  },
]

const ACCENT_PRESETS = [
  '#7c6af7',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
]

export default function Sidebar() {
  const [showSettings, setShowSettings] = useState(false)
  const accent     = useAppStore(s => s.accent)
  const opacity    = useAppStore(s => s.opacity)
  const theme      = useAppStore(s => s.theme)
  const setAccent  = useAppStore(s => s.setAccent)
  const setOpacity = useAppStore(s => s.setOpacity)
  const setTheme   = useAppStore(s => s.setTheme)

  const isCustom = !ACCENT_PRESETS.includes(accent)

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
            }
          >
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-section">
              <span className="settings-label">Tema</span>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${theme === 'dark' ? 'theme-btn--active' : ''}`}
                  onClick={() => setTheme('dark')}
                >🌙 Oscuro</button>
                <button
                  className={`theme-btn ${theme === 'light' ? 'theme-btn--active' : ''}`}
                  onClick={() => setTheme('light')}
                >☀️ Claro</button>
              </div>
            </div>

            <div className="settings-section">
              <span className="settings-label">Color de acento</span>
              <div className="accent-presets">
                {ACCENT_PRESETS.map(color => (
                  <button
                    key={color}
                    className={`accent-dot ${accent === color ? 'accent-dot--active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setAccent(color)}
                  />
                ))}
                <label
                  className={`accent-custom-btn ${isCustom ? 'accent-dot--active' : ''}`}
                  style={{ background: isCustom ? accent : 'transparent' }}
                  title="Color personalizado"
                >
                  {!isCustom && <span className="accent-custom-icon">+</span>}
                  <input
                    type="color"
                    value={accent}
                    onChange={e => setAccent(e.target.value)}
                    className="accent-color-input"
                  />
                </label>
              </div>
            </div>

            <div className="settings-section">
              <span className="settings-label">Transparencia</span>
              <div className="slider-row">
                <input
                  type="range"
                  min="0.10"
                  max="1"
                  step="0.05"
                  value={opacity}
                  className="opacity-slider"
                  onChange={e => setOpacity(parseFloat(e.target.value))}
                />
                <span className="slider-value">{Math.round(opacity * 100)}%</span>
              </div>
            </div>
          </div>
        )}

        <button
          className={`sidebar-item sidebar-settings-btn ${showSettings ? 'sidebar-item--active' : ''}`}
          onClick={() => setShowSettings(s => !s)}
        >
          <span className="sidebar-icon">⚙</span>
          <span className="sidebar-label">Ajustes</span>
        </button>
      </div>
    </aside>
  )
}
