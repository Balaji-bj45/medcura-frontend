import axios from 'axios'

const resolveApiBaseUrl = () => {
  const envBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (envBaseUrl) return envBaseUrl

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      if (port === '5173') return `${protocol}//${hostname}:5000`
    }
  }

  return ''
}

export const API_BASE_URL = resolveApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function resolveAssetUrl(path) {
  if (!path) return ''
  const normalizedPath = path
    .replace(/\\/g, '/')
    .replace('/uploads/products/', '/uploads/Products/')

  if (normalizedPath.startsWith('http')) return normalizedPath
  if (!API_BASE_URL) return normalizedPath
  return `${API_BASE_URL}${normalizedPath}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medcura_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'
    window.dispatchEvent(
      new CustomEvent('app:error', { detail: { message } })
    )
    if (error.response?.status === 401) {
      const hadToken = Boolean(localStorage.getItem('medcura_token'))
      if (hadToken) {
        localStorage.removeItem('medcura_token')
        localStorage.removeItem('medcura_customer')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api


