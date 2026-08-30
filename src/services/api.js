/**
 * Hotel Management System - Frontend API Service
 * Centralizes all API calls to the backend
 */

import { guests as fallbackGuests } from '../data/guests.js'
import { users as fallbackUsers } from '../data/users.js'
import {
  stats as fallbackStats,
  occupancyData as fallbackOccupancy,
  todayCheckIns as fallbackCheckIns,
  todayCheckOuts as fallbackCheckOuts,
  recentReservations as fallbackRecentReservations,
} from '../data/dashboard.js'

const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined

// API Configuration - use a relative base by default so Vite proxy and tests both resolve correctly.
// An explicit environment override can still point to a remote backend when needed.
export const API_BASE_URL = (viteEnv?.VITE_API_BASE_URL || viteEnv?.VITE_API_URL || '/api').replace(/\/$/, '')

/**
 * Get JWT token from localStorage
 */
function getAuthToken() {
  return localStorage.getItem('token')
}

/**
 * Make authenticated API call with error handling
 */
export async function apiCall(endpoint, options = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    skipAuth = false,
    fallback = null,
  } = options

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // Add auth token if available and not skipped
  const token = getAuthToken()
  if (token && !skipAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      // Handle unauthorized
      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.dispatchEvent(new Event('auth-logout'))
      }

      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API error: ${response.status}`)
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return response
  } catch (error) {
    console.error('API call failed:', error)
    if (fallback !== null) {
      return fallback
    }
    throw error
  }
}

/**
 * Authentication API
 */
export const authApi = {
  async register(userData) {
    return apiCall('/auth/register', {
      method: 'POST',
      body: userData,
      skipAuth: true,
    })
  },

  async login(email, password) {
    return apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipAuth: true,
    })
  },

  async getCurrentUser() {
    return apiCall('/auth/me')
  },

  async verifyToken(token) {
    return apiCall('/auth/verify', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      skipAuth: false,
    })
  },

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

/**
 * Rooms API
 */
export const roomsApi = {
  async getAll() {
    return apiCall('/rooms', { fallback: { success: true, data: fallbackGuests } })
  },

  async getById(id) {
    return apiCall(`/rooms/${id}`)
  },

  async create(roomData) {
    return apiCall('/rooms', {
      method: 'POST',
      body: roomData,
    })
  },

  async update(id, roomData) {
    return apiCall(`/rooms/${id}`, {
      method: 'PUT',
      body: roomData,
    })
  },

  async delete(id) {
    return apiCall(`/rooms/${id}`, {
      method: 'DELETE',
    })
  },

  async getStats() {
    return apiCall('/rooms/stats/summary')
  },
}

/**
 * Guests API
 */
export const guestsApi = {
  async getAll() {
    return apiCall('/guests', { fallback: { success: true, data: fallbackGuests } })
  },

  async getById(id) {
    return apiCall(`/guests/${id}`)
  },

  async create(guestData) {
    return apiCall('/guests', {
      method: 'POST',
      body: guestData,
    })
  },

  async update(id, guestData) {
    return apiCall(`/guests/${id}`, {
      method: 'PUT',
      body: guestData,
    })
  },

  async delete(id) {
    return apiCall(`/guests/${id}`, {
      method: 'DELETE',
    })
  },

  async getStats() {
    return apiCall('/guests/stats/summary')
  },
}

/**
 * Reservations API
 */
export const reservationsApi = {
  async getAll() {
    return apiCall('/reservations', { fallback: { success: true, data: [] } })
  },

  async getById(id) {
    return apiCall(`/reservations/${id}`)
  },

  async create(reservationData) {
    return apiCall('/reservations', {
      method: 'POST',
      body: reservationData,
    })
  },

  async update(id, reservationData) {
    return apiCall(`/reservations/${id}`, {
      method: 'PUT',
      body: reservationData,
    })
  },

  async delete(id) {
    return apiCall(`/reservations/${id}`, {
      method: 'DELETE',
    })
  },

  async getByGuestId(guestId) {
    return apiCall(`/reservations/guest/${guestId}`)
  },

  async getStats() {
    return apiCall('/reservations/stats/summary')
  },
}

/**
 * Dashboard API
 */
export const dashboardApi = {
  async getSummary() {
    return apiCall('/dashboard/summary', {
      fallback: {
        success: true,
        data: {
          rooms: { total: 30, available: 12, occupied: 15, reserved: 2, maintenance: 1 },
          guests: { total: 40, active: 38 },
          reservations: { total: 20, confirmed: 18, pending: 2 },
          revenue: { today: 125000, total: 1500000 },
          today: { checkIns: 3, checkOuts: 2 },
          recentReservations: fallbackRecentReservations,
        },
      },
    })
  },

  async getOccupancy() {
    return apiCall('/dashboard/occupancy', {
      fallback: { success: true, data: fallbackOccupancy },
    })
  },

  async getRevenue() {
    return apiCall('/dashboard/revenue', { fallback: { success: true, data: [] } })
  },
}

/**
 * Legacy function for backward compatibility
 */
export function buildApiUrl(path) {
  const endpoint = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${endpoint}`
}

export function normalizeGuest(item = {}) {
  return {
    id: item.id ?? item.guestId ?? item._id,
    name: (`${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() || item.name) ?? 'Unknown guest',
    contact: item.contact ?? item.phone ?? item.phoneNumber ?? 'Not provided',
    idNumber: item.idNumber ?? item.id_number ?? item.nicPassport ?? 'Not provided',
    room: item.room ?? item.roomNumber ?? 'N/A',
    checkIn: item.checkIn ?? item.check_in ?? item.arrivalDate ?? '',
    checkOut: item.checkOut ?? item.check_out ?? item.departureDate ?? '',
    status: item.status ?? 'Pending',
  }
}

export function normalizeUser(item = {}) {
  return {
    id: item.id ?? item.userId ?? item._id,
    name: item.name ?? item.fullName ?? 'Unknown user',
    email: item.email ?? 'No email provided',
    role: item.role ?? item.position ?? 'Staff',
    status: item.status ?? 'Active',
    lastActive: item.lastActive ?? item.last_active ?? 'Unknown',
  }
}

export function normalizeDashboard(item = {}) {
  return {
    stats: Array.isArray(item.stats) ? item.stats : fallbackStats,
    occupancyData: Array.isArray(item.occupancyData) ? item.occupancyData : fallbackOccupancy,
    todayCheckIns: Array.isArray(item.todayCheckIns) ? item.todayCheckIns : fallbackCheckIns,
    todayCheckOuts: Array.isArray(item.todayCheckOuts) ? item.todayCheckOuts : fallbackCheckOuts,
    recentReservations: Array.isArray(item.recentReservations) ? item.recentReservations : fallbackRecentReservations,
  }
}

export function resolveApiData(endpoint, fallbackData) {
  if (Array.isArray(fallbackData)) {
    return fallbackData
  }

  if (fallbackData && typeof fallbackData === 'object') {
    return fallbackData
  }

  if (endpoint === 'guests') {
    return fallbackGuests
  }

  if (endpoint === 'users') {
    return fallbackUsers
  }

  if (endpoint === 'dashboard') {
    return normalizeDashboard()
  }

  return []
}

export async function fetchApiData(endpoint, fallbackData, mapper = (item) => item) {
  const url = buildApiUrl(endpoint)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : '',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const payload = await response.json()
    const data = Array.isArray(payload) ? payload : payload?.data ?? payload ?? []

    if (endpoint === 'dashboard') {
      return mapper(normalizeDashboard(data))
    }

    return (Array.isArray(data) ? data : []).map((item) => mapper(item))
  } catch (error) {
    console.warn(`Falling back to local ${endpoint} data:`, error)

    const fallback = resolveApiData(endpoint, fallbackData)

    if (endpoint === 'dashboard') {
      return mapper(normalizeDashboard(fallback))
    }

    return (Array.isArray(fallback) ? fallback : []).map((item) => mapper(item))
  }
}

export const api = {
  async getMenuItems() {
    return Array.isArray((await apiCall('/menu-items')).data)
      ? (await apiCall('/menu-items')).data
      : (await apiCall('/menu-items'))
  },
  async createOrder(order) {
    return apiCall('/orders', { method: 'POST', body: order })
  },
  async getPayments() {
    const body = await apiCall('/payments')
    return Array.isArray(body) ? body : body?.data || []
  },
  async markPaymentAsPaid(paymentId) {
    return apiCall(`/payments/${encodeURIComponent(paymentId)}`, {
      method: 'PATCH',
      body: { status: 'Paid' },
    })
  },
  async getInvoices() {
    const body = await apiCall('/invoices')
    return Array.isArray(body) ? body : body?.data || []
  },
}

export default API_BASE_URL
