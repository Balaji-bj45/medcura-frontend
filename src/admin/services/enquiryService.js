import adminApi from './adminApi.js'

export async function getEnquiries() {
  const response = await adminApi.get('/api/services')
  return response.data?.data || []
}

export async function updateEnquiryStatus(id, status) {
  const response = await adminApi.put(`/api/services/${id}`, { status })
  return response.data?.data
}
