function ReservationTable({ reservations }) {
  return (
    <div className="panel">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Reservation ID</th>
              <th>Guest</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.guest}</td>
                <td>{reservation.room}</td>
                <td>{reservation.checkIn}</td>
                <td>{reservation.checkOut}</td>
                <td>{reservation.guests}</td>
                <td>
                  <span className={`status-badge ${reservation.status.toLowerCase().replace(/\s+/g, '-')}`}>{reservation.status}</span>
                </td>
                <td>{reservation.amount}</td>
                <td>
                  <button type="button" className="secondary-button">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!reservations.length && (
          <div className="empty-state">
            <strong>No reservations found</strong>
            <span>Try a different guest, room, status or stay date.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationTable
