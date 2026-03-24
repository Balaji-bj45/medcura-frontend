import api from './api.js'

export async function submitServiceEnquiry(payload) {
  const response = await api.post('/api/services', payload)
  return response.data?.data
}
