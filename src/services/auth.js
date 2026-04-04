import api from './api.js'

export async function registerCustomer(payload) {
  const response = await api.post('/api/customers/register', payload)
  return response.data?.data
}

export async function loginCustomer(payload) {
  const response = await api.post('/api/customers/login', payload)
  return response.data?.data
}

export async function forgotCustomerPassword(payload) {
  const response = await api.post('/api/customers/forgot-password', payload)
  return response.data?.message
}

export async function resetCustomerPassword(payload) {
  const response = await api.post('/api/customers/reset-password', payload)
  return response.data?.message
}

export async function loginWithGoogle(payload) {
  const response = await api.post('/api/customers/google-auth', payload)
  return response.data?.data
}
