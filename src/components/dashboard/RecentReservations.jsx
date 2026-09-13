function RecentReservations({ reservations }) {
  return (
    <div className="panel">
      <div className="panel-title">Recent Reservations</div>
      <div className="panel-body">
      <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '12px' }}>Reservation ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Guest</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Room</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Check-in</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Check-out</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 20px', fontStyle: 'italic' }}>
                  No recent reservations
                </td>
              </tr>
            ) : reservations.map((reservation) => (
              <tr key={reservation.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>{reservation.id}</td>
                <td style={{ padding: '12px' }}>{reservation.guest}</td>
                <td style={{ padding: '12px' }}>{reservation.room}</td>
                <td style={{ padding: '12px' }}>{reservation.checkIn}</td>
                <td style={{ padding: '12px' }}>{reservation.checkOut}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${reservation.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {reservation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}

export default RecentReservations
