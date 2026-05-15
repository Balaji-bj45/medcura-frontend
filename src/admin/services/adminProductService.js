import adminApi from './adminApi.js'

export async function getAdminProducts() {
  const response = await adminApi.get('/api/products/admin/all')
  const data = response.data?.data
  if (Array.isArray(data)) return data
  return data?.items || []
}

export async function getAdminProductById(id) {
  const response = await adminApi.get(`/api/products/${id}`)
  return response.data?.data
}

export async function createAdminProduct(formData) {
  const response = await adminApi.post('/api/products', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data?.data
}

export async function updateAdminProduct(id, formData) {
  const response = await adminApi.put(`/api/products/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data?.data
}

export async function deleteAdminProduct(id) {
  const response = await adminApi.delete(`/api/products/${id}`)
  return response.data?.data
}
