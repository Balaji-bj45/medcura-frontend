import api from './api.js'

export async function createOrder(payload) {
  const response = await api.post('/api/orders/create', payload)
  return response.data?.data
}

export async function getMyOrders() {
  const response = await api.get('/api/orders/my')
  return response.data?.data
}

export async function getMyOrderById(orderId) {
  const response = await api.get(`/api/orders/my/${orderId}`)
  return response.data?.data
}

export async function verifyPayment(payload) {
  const response = await api.post('/api/orders/verify', payload)
  return response.data?.data
}
