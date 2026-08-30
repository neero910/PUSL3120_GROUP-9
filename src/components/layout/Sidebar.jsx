import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navSections = [
  {
    title: 'Operations',
    items: [
      { label: 'Rooms', path: '/rooms' },
      { label: 'Housekeeping', path: '/housekeeping' },
      { label: 'Reservations', path: '/reservations' },
      { label: 'Guests', path: '/guests' },
      { label: 'Check-In', path: '/check-in' },
      { label: 'Check-Out', path: '/check-out' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Restaurant', path: '/restaurant' },
      { label: 'Payments', path: '/payments' },
      { label: 'Invoices', path: '/invoices' },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Reports', path: '/reports' },
      { label: 'Users', path: '/users' },
    ],
  },
]

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard' },
  ...navSections.flatMap((section) => section.items),
  { label: 'Settings', path: '/settings' },
]

const iconMap = {
  Dashboard: '◫',
  Rooms: '▣',
  Housekeeping: '🧹',
  Reservations: '☰',
  Guests: '◍',
  'Check-In': '✓',
  'Check-Out': '⟲',
  Restaurant: '☕',
  Payments: '₹',
  Invoices: '▤',
  Reports: '◔',
  Users: '◉',
  Settings: '⚙',
}

function Sidebar() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">HS</div>
        <div>
          <p className="eyebrow">HOTEL MANAGEMENT</p>
          <h2>Hotel Safron</h2>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon" aria-hidden="true">{iconMap[item.label] || '•'}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-role">{user.role}</p>
          </div>
        )}
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
