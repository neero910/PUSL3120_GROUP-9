import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

function MainLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation sidebar"
        />
      )}

      <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onCloseSidebar={() => setSidebarOpen(false)} />
      </div>

      <div className="main-panel">
        <Header title={title} onToggleSidebar={() => setSidebarOpen((open) => !open)} />
        <main className="page-content">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout
