function ReservationDetailsModal({ reservation, onClose, onUpdateStatus }) {
  if (!reservation) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0 }}>Reservation #{reservation.id}</h3>
            <p className="muted-text" style={{ margin: 0, fontSize: '0.85rem' }}>Status details & front desk actions</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          <div className="guest-profile-summary-grid">
            <div className="profile-stat-box">
              <span>Status</span>
              <strong className={`status-badge ${(reservation.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>
                {reservation.status}
              </strong>
            </div>
            <div className="profile-stat-box">
              <span>Room Number</span>
              <strong>Room {reservation.room}</strong>
            </div>
            <div className="profile-stat-box">
              <span>Total Amount</span>
              <strong style={{ color: 'var(--success)' }}>{reservation.amount}</strong>
            </div>
          </div>

          <div className="section-block" style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>Guest & Booking Details</h4>
            <div className="profile-details-list">
              <div><span>Guest Name:</span> <strong>{reservation.guest}</strong></div>
              <div><span>Stay Period:</span> <strong>{reservation.checkIn} to {reservation.checkOut}</strong></div>
              <div><span>Occupants:</span> <strong>{reservation.guests} Guests</strong></div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {reservation.status !== 'Checked In' && reservation.status !== 'Cancelled' && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => { onUpdateStatus?.(reservation.id, 'Checked In'); onClose(); }}
              >
                ✓ Check-In Guest
              </button>
            )}
            {reservation.status !== 'Cancelled' && (
              <button
                type="button"
                className="text-button"
                style={{ color: 'var(--danger)' }}
                onClick={() => { onUpdateStatus?.(reservation.id, 'Cancelled'); onClose(); }}
              >
                Cancel Booking
              </button>
            )}
          </div>
          <button type="button" className="primary-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReservationDetailsModal
