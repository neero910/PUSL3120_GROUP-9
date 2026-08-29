const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status ${response.status}`)
  }

  return body
}

function asList(response) {
  return Array.isArray(response) ? response : response?.data || []
}

export const api = {
  async getMenuItems() {
    return asList(await request('/menu-items'))
  },
  async createOrder(order) {
    return request('/orders', { method: 'POST', body: JSON.stringify(order) })
  },
  async getPayments() {
    return asList(await request('/payments'))
  },
  async markPaymentAsPaid(paymentId) {
    return request(`/payments/${encodeURIComponent(paymentId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Paid' }),
    })
  },
  async getInvoices() {
    return asList(await request('/invoices'))
  },
}