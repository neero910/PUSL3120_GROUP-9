import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading, error, setError } = useAuth()
  const [email, setEmail] = useState('admin@hotel.com')
  const [password, setPassword] = useState('password123')
  const [localError, setLocalError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)
    setError(null)

    if (!email || !password) {
      setLocalError('Please enter both email and password')
      return
    }

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setLocalError(err.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hotel Management System</h1>
          <p>Phase 2: API Integration</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>

          {(localError || error) && (
            <div className="error-message">
              {localError || error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p><strong>Email:</strong> admin@hotel.com</p>
          <p><strong>Password:</strong> password123</p>
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
            Other available accounts: manager@hotel.com, receptionist@hotel.com
          </p>
        </div>

        <div className="backend-status">
          <p>📡 Backend API: {isLoading ? 'Checking...' : 'Ready'}</p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            Make sure the backend server is running on http://localhost:5000
          </p>
        </div>
      </div>
    </div>
  )
}
