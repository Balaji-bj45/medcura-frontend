import api from './api.js'

function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') return acc
    acc[key] = value
    return acc
  }, {})
}

export async function getProducts(params = {}) {
  const response = await api.get('/api/products', {
    params: cleanParams(params),
  })
  return response.data?.data
}

export async function getProductById(id) {
  const response = await api.get(`/api/products/${id}`)
  return response.data?.data
}

export async function getBestSellerProducts(limit = 8) {
  return getProducts({ bestSeller: true, sort: 'popular', limit })
}

export async function getFeaturedProducts(limit = 8) {
  return getProducts({ featured: true, sort: 'latest', limit })
}
