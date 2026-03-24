import adminApi from './adminApi.js'

export async function adminLogin(payload) {
  const response = await adminApi.post('/api/auth/login', payload)
  return response.data?.data
}
