function RoomCard({ room, onSelectRoom, onEditRoom, onQuickStatusChange }) {
  const getHousekeepingClass = (hkStatus) => {
    switch (hkStatus) {
      case 'Clean & Ready': return 'available'
      case 'In Progress': return 'pending'
      case 'Inspection Required': return 'scheduled'
      case 'Dirty / Needs Clean': return 'cancelled'
      case 'Out of Order': return 'maintenance'
      default: return 'pending'
    }
  }

  return (
    <div className="room-card modern-room-card">
      {/* Card Header with Floor & Badges */}
      <div className="room-card-header">
        <div>
          <div className="room-card-title-row">
            <div className="room-number">{room.roomNumber}</div>
            <span className="room-floor-tag">Floor {room.floor}</span>
          </div>
          <div className="room-type">{room.type} • {room.bedType}</div>
        </div>

        <div className="room-badge-stack">
          <span className={`status-badge ${room.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {room.status}
          </span>
          <span className={`status-badge small ${getHousekeepingClass(room.housekeepingStatus)}`}>
            {room.housekeepingStatus === 'Clean & Ready' ? '✓ Clean' : room.housekeepingStatus}
          </span>
        </div>
      </div>

      {/* Guest Details or Attendant */}
      <div className="room-card-details">
        {room.currentGuest ? (
          <div className="room-guest-row">
            <span className="guest-icon">👤</span>
            <span className="guest-name" title={room.currentGuest}>{room.currentGuest}</span>
          </div>
        ) : (
          <div className="room-guest-row vacant">
            <span>Vacant / Ready for booking</span>
          </div>
        )}

        <div className="room-attendant-row">
          <span className="muted-text">Housekeeper:</span>
          <span>{room.assignedAttendant || 'Unassigned'}</span>
        </div>
      </div>

      {/* Amenity tags */}
      {room.amenities && room.amenities.length > 0 && (
        <div className="room-amenities-preview">
          {room.amenities.slice(0, 3).map((amenity) => (
            <span key={amenity} className="room-amenity-chip">
              {amenity}
            </span>
          ))}
          {room.amenities.length > 3 && (
            <span className="room-amenity-chip more">+{room.amenities.length - 3}</span>
          )}
        </div>
      )}

      {/* Pricing and Quick Status select */}
      <div className="room-price-row">
        <div>
          <span className="room-price-label">Rate / night</span>
          <div className="room-price">LKR {room.price.toLocaleString()}</div>
        </div>

        <select
          className="inline-status-select"
          value={room.status}
          onChange={(e) => onQuickStatusChange(room.id, e.target.value)}
          aria-label={`Change status for Room ${room.roomNumber}`}
        >
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Reserved">Reserved</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Footer Actions */}
      <div className="room-card-footer">
        <button
          type="button"
          className="secondary-button small-button"
          onClick={() => onSelectRoom(room)}
        >
          View Details
        </button>
        <button
          type="button"
          className="primary-button small-button"
          onClick={() => onEditRoom(room)}
        >
          Edit
        </button>
      </div>
    </div>
  )
}

export default RoomCard
