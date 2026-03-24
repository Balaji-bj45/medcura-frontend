import { useEffect, useState } from 'react'
import OrderItem from '../components/OrderItem.jsx'
import Loader from '../components/Loader.jsx'
import { getMyOrders } from '../services/orders.js'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    getMyOrders()
      .then((data) => {
        if (ignore) return
        setOrders(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (ignore) return
        setError(err.response?.data?.message || 'Failed to load orders.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">
          My Orders
        </h1>
        <p className="mt-2 text-sm text-[#0e336b]/65">
          Track your recent purchases and order status.
        </p>
      </div>
      {loading && (
        <div className="mt-8">
          <Loader label="Loading orders..." />
        </div>
      )}
      {error && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && orders.length === 0 && (
        <div className="mt-8 rounded-2xl border border-[#bce8f2] bg-white p-6 text-sm text-[#0e336b]/68 shadow-sm">
          You have no orders yet.
        </div>
      )}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {orders.map((order) => (
          <OrderItem key={order._id || order.id} order={order} />
        ))}
      </div>
      </section>
  
  )
}
