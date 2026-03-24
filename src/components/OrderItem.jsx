import { Link } from 'react-router-dom'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function OrderItem({ order }) {
  const items = order.items || []
  const total = order.amount || order.total || order.orderTotal
  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Pending'

  const orderId = order._id || order.id

  return (
    <div className="rounded-2xl border border-[#c9edf3] bg-white p-5 shadow-[0_18px_45px_-36px_rgba(14,51,107,0.4)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="heading-font text-lg font-semibold text-[#0e336b]">
            Order #{orderId}
          </h3>
          <p className="text-sm text-[#0e336b]/60">{createdAt}</p>
        </div>
        <span className="rounded-full bg-[#e9f8fd] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0e336b]">
          {order.status || 'Processing'}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-[#0e336b]/70">
        {items.length === 0 && <p>No items listed.</p>}
        {items.slice(0, 3).map((item) => (
          <div
            key={item.product?._id || item.productId || item._id}
            className="flex justify-between"
          >
            <span>{item.name || item.product?.name || 'Item'}</span>
            <span>x{item.quantity || 1}</span>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-[#0e336b]/45">+ {items.length - 3} more items</p>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-[#d8eef4] pt-4 text-sm font-semibold text-[#0e336b]">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Link
        to={`/orders/${orderId}`}
        className="mt-4 inline-flex rounded-full border border-[#8ccddd] px-4 py-1.5 text-xs font-semibold text-[#0e336b] transition hover:bg-[#f3fbff]"
      >
        View details
      </Link>
    </div>
  )
}
