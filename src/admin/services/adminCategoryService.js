import adminApi from './adminApi.js'

export async function getAdminCategories() {
  const response = await adminApi.get('/api/categories', {
    params: { includeInactive: true },
  })
  return response.data?.data || []
}

export async function createAdminCategory(payload) {
  const response = await adminApi.post('/api/categories', payload)
  return response.data?.data
}

export async function updateAdminCategory(id, payload) {
  const response = await adminApi.put(`/api/categories/${id}`, payload)
  return response.data?.data
}

export async function deleteAdminCategory(id) {
  const response = await adminApi.delete(`/api/categories/${id}`)
  return response.data?.data
}
