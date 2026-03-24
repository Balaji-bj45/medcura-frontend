import axios from 'axios'

export const ADMIN_TOKEN_KEY = 'medcura_admin_token'
export const ADMIN_USER_KEY = 'medcura_admin_user'

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

const API_BASE_URL = resolveApiBaseUrl()

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    window.dispatchEvent(new CustomEvent('app:error', { detail: { message } }))

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
      localStorage.removeItem(ADMIN_USER_KEY)
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }

    return Promise.reject(error)
  }
)

export default adminApi
