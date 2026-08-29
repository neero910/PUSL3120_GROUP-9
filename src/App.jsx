import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Housekeeping from './pages/Housekeeping'
import Guests from './pages/Guests'
import Reservations from './pages/Reservations'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Restaurant from './pages/Restaurant'
import Payments from './pages/Payments'
import Invoices from './pages/Invoices'
import Reports from './pages/Reports'
import Users from './pages/Users'
import './App.css'

function AppContent() {
  const location = useLocation()

  const titles = {
    '/dashboard': 'Dashboard',
    '/rooms': 'Rooms Management',
    '/housekeeping': 'Housekeeping Operations',
    '/guests': 'Guests',
    '/reservations': 'Reservations',
    '/check-in': 'Check-In',
    '/check-out': 'Check-Out',
    '/restaurant': 'Restaurant',
    '/payments': 'Payments',
    '/invoices': 'Invoices',
    '/reports': 'Reports',
    '/users': 'Users',
    '/settings': 'Settings',
  }

  return (
    <MainLayout title={titles[location.pathname] || 'Dashboard'}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/housekeeping" element={<Housekeeping />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/check-out" element={<CheckOut />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Dashboard />} />
      </Routes>
    </MainLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
