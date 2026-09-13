import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function OccupancyChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const occupiedItem = data.find(item => item.label.toLowerCase().includes('occupied'));
  const occupiedPercent = occupiedItem && total > 0 ? Math.round((occupiedItem.value / total) * 100) : 60;

  return (
    <div className="panel">
      <div className="panel-title">Occupancy Overview</div>
      <div className="panel-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px', height: '220px' }}>
        {/* Pie chart on the left */}
        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value" nameKey="label" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}`, 'Rooms']}
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--panel)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <strong style={{ fontSize: '20px', display: 'block', color: 'var(--text-primary)', lineHeight: '1.1' }}>{occupiedPercent}%</strong>
            <span style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Occupied</span>
          </div>
        </div>

        {/* Legend on the right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: item.color, width: '10px', height: '10px', borderRadius: '3px', display: 'inline-block', flexShrink: 0 }}></span>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{item.label}</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>{item.value} Rooms</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OccupancyChart

