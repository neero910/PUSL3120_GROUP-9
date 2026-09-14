function ActivityTable({ title, rows = [], columns = [] }) {
  const isCheckIn = title.toLowerCase().includes('check-in')
  const emptyIcon = isCheckIn ? '🛏️' : '🚪'

  return (
    <div className="panel activity-panel">
      <div className="panel-title">{title}</div>
      <div className="panel-body">
        <div className="table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="empty-cell">
                    <div className="activity-empty-state">
                      <span className="activity-empty-icon">{emptyIcon}</span>
                      <strong>No {isCheckIn ? 'check-ins' : 'check-outs'} for today</strong>
                      <span>All expected guests are up to date.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={`${title}-${index}`}>
                    <td className="font-semibold">{row.guest}</td>
                    <td>
                      <span className="room-badge">Room {row.room}</span>
                    </td>
                    <td className="text-muted">{row.checkIn || row.checkOut}</td>
                    <td>
                      <span className={`status-badge ${(row.status || 'confirmed').toLowerCase().replace(/\s+/g, '-')}`}>
                        {row.status}
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

export default ActivityTable


