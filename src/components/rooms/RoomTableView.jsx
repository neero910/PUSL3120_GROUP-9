function RoomTableView({ rooms, onSelectRoom, onEditRoom, onQuickStatusChange }) {
  return (
    <div className="panel">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Floor</th>
              <th>Type & Bed</th>
              <th>Price / Night</th>
              <th>Occupancy Status</th>
              <th>Housekeeping State</th>
              <th>Guest</th>
              <th>Attendant</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>
                  <strong className="table-room-num">#{room.roomNumber}</strong>
                </td>
                <td>Floor {room.floor}</td>
                <td>
                  <strong>{room.type}</strong>
                  <div className="table-subnote">{room.bedType} • {room.capacity} Guests</div>
                </td>
                <td>
                  <strong className="text-primary">LKR {room.price.toLocaleString()}</strong>
                </td>
                <td>
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
                </td>
                <td>
                  <span className={`status-badge ${room.housekeepingStatus === 'Clean & Ready' ? 'available' : room.housekeepingStatus === 'In Progress' ? 'pending' : room.housekeepingStatus === 'Dirty / Needs Clean' ? 'cancelled' : 'scheduled'}`}>
                    {room.housekeepingStatus}
                  </span>
                </td>
                <td>
                  {room.currentGuest ? (
                    <span className="table-guest-name">👤 {room.currentGuest}</span>
                  ) : (
                    <span className="muted-text">—</span>
                  )}
                </td>
                <td>
                  <small>{room.assignedAttendant || 'Unassigned'}</small>
                </td>
                <td>
                  <div className="table-action-cell">
                    <button
                      type="button"
                      className="secondary-button small-button"
                      onClick={() => onSelectRoom(room)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="primary-button small-button"
                      onClick={() => onEditRoom(room)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rooms.length === 0 && (
          <div className="empty-state">
            <strong>No matching rooms found</strong>
            <span>Try adjusting your search query or filters.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomTableView
