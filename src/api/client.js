const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status ${response.status}`)
  }

  return body
}

function listFromResponse(body) {
  return Array.isArray(body) ? body : body?.data || []
}

export const api = {
  async getMenuItems() {
    return listFromResponse(await request('/menu-items'))
  },
  async createOrder(order) {
    return request('/orders', { method: 'POST', body: JSON.stringify(order) })
  },
  async getPayments() {
    return listFromResponse(await request('/payments'))
  },
  async markPaymentAsPaid(paymentId) {
    return request(`/payments/${encodeURIComponent(paymentId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Paid' }),
    })
  },
  async getInvoices() {
    return listFromResponse(await request('/invoices'))
  },
}
