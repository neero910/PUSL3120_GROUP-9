function StatCard({ label, value, change }) {
  return (
    <div className="panel" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div className="panel-title">{label}</div>
      <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span className="stat-value" style={{ fontSize: '2.5rem', lineHeight: '1' }}>{value}</span>
        {change && <div className="stat-change" style={{ marginTop: '4px' }}>{change}</div>}
      </div>
    </div>
  )
}

export default StatCard
