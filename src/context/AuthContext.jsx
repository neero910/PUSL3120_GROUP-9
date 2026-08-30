import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  // Handle logout event from other tabs/windows
  useEffect(() => {
    const handleLogout = () => {
      logout()
    }
    window.addEventListener('auth-logout', handleLogout)
    return () => window.removeEventListener('auth-logout', handleLogout)
  }, [])

  const login = async (email, password) => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await authApi.login(email, password)

      if (response.success && response.token) {
        const userData = response.user
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(response.token)
        setUser(userData)
        setIsAuthenticated(true)
        return response
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name, email, password, role = 'Receptionist') => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await authApi.register({ name, email, password, role })

      if (response.success && response.token) {
        const userData = response.user
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(userData))
        setToken(response.token)
        setUser(userData)
        setIsAuthenticated(true)
        return response
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await authApi.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      setIsAuthenticated(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
