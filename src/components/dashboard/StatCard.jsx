const iconMap = {
  'total rooms': '🏨',
  'available rooms': '🟢',
  'occupied rooms': '🔑',
  'total guests': '👥',
  'reservations': '📅',
}

function StatCard({ label, value, change }) {
  const icon = iconMap[label?.toLowerCase()] || '📊'

  return (
    <div className="panel stat-panel-card">
      <div className="stat-card-header">
        <span className="stat-card-icon" aria-hidden="true">{icon}</span>
        <div className="panel-title stat-card-label">{label}</div>
      </div>
      <div className="panel-body stat-card-body">
        <span className="stat-value">{value}</span>
        {change && <div className="stat-change">{change}</div>}
      </div>
    </div>
  )
}

export default StatCard

