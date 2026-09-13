import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { reportCards } from '../data/users'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { apiCall } from '../services/api'

function Reports() {
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    Promise.all([
      apiCall('/dashboard/revenue').catch(() => ({ data: [] })),
      apiCall('/dashboard/occupancy').catch(() => ({ data: [] }))
    ]).then(([revRes, occRes]) => {
      if (isMounted) {
        setRevenueData(revRes.data || []);
        
        // Transform occupancy data for the chart if needed
        const formattedOcc = (occRes.data || []).map(item => ({
          name: item.type,
          rate: item.total > 0 ? Math.round((item.occupied / item.total) * 100) : 0,
          occupied: item.occupied,
          available: item.available
        }));
        setOccupancyData(formattedOcc);
        setIsLoading(false);
      }
    });

    return () => { isMounted = false };
  }, []);

  if (isLoading) {
    return (
      <div className="page-stack">
        <div className="panel empty-state">
          <strong>Loading reports...</strong>
          <span>Fetching the latest revenue and occupancy data.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <PageHeader title="Reports" subtitle="Hotel performance overview and revenue snapshot" />

      <div className="stats-grid">
        {reportCards.map((item) => (
          <div key={item.label} className="stat-card report-card">
            <div className="stat-label">{item.label}</div>
            <div className="stat-value">{item.value}</div>
            <div className="stat-change">{item.trend}</div>
          </div>
        ))}
      </div>

      <div className="content-grid two-column">
        <div className="panel">
          <div className="panel-heading">
            <h3>Revenue Trend</h3>
          </div>
          <div style={{ width: '100%', height: 320, marginTop: '20px' }}>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(value) => `Rs.${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', background: 'var(--bg-surface)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>No revenue data available yet.</span>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>Occupancy by Room Type</h3>
          </div>
          <div style={{ width: '100%', height: 320, marginTop: '20px' }}>
            {occupancyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    cursor={{ fill: 'var(--bg-hover)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', background: 'var(--bg-surface)' }}
                    itemStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.occupied}/${props.payload.available + props.payload.occupied} rooms)`, 
                      'Occupancy'
                    ]}
                  />
                  <Bar dataKey="rate" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>No occupancy data available yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
