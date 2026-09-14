import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function OccupancyChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalOccupied = data.reduce((sum, item) => sum + (item.occupied || 0), 0);
  const occupiedItem = data.find(item => item.label.toLowerCase().includes('occupied'));
  
  // Real percentage: if items have occupied count use that, else fallback to occupied item or 50%
  const effectiveOccupied = totalOccupied > 0 ? totalOccupied : (occupiedItem ? occupiedItem.value : Math.round(total * 0.5));
  const occupiedPercent = total > 0 ? Math.round((effectiveOccupied / total) * 100) : 0;

  return (
    <div className="panel chart-panel">
      <div className="panel-title">Occupancy Overview</div>
      <div className="panel-body occupancy-chart-container">
        {/* Donut chart on the left */}
        <div className="donut-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={78}
                paddingAngle={4}
                dataKey="value"
                nameKey="label"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} Rooms`, name]}
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--panel)', boxShadow: 'var(--shadow)' }}
                itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="donut-center-label">
            <strong className="donut-percent">{occupiedPercent}%</strong>
            <span className="donut-sub">Occupied</span>
          </div>
        </div>

        {/* Legend on the right */}
        <div className="occupancy-legend">
          {data.map((item) => {
            const itemPercent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.label} className="legend-row">
                <span className="legend-indicator" style={{ background: item.color }} />
                <div className="legend-info">
                  <div className="legend-header-line">
                    <span className="legend-label">{item.label}</span>
                    <span className="legend-share">{itemPercent}%</span>
                  </div>
                  <strong className="legend-value">{item.value} Rooms</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default OccupancyChart

