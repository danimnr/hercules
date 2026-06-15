import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Titlebar from './Titlebar'
import './Layout.css'

export default function Layout() {
  return (
    <div className="app-window">
      <Titlebar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
