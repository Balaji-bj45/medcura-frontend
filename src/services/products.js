import api from './api.js'

function cleanParams(params = {}) {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (key === 'signal') return acc
    if (value === undefined || value === null || value === '') return acc
    acc[key] = value
    return acc
  }, {})
}

function normalizeProductCollection(data) {
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      pageSize: data.length,
      hasMore: false,
    }
  }

  if (data && Array.isArray(data.items)) {
    return {
      items: data.items,
      total: Number(data.total ?? data.items.length),
      page: Number(data.page ?? 1),
      pageSize: Number(data.pageSize ?? data.items.length),
      hasMore: Boolean(data.hasMore),
    }
  }

  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 0,
    hasMore: false,
  }
}

export async function getProducts(params = {}, options = {}) {
  const response = await api.get('/api/products', {
    params: cleanParams(params),
    signal: options.signal ?? params.signal,
  })
  return normalizeProductCollection(response.data?.data)
}

export async function getProductById(id) {
  const response = await api.get(`/api/products/${id}`)
  return response.data?.data
}

export async function getBestSellerProducts(limit = 8) {
  const data = await getProducts({ bestSeller: true, sort: 'popular', limit })
  return data.items
}

export async function getFeaturedProducts(limit = 8) {
  const data = await getProducts({ featured: true, sort: 'latest', limit })
  return data.items
}
