import api from './api.js'

export async function sendOtp(payload) {
  const response = await api.post('/api/customers/send-otp', payload)
  return response.data?.data
}

export async function verifyOtp(payload) {
  const response = await api.post('/api/customers/verify-otp', payload)
  return response.data?.data
}
