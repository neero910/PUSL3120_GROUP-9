import { useEffect, useState } from 'react'
import StatCard from '../components/dashboard/StatCard'
import OccupancyChart from '../components/dashboard/OccupancyChart'
import ActivityTable from '../components/dashboard/TodayActivity'
import RecentReservations from '../components/dashboard/RecentReservations'
import { fetchApiData, normalizeDashboard, apiCall } from '../services/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const initialDashboard = {
  stats: [], occupancyData: [], todayCheckIns: [], todayCheckOuts: [], recentReservations: [], revenueData: []
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchApiData('dashboard', initialDashboard, normalizeDashboard)
      .then(async (data) => {
        if (isMounted) {
          try {
            const [revRes, occRes] = await Promise.all([
              apiCall('/dashboard/revenue').catch(() => ({ data: [] })),
              apiCall('/dashboard/occupancy').catch(() => ({ data: [] }))
            ]);
            data.revenueData = revRes.data || [];
            
            // Format occupancy data for PieChart — use TOTAL rooms per type so chart always renders
            const occData = occRes.data || [];
            data.occupancyData = occData.map((item, index) => {
              const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
              return {
                label: item.type || `Type ${index + 1}`,
                value: item.total || 0,   // use total, not occupied (occupied can be 0)
                occupied: item.occupied || 0,
                color: colors[index % colors.length]
              };
            });
            
            // Fallback if no data at all
            const totalRooms = data.occupancyData.reduce((sum, item) => sum + item.value, 0);
            if (totalRooms === 0) {
              data.occupancyData = [
                { label: 'Standard', value: 2, color: '#3b82f6', occupied: 0 },
                { label: 'Deluxe', value: 2, color: '#8b5cf6', occupied: 0 },
                { label: 'Suite', value: 1, color: '#10b981', occupied: 0 },
              ];
            }
          } catch (e) {
            data.revenueData = [];
            data.occupancyData = [];
          }
          setDashboard(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setDashboard(initialDashboard)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const checkInColumns = ['Guest', 'Room', 'Check-in', 'Status']
  const checkOutColumns = ['Guest', 'Room', 'Check-out', 'Status']

  if (isLoading) {
    return (
      <div className="page-stack">
        <div className="panel empty-state">
          <strong>Loading dashboard...</strong>
          <span>Fetching the latest occupancy and reservation data.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <div className="stats-grid">
        {dashboard.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} change={stat.change} />
        ))}
      </div>

      <div className="content-grid two-column">
        <OccupancyChart data={dashboard.occupancyData} />
        
        <div className="panel">
          <div className="panel-title">Revenue Trend (Last 7 Days)</div>
          <div className="panel-body" style={{ width: '100%', height: '240px' }}>
            {dashboard.revenueData && dashboard.revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" className="chart-container">
                <AreaChart data={dashboard.revenueData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDashboardRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--success, #10b981)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--success, #10b981)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 12 }} tickFormatter={(value) => `Rs.${value/1000}k`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', background: 'var(--panel)' }}
                    itemStyle={{ color: 'var(--text)', fontWeight: 600 }}
                    formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: 'var(--muted)', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--success, #10b981)" strokeWidth={3} fillOpacity={1} fill="url(#colorDashboardRevenue)" activeDot={{ r: 6, fill: 'var(--success)', stroke: 'var(--panel)', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>

            ) : (
              <div className="empty-state" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'space-around', marginBottom: '20px' }}>
                   <div className="summary-box" style={{ flex: 1, textAlign: 'center', padding: '15px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                     <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)' }}>Check-ins</span>
                     <strong style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{dashboard.todayCheckIns.length}</strong>
                   </div>
                   <div className="summary-box" style={{ flex: 1, textAlign: 'center', padding: '15px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                     <span style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)' }}>Check-outs</span>
                     <strong style={{ fontSize: '24px', color: 'var(--text-primary)' }}>{dashboard.todayCheckOuts.length}</strong>
                   </div>
                </div>
                <span style={{ color: 'var(--text-secondary)' }}>Not enough revenue data to show chart yet.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="content-grid two-column">
        <ActivityTable title="Today’s Check-ins" rows={dashboard.todayCheckIns} columns={checkInColumns} />
        <ActivityTable title="Today’s Check-outs" rows={dashboard.todayCheckOuts} columns={checkOutColumns} />
      </div>

      <RecentReservations reservations={dashboard.recentReservations} />
    </div>
  )
}

export default Dashboard
