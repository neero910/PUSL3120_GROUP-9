import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import Login from './pages/Login'
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

  // Check if we're on the login page
  if (location.pathname === '/login') {
    return <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
  }

  return (
    <MainLayout title={titles[location.pathname] || 'Dashboard'}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
        <Route path="/housekeeping" element={<ProtectedRoute><Housekeeping /></ProtectedRoute>} />
        <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
        <Route path="/reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
        <Route path="/check-in" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
        <Route path="/check-out" element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
        <Route path="/restaurant" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </MainLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
