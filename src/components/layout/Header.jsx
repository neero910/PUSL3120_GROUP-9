import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const defaultNotifications = [
  { id: 1, title: 'New Reservation', message: 'Reservation #RES-SEED-003 booked for Aisha Rahman.', time: '10m ago', unread: true },
  { id: 2, title: 'Room Cleaning Complete', message: 'Room 201 has been marked Clean & Ready.', time: '25m ago', unread: true },
  { id: 3, title: 'Payment Received', message: 'LKR 45,000 received for Invoice #INV-2026-001.', time: '1h ago', unread: true },
  { id: 4, title: 'Guest Check-in Alert', message: 'Maya Wickramasinghe scheduled for check-in today.', time: '2h ago', unread: false },
]

function Header({ title, onToggleSidebar }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(defaultNotifications)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notifRef = useRef(null)

  const unreadCount = notifications.filter(n => n.unread).length

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AU'

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  // Quick navigation search items
  const quickLinks = [
    { title: 'Room Directory & Status', path: '/rooms', category: 'Rooms' },
    { title: 'Housekeeping Task Board', path: '/housekeeping', category: 'Operations' },
    { title: 'Reservations & Bookings', path: '/reservations', category: 'Bookings' },
    { title: 'Guest Profiles & Stays', path: '/guests', category: 'Guests' },
    { title: 'Express Check-In Desk', path: '/check-in', category: 'Front Desk' },
    { title: 'Guest Check-Out & Billing', path: '/check-out', category: 'Front Desk' },
    { title: 'Restaurant & Dining Orders', path: '/restaurant', category: 'Services' },
    { title: 'Payment Settlements', path: '/payments', category: 'Finance' },
    { title: 'Invoices & Ledger', path: '/invoices', category: 'Finance' },
    { title: 'Reports & Revenue Analytics', path: '/reports', category: 'Analytics' },
    { title: 'Staff & User Access', path: '/users', category: 'Management' },
    { title: 'Hotel Settings & System Config', path: '/settings', category: 'System' },
  ]

  const filteredLinks = searchQuery.trim()
    ? quickLinks.filter(link =>
        link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : quickLinks

  const handleSelectLink = (path) => {
    setShowSearchModal(false)
    setSearchQuery('')
    navigate(path)
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-button" type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <h1>{title}</h1>
      </div>

      <div className="topbar-actions">
        {/* Quick Search Button */}
        <button
          type="button"
          className="icon-button"
          aria-label="Quick Search"
          title="Quick Search"
          onClick={() => setShowSearchModal(true)}
        >
          ⌕
        </button>

        {/* Notifications Popover */}
        <div className="notif-wrapper" ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            className="icon-button notif-btn"
            aria-label="Notifications"
            title="Notifications"
            onClick={() => setShowNotifications(prev => !prev)}
          >
            🔔
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notifications-popover">
              <div className="notif-header">
                <div>
                  <strong>Notifications</strong>
                  <span className="notif-pill">{unreadCount} new</span>
                </div>
                {unreadCount > 0 && (
                  <button type="button" className="text-button small-btn" onClick={markAllAsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-dot" />
                    <div className="notif-content">
                      <div className="notif-item-title">{n.title}</div>
                      <div className="notif-item-msg">{n.message}</div>
                      <div className="notif-item-time">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile" title={user?.email || 'Logged in'}>
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name || 'Admin User'}</div>
            <div className="user-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Administrator'}</div>
          </div>
        </div>
      </div>

      {/* Quick Search Modal */}
      {showSearchModal && (
        <div className="modal-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="modal-dialog search-modal" onClick={e => e.stopPropagation()}>
            <div className="search-modal-header">
              <span className="search-modal-icon">⌕</span>
              <input
                type="text"
                autoFocus
                placeholder="Type to search pages, rooms, guests, bookings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-modal-input"
              />
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowSearchModal(false)}
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
            <div className="search-modal-results">
              {filteredLinks.length === 0 ? (
                <div className="empty-state" style={{ padding: '24px 16px' }}>
                  No matching destinations found.
                </div>
              ) : (
                filteredLinks.map(link => (
                  <div
                    key={link.path}
                    className="search-result-item"
                    onClick={() => handleSelectLink(link.path)}
                  >
                    <div>
                      <strong>{link.title}</strong>
                      <span className="search-result-cat">{link.category}</span>
                    </div>
                    <span className="search-result-arrow">→</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

