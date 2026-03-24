import { createContext, useContext, useMemo, useState } from 'react'
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../services/adminApi.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY))
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem(ADMIN_USER_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = (nextToken, nextAdmin) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, nextToken)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(nextAdmin))
    setToken(nextToken)
    setAdmin(nextAdmin)
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    localStorage.removeItem(ADMIN_USER_KEY)
    setToken(null)
    setAdmin(null)
  }

  const value = useMemo(
    () => ({ token, admin, login, logout, isAuthenticated: Boolean(token) }),
    [token, admin]
  )

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
