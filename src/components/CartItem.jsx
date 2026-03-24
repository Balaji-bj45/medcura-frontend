import { resolveAssetUrl } from '../services/api.js'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CartItem({ item, onUpdate, onRemove, isUpdating }) {
  const product = item.product || item
  const name = product.name || product.title || 'Product'
  const unitPrice =
    product.discountPrice ?? product.salePrice ?? product.effectivePrice ?? product.price ?? product.mrp ?? 0
  const imageUrl = resolveAssetUrl(
    product.images?.[0] || product.image || product.imageUrl || product.thumbnail
  )

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#c5ebf3] bg-white p-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#edfafe]">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#0e336b]/45">No image</div>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3f6e8a]">{product.category}</p>
        <h3 className="mt-1 heading-font text-lg font-semibold text-[#0e336b]">{name}</h3>
        <p className="mt-1 text-sm text-[#0e336b]/65">Unit Price: {formatPrice(unitPrice)}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-[#bce8f2] px-3 py-1">
          <button
            type="button"
            onClick={() => onUpdate(item, Math.max(1, (item.quantity || 1) - 1))}
            className="px-2 text-lg font-semibold text-[#0e336b]"
            disabled={isUpdating}
          >
            -
          </button>
          <span className="px-3 text-sm font-semibold text-[#0e336b]">{item.quantity || 1}</span>
          <button
            type="button"
            onClick={() => onUpdate(item, (item.quantity || 1) + 1)}
            className="px-2 text-lg font-semibold text-[#0e336b]"
            disabled={isUpdating}
          >
            +
          </button>
        </div>

        <div className="min-w-24 text-right">
          <p className="text-xs text-[#0e336b]/55">Total</p>
          <p className="text-base font-semibold text-[#0e336b]">{formatPrice(unitPrice * (item.quantity || 1))}</p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item)}
          className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-red-600 transition hover:bg-red-50"
          disabled={isUpdating}
        >
          Remove
        </button>
      </div>
    </article>
  )
}
