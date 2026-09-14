function GuestFullProfileModal({ guest, onClose, onStatusChange }) {
  if (!guest) return null

  const initials = guest.name ? guest.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'G'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="large-avatar">{initials}</div>
            <div>
              <h3 style={{ margin: 0 }}>{guest.name}</h3>
              <p className="muted-text" style={{ margin: 0, fontSize: '0.85rem' }}>Guest ID: {guest.id || 'GST-1024'}</p>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          <div className="guest-profile-summary-grid">
            <div className="profile-stat-box">
              <span>Status</span>
              <strong className={`status-badge ${(guest.status || 'active').toLowerCase().replace(/\s+/g, '-')}`}>
                {guest.status}
              </strong>
            </div>
            <div className="profile-stat-box">
              <span>Current Room</span>
              <strong>Room {guest.room}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Stay Duration</span>
              <strong>{guest.checkIn} → {guest.checkOut}</strong>
            </div>
          </div>

          <div className="section-block" style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Contact & Identification</h4>
            <div className="profile-details-list">
              <div><span>Phone:</span> <strong>{guest.contact || 'Not provided'}</strong></div>
              <div><span>NIC/Passport:</span> <strong>{guest.idNumber || 'Not provided'}</strong></div>
              <div><span>Email:</span> <strong>{guest.email || `${guest.name.toLowerCase().replace(/\s+/g, '.')}@guest.com`}</strong></div>
            </div>
          </div>

          <div className="section-block" style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Stay Preferences & History</h4>
            <div className="profile-details-list">
              <div><span>VIP Status:</span> <strong>Regular Guest</strong></div>
              <div><span>Special Requests:</span> <strong>Non-smoking floor, High floor preference</strong></div>
              <div><span>Total Stays:</span> <strong>3 Visits (Hotel Safron)</strong></div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {guest.status !== 'Checked In' && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => { onStatusChange?.(guest.id, 'Checked In'); onClose(); }}
              >
                ✓ Mark Checked In
              </button>
            )}
            {guest.status === 'Checked In' && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => { onStatusChange?.(guest.id, 'Checked Out'); onClose(); }}
              >
                ⟲ Mark Checked Out
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="secondary-button" onClick={() => alert(`Folio downloaded for ${guest.name}`)}>
              📥 Download Folio
            </button>
            <button type="button" className="primary-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuestFullProfileModal
