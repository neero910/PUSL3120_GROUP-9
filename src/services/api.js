import { guests as fallbackGuests } from '../data/guests.js'
import { users as fallbackUsers } from '../data/users.js'

const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined

export const API_BASE_URL = viteEnv?.VITE_API_BASE_URL || '/api'

export function buildApiUrl(path) {
  const endpoint = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`
}

export function normalizeGuest(item) {
  return {
    id: item.id ?? item.guestId ?? item._id,
    name: item.name ?? item.guestName ?? 'Unknown guest',
    contact: item.contact ?? item.phone ?? item.phoneNumber ?? 'Not provided',
    idNumber: item.idNumber ?? item.id_number ?? item.passportNumber ?? 'Not provided',
    room: item.room ?? item.roomNumber ?? 'N/A',
    checkIn: item.checkIn ?? item.check_in ?? item.arrivalDate ?? '',
    checkOut: item.checkOut ?? item.check_out ?? item.departureDate ?? '',
    status: item.status ?? 'Pending',
  }
}

export function normalizeUser(item) {
  return {
    id: item.id ?? item.userId ?? item._id,
    name: item.name ?? item.fullName ?? 'Unknown user',
    email: item.email ?? 'No email provided',
    role: item.role ?? item.position ?? 'Staff',
    status: item.status ?? 'Active',
    lastActive: item.lastActive ?? item.last_active ?? 'Unknown',
  }
}

export function resolveApiData(endpoint, fallbackData) {
  if (Array.isArray(fallbackData)) {
    return fallbackData
  }

  if (endpoint === 'guests') {
    return fallbackGuests
  }

  if (endpoint === 'users') {
    return fallbackUsers
  }

  return []
}

export async function fetchApiData(endpoint, fallbackData, mapper = (item) => item) {
  const url = buildApiUrl(endpoint)

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const payload = await response.json()
    const data = Array.isArray(payload) ? payload : payload.data ?? []

    return data.map((item) => mapper(item))
  } catch (error) {
    console.warn(`Falling back to local ${endpoint} data:`, error)

    return resolveApiData(endpoint, fallbackData).map((item) => mapper(item))
  }
}
