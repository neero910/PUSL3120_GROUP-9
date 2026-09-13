function ActivityTable({ title, rows, columns }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="panel-body">
        <div className="table-wrapper">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} style={{ textAlign: 'left', padding: '12px' }}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 20px', fontStyle: 'italic' }}>
                  No entries for today
                </td>
              </tr>
            ) : rows.map((row, index) => (
              <tr key={`${title}-${index}`} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}>{row.guest}</td>
                <td style={{ padding: '12px' }}>{row.room}</td>
                <td style={{ padding: '12px' }}>{row.checkIn || row.checkOut}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`status-badge ${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {row.status}
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

export default ActivityTable

