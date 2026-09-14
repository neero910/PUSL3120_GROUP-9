function RecentReservations({ reservations = [] }) {
  return (
    <div className="panel recent-reservations-panel">
      <div className="panel-title">Recent Reservations</div>
      <div className="panel-body">
        <div className="table-wrapper">
          <table className="recent-reservations-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-cell">
                    <div className="activity-empty-state">
                      <span className="activity-empty-icon">📅</span>
                      <strong>No recent reservations</strong>
                      <span>New bookings will appear here automatically.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="font-mono font-semibold">{reservation.id}</td>
                    <td className="font-medium">{reservation.guest}</td>
                    <td>
                      <span className="room-badge">Room {reservation.room}</span>
                    </td>
                    <td className="text-muted">{reservation.checkIn}</td>
                    <td className="text-muted">{reservation.checkOut}</td>
                    <td>
                      <span className={`status-badge ${(reservation.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RecentReservations

