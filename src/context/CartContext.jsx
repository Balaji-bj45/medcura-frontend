import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAuth } from './AuthContext.jsx'
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../services/cart.js'

const CartContext = createContext(null)

function normalizeCart(data) {
  if (!data || !Array.isArray(data.items)) {
    return { items: [] }
  }
  return data
}

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart({ items: [] })
      return { items: [] }
    }
    setLoading(true)
    setError('')
    try {
      const data = await getCart()
      setCart(normalizeCart(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const addItem = useCallback(async (productId, quantity) => {
    setLoading(true)
    setError('')
    try {
      const data = await addToCart(productId, quantity)
      setCart(normalizeCart(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateItem = useCallback(async (productId, quantity) => {
    setLoading(true)
    setError('')
    try {
      const data = await updateCartItem(productId, quantity)
      setCart(normalizeCart(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cart.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeItem = useCallback(async (productId) => {
    setLoading(true)
    setError('')
    try {
      const data = await removeCartItem(productId)
      setCart(normalizeCart(data))
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCartState = useCallback(() => {
    setCart({ items: [] })
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const count = cart.items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  )

  const value = useMemo(
    () => ({
      cart,
      items: cart.items,
      count,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clearCartState,
    }),
    [
      cart,
      count,
      loading,
      error,
      refreshCart,
      addItem,
      updateItem,
      removeItem,
      clearCartState,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
