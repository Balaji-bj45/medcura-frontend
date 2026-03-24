import adminApi from './adminApi.js'

export async function getAdminOrders() {
  const response = await adminApi.get('/api/orders')
  return response.data?.data || []
}

export async function getAdminOrderById(id) {
  const response = await adminApi.get(`/api/orders/${id}`)
  return response.data?.data
}

export async function updateAdminOrderStatus(id, status) {
  const response = await adminApi.patch(`/api/orders/${id}/status`, { status })
  return response.data?.data
}
