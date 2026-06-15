import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Processes from './pages/Processes'
import Actions from './pages/Actions'
import { useAppStore } from './store/appStore'
import './index.css'

function App() {
  const accent  = useAppStore(s => s.accent)
  const opacity = useAppStore(s => s.opacity)
  const theme   = useAppStore(s => s.theme)

  useEffect(() => {
    const r = document.documentElement
    const hex = accent.replace('#', '')
    const bigint = parseInt(hex, 16)
    const red   = (bigint >> 16) & 255
    const green = (bigint >> 8)  & 255
    const blue  =  bigint        & 255

    r.style.setProperty('--accent',        accent)
    r.style.setProperty('--accent-rgb',    `${red}, ${green}, ${blue}`)
    r.style.setProperty('--accent-glow',   `rgba(${red},${green},${blue},0.25)`)
    r.style.setProperty('--accent-subtle', `rgba(${red},${green},${blue},0.08)`)
    r.style.setProperty('--accent-hover',  `rgba(${red},${green},${blue},0.15)`)
    r.style.setProperty('--border-accent', `rgba(${red},${green},${blue},0.3)`)

    const op = Math.max(opacity, 0.10)

    if (theme === 'light') {
      r.style.setProperty('--bg-base',      '#f5f5f7')
      r.style.setProperty('--bg-surface',   '#ffffff')
      r.style.setProperty('--bg-elevated',  '#ebebed')
      r.style.setProperty('--bg-glass',     `rgba(245,245,247,${op})`)
      r.style.setProperty('--bg-sidebar',   `rgba(235,235,237,${Math.min(op + 0.04, 1)})`)
      r.style.setProperty('--text-primary',   '#111113')
      r.style.setProperty('--text-secondary', '#5a5a6a')
      r.style.setProperty('--text-muted',     '#9a9aaa')
      r.style.setProperty('--border',         'rgba(0,0,0,0.08)')
      r.style.setProperty('--border-hover',   'rgba(0,0,0,0.14)')
    } else {
      r.style.setProperty('--bg-base',      '#0d0d0f')
      r.style.setProperty('--bg-surface',   '#141416')
      r.style.setProperty('--bg-elevated',  '#1c1c1f')
      r.style.setProperty('--bg-glass',     `rgba(13,13,15,${op})`)
      r.style.setProperty('--bg-sidebar',   `rgba(10,10,12,${Math.min(op + 0.04, 1)})`)
      r.style.setProperty('--text-primary',   '#f0f0f2')
      r.style.setProperty('--text-secondary', '#8a8a9a')
      r.style.setProperty('--text-muted',     '#52525e')
      r.style.setProperty('--border',         'rgba(255,255,255,0.06)')
      r.style.setProperty('--border-hover',   'rgba(255,255,255,0.12)')
    }
  }, [accent, opacity, theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="processes" element={<Processes />} />
          <Route path="actions"   element={<Actions />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
