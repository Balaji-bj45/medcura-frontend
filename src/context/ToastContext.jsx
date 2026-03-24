import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message, tone = 'info') => {
    const id = `${Date.now()}-${idCounter++}`
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => removeToast(id), 3500)
  }, [removeToast])

  useEffect(() => {
    const handler = (event) => {
      if (event.detail?.message) {
        addToast(event.detail.message, 'error')
      }
    }
    window.addEventListener('app:error', handler)
    return () => window.removeEventListener('app:error', handler)
  }, [addToast])

  const value = useMemo(
    () => ({ toasts, addToast, removeToast }),
    [toasts, addToast, removeToast]
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
