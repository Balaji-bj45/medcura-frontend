import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const TOKEN_KEY = 'medcura_token'
const CUSTOMER_KEY = 'medcura_customer'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [customer, setCustomer] = useState(() => {
    const stored = localStorage.getItem(CUSTOMER_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  })

  const login = (nextToken, nextCustomer) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    if (nextCustomer) {
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(nextCustomer))
      setCustomer(nextCustomer)
    }
  }

  const updateCustomer = (nextCustomer) => {
    if (!nextCustomer) return
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(nextCustomer))
    setCustomer(nextCustomer)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(CUSTOMER_KEY)
    setToken(null)
    setCustomer(null)
  }

  const value = useMemo(
    () => ({ token, customer, login, logout, updateCustomer }),
    [token, customer]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
