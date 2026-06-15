import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Titlebar from './Titlebar'
import WelcomeModal from '../welcome/WelcomeModal'
import './Layout.css'

export default function Layout() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="app-window">
      <Titlebar onInfo={() => setShowInfo(true)} />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      <WelcomeModal key={showInfo ? 'open' : 'auto'} forceOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  )
}
