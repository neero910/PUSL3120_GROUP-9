import { useState } from 'react'

function EditPermissionsModal({ user, onClose, onSave }) {
  const [permissions, setPermissions] = useState({
    manageRooms: true,
    manageGuests: true,
    createBookings: true,
    processPayments: user?.role === 'Administrator' || user?.role === 'Accountant',
    systemSettings: user?.role === 'Administrator',
    viewReports: user?.role === 'Administrator' || user?.role === 'Manager',
  })

  if (!user) return null

  const handleToggle = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSave?.(user.id, permissions)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0 }}>Edit Permissions</h3>
            <p className="muted-text" style={{ margin: 0, fontSize: '0.85rem' }}>{user.name} ({user.role})</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSave} className="modal-body form-stack">
          <div className="permissions-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={permissions.manageRooms} onChange={() => handleToggle('manageRooms')} />
              <div>
                <strong>Manage Rooms & Status</strong>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.8rem' }}>Can change room cleaning status and room configurations</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={permissions.manageGuests} onChange={() => handleToggle('manageGuests')} />
              <div>
                <strong>Manage Guest Profiles</strong>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.8rem' }}>Can view and edit guest details and stay history</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={permissions.createBookings} onChange={() => handleToggle('createBookings')} />
              <div>
                <strong>Front Desk Operations</strong>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.8rem' }}>Can execute check-in, check-out, and create bookings</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={permissions.processPayments} onChange={() => handleToggle('processPayments')} />
              <div>
                <strong>Financial Settlements & Invoices</strong>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.8rem' }}>Can record payments and issue invoices</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={permissions.viewReports} onChange={() => handleToggle('viewReports')} />
              <div>
                <strong>Analytics & Reports</strong>
                <p className="muted-text" style={{ margin: 0, fontSize: '0.8rem' }}>Access to occupancy graphs, daily revenue, and auditing</p>
              </div>
            </label>
          </div>

          <div className="modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Save Permissions</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPermissionsModal
