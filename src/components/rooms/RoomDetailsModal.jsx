function RoomDetailsModal({ room, onClose, onEdit, onQuickStatusChange, onAssignAttendant }) {
  if (!room) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content room-details-modal">
        <div className="modal-header">
          <div className="room-modal-title-group">
            <span className="eyebrow">ROOM PROFILE • FLOOR {room.floor}</span>
            <div className="room-header-flex">
              <h2>Room {room.roomNumber}</h2>
              <span className="room-modal-type-tag">{room.type}</span>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close details">✕</button>
        </div>

        <div className="modal-body form-stack">
          {/* Status highlight strip */}
          <div className="room-status-strip">
            <div>
              <span className="field-label">Current Status</span>
              <div style={{ marginTop: '6px' }}>
                <span className={`status-badge ${room.status.toLowerCase()}`}>{room.status}</span>
              </div>
            </div>

            <div>
              <span className="field-label">Housekeeping State</span>
              <div style={{ marginTop: '6px' }}>
                <span className={`status-badge ${room.housekeepingStatus === 'Clean & Ready' ? 'available' : room.housekeepingStatus === 'In Progress' ? 'pending' : room.housekeepingStatus === 'Dirty / Needs Clean' ? 'cancelled' : 'scheduled'}`}>
                  {room.housekeepingStatus}
                </span>
              </div>
            </div>

            <div>
              <span className="field-label">Rate / Night</span>
              <div className="room-rate-highlight">
                LKR {room.price.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick status switcher */}
          <div className="room-quick-status-box">
            <label className="field-label" htmlFor="modal-status-change">Quick Change Room Status:</label>
            <div className="status-btn-group">
              {['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-pill-btn ${room.status === st ? 'active' : ''}`}
                  onClick={() => onQuickStatusChange(room.id, st)}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="room-specs-grid">
            <div className="spec-card">
              <span className="spec-label">Bed Setup</span>
              <strong>🛏️ {room.bedType || 'King Bed'}</strong>
            </div>
            <div className="spec-card">
              <span className="spec-label">Capacity</span>
              <strong>👥 Max {room.capacity || 2} Guests</strong>
            </div>
            <div className="spec-card">
              <span className="spec-label">Orientation / View</span>
              <strong>🌅 {room.view || 'Scenic View'}</strong>
            </div>
            <div className="spec-card">
              <span className="spec-label">Assigned Attendant</span>
              <strong>🧹 {room.assignedAttendant || 'Unassigned'}</strong>
            </div>
          </div>

          {/* Current Occupant Details */}
          {room.currentGuest && (
            <div className="guest-info-card">
              <div className="guest-info-header">
                <span>Current Occupant / Reservation</span>
                <span className="status-badge checked-in">Active Stay</span>
              </div>
              <div className="guest-info-body">
                <strong>👤 {room.currentGuest}</strong>
                <p className="muted-text">Last cleaned: {room.lastCleaned || 'Today'}</p>
              </div>
            </div>
          )}

          {/* Amenities Chips */}
          <div>
            <span className="field-label">Room Amenities & Features</span>
            <div className="amenities-wrap">
              {(room.amenities || ['Free WiFi', 'Air Conditioning', 'Flat-screen TV']).map((amenity) => (
                <span key={amenity} className="amenity-badge">
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {room.notes && (
            <div className="room-notes-box">
              <span className="field-label">Special Notes & Housekeeping Instructions</span>
              <p>{room.notes}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>Close</button>
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              onClose()
              onEdit(room)
            }}
          >
            ✏️ Edit Room Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomDetailsModal
