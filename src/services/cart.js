import api from './api.js'

export async function getCart() {
  const response = await api.get('/api/cart')
  return response.data?.data
}

export async function addToCart(productId, quantity = 1) {
  const response = await api.post('/api/cart', { productId, quantity })
  return response.data?.data
}

export async function updateCartItem(productId, quantity) {
  const response = await api.put(`/api/cart/${productId}`, { quantity })
  return response.data?.data
}

export async function removeCartItem(productId) {
  const response = await api.delete(`/api/cart/${productId}`)
  return response.data?.data
}
