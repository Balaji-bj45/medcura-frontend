import api from './api.js'

export async function getCategories(options = {}) {
  const response = await api.get('/api/categories', {
    signal: options.signal,
  })
  return response.data?.data || []
}
