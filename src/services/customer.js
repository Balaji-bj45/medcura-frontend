import api from './api.js'

export async function getMyProfile() {
  const response = await api.get('/api/customers/me')
  return response.data?.data
}

export async function updateMyProfile(payload) {
  const response = await api.patch('/api/customers/me', payload)
  return response.data?.data
}

export async function addAddress(payload) {
  const response = await api.post('/api/customers/addresses', payload)
  return response.data?.data
}

export async function updateAddress(addressId, payload) {
  const response = await api.put(`/api/customers/addresses/${addressId}`, payload)
  return response.data?.data
}

export async function deleteAddress(addressId) {
  const response = await api.delete(`/api/customers/addresses/${addressId}`)
  return response.data?.data
}
