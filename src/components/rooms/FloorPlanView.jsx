import { useState } from 'react'

function FloorPlanView({ rooms, onSelectRoom, onQuickStatusChange }) {
  const [selectedFloor, setSelectedFloor] = useState(1)

  const floors = [1, 2, 3, 4]
  const floorRooms = rooms.filter(room => room.floor === selectedFloor)

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'Available': return 'fp-available'
      case 'Occupied': return 'fp-occupied'
      case 'Reserved': return 'fp-reserved'
      case 'Cleaning': return 'fp-cleaning'
      case 'Maintenance': return 'fp-maintenance'
      default: return ''
    }
  }

  // Floor stats
  const totalOnFloor = floorRooms.length
  const availableOnFloor = floorRooms.filter(r => r.status === 'Available').length
  const occupiedOnFloor = floorRooms.filter(r => r.status === 'Occupied').length
  const cleaningOnFloor = floorRooms.filter(r => r.status === 'Cleaning' || r.housekeepingStatus === 'In Progress').length

  return (
    <div className="floor-plan-container">
      {/* Floor selector tabs */}
      <div className="floor-selector-bar">
        <div className="floor-tabs">
          {floors.map(floor => {
            const count = rooms.filter(r => r.floor === floor).length
            return (
              <button
                key={floor}
                type="button"
                className={`floor-tab ${selectedFloor === floor ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floor)}
              >
                <span className="floor-num">Floor {floor}</span>
                <span className="floor-badge">{count} Rooms</span>
              </button>
            )
          })}
        </div>

        <div className="floor-legend">
          <div className="legend-item"><span className="legend-dot fp-available" /> Available ({availableOnFloor})</div>
          <div className="legend-item"><span className="legend-dot fp-occupied" /> Occupied ({occupiedOnFloor})</div>
          <div className="legend-item"><span className="legend-dot fp-reserved" /> Reserved</div>
          <div className="legend-item"><span className="legend-dot fp-cleaning" /> Cleaning ({cleaningOnFloor})</div>
          <div className="legend-item"><span className="legend-dot fp-maintenance" /> Maintenance</div>
        </div>
      </div>

      {/* Interactive floor layout matrix */}
      <div className="floor-layout-panel">
        <div className="floor-corridor-label">
          <span>NORTH WING • SEA FACING CORRIDOR</span>
        </div>

        <div className="floor-matrix-grid">
          {floorRooms.map(room => (
            <div
              key={room.id}
              className={`floor-room-tile ${getStatusColorClass(room.status)}`}
              onClick={() => onSelectRoom(room)}
            >
              <div className="tile-top">
                <strong className="tile-number">{room.roomNumber}</strong>
                <span className="tile-type">{room.type}</span>
              </div>

              <div className="tile-middle">
                <span className={`status-badge small ${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
                <span className="tile-hk-badge">
                  {room.housekeepingStatus === 'Clean & Ready' ? '✓ Clean' : '🧹 ' + room.housekeepingStatus}
                </span>
              </div>

              {room.currentGuest && (
                <div className="tile-guest" title={room.currentGuest}>
                  👤 {room.currentGuest.length > 18 ? room.currentGuest.slice(0, 16) + '...' : room.currentGuest}
                </div>
              )}

              <div className="tile-footer">
                <span className="tile-price">LKR {(room.price / 1000).toFixed(0)}k</span>
                <span className="tile-attendant">👤 {room.assignedAttendant ? room.assignedAttendant.split(' ')[0] : 'None'}</span>
              </div>
            </div>
          ))}

          {floorRooms.length === 0 && (
            <div className="empty-state full-width">
              <strong>No rooms registered on Floor {selectedFloor}</strong>
            </div>
          )}
        </div>

        <div className="floor-corridor-label bottom">
          <span>ELEVATORS & SERVICE STAIRCASE • HOUSEKEEPING PANTRY</span>
        </div>
      </div>
    </div>
  )
}

export default FloorPlanView
