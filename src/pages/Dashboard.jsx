import { useEffect, useState } from 'react'
import StatCard from '../components/dashboard/StatCard'
import OccupancyChart from '../components/dashboard/OccupancyChart'
import ActivityTable from '../components/dashboard/TodayActivity'
import RecentReservations from '../components/dashboard/RecentReservations'
import {
  stats as fallbackStats,
  occupancyData as fallbackOccupancy,
  todayCheckIns as fallbackCheckIns,
  todayCheckOuts as fallbackCheckOuts,
  recentReservations as fallbackRecentReservations,
} from '../data/dashboard'
import { fetchApiData, normalizeDashboard } from '../services/api'

const initialDashboard = {
  stats: fallbackStats,
  occupancyData: fallbackOccupancy,
  todayCheckIns: fallbackCheckIns,
  todayCheckOuts: fallbackCheckOuts,
  recentReservations: fallbackRecentReservations,
}

function Dashboard() {
  const [dashboard, setDashboard] = useState(initialDashboard)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    fetchApiData('dashboard', initialDashboard, normalizeDashboard)
      .then((data) => {
        if (isMounted) {
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
          <div className="panel-heading">
            <h3>Today’s Summary</h3>
          </div>
          <div className="summary-boxes">
            <div className="summary-box">
              <span>Check-ins</span>
              <strong>{dashboard.todayCheckIns.length}</strong>
            </div>
            <div className="summary-box">
              <span>Check-outs</span>
              <strong>{dashboard.todayCheckOuts.length}</strong>
            </div>
            <div className="summary-box">
              <span>Arrivals</span>
              <strong>{dashboard.recentReservations.length}</strong>
            </div>
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
