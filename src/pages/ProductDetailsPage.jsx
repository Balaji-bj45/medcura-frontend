import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Star, CheckCircle2, ShoppingCart, Zap } from 'lucide-react'
import { resolveAssetUrl } from '../services/api.js'
import Loader from '../components/Loader.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getProductById, getProducts } from '../services/products.js'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function normalizeImageSources(product) {
  if (!product) return []

  const rawImages = product.images
  let images = []

  if (Array.isArray(rawImages)) {
    images = rawImages
  } else if (typeof rawImages === 'string') {
    const trimmed = rawImages.trim()
    if (trimmed) {
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed)
          if (Array.isArray(parsed)) {
            images = parsed
          }
        } catch {
          images = []
        }
      }

      if (images.length === 0) {
        images = trimmed.includes(',') ? trimmed.split(',').map((item) => item.trim()) : [trimmed]
      }
    }
  }

  const legacyImages = [product.image, product.imageUrl, product.thumbnail]
  const unique = new Set()

  return [...images, ...legacyImages]
    .filter(Boolean)
    .map((path) => resolveAssetUrl(path))
    .filter((src) => {
      if (!src || unique.has(src)) return false
      unique.add(src)
      return true
    })
}

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('specifications')
  const [zoom, setZoom] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [relatedError, setRelatedError] = useState('')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    setProduct(null)

    getProductById(id)
      .then((data) => {
        if (ignore) return
        setProduct(data)
        setSelectedMediaIndex(0)
        setQuantity(1)
      })
      .catch((err) => {
        if (ignore) return
        setError(err.response?.data?.message || 'Failed to load product.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  useEffect(() => {
    let ignore = false

    setRelatedProducts([])
    setRelatedError('')

    if (!product?.category) {
      setRelatedLoading(false)
      return () => {
        ignore = true
      }
    }

    setRelatedLoading(true)

    getProducts({
      category: product.category,
      sort: 'popular',
      limit: 8,
    })
      .then((data) => {
        if (ignore) return

        const items = Array.isArray(data?.items) ? data.items : []
        const filtered = items.filter((item) => (item._id || item.id) !== id).slice(0, 4)
        setRelatedProducts(filtered)
      })
      .catch((err) => {
        if (ignore) return
        setRelatedError(err.response?.data?.message || 'Failed to load related products.')
      })
      .finally(() => {
        if (!ignore) setRelatedLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id, product?.category])

  const mediaItems = useMemo(() => {
    if (!product) return []

    const items = normalizeImageSources(product).map((src) => ({ type: 'image', src }))
    const videos = Array.isArray(product.videos)
      ? product.videos.filter(Boolean).map((path) => resolveAssetUrl(path))
      : [resolveAssetUrl(product.video)].filter(Boolean)

    videos.forEach((src) => {
      items.push({ type: 'video', src })
    })

    return items
  }, [product])

  useEffect(() => {
    if (selectedMediaIndex >= mediaItems.length) {
      setSelectedMediaIndex(0)
    }
  }, [mediaItems.length, selectedMediaIndex])

  const selectedMedia = mediaItems[selectedMediaIndex]
  const name = product?.name || 'Product'
  const rating = Number(product?.rating || 0).toFixed(1)
  const price = product?.discountPrice ?? product?.salePrice ?? product?.price ?? product?.mrp ?? 0
  const originalPrice = product?.price ?? product?.mrp
  const specifications = Array.isArray(product?.specifications) ? product.specifications : []
  const availableStock = Number(product?.stock ?? 10)
  const inStock = availableStock > 0

  const handleAddToCart = async () => {
    try {
      await addItem(id, quantity)
      addToast('Added to cart.', 'success')
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/products/${id}` } })
        return
      }
      addToast(err.response?.data?.message || 'Unable to add to cart.', 'error')
    }
  }

  const handleBuyNow = async () => {
    try {
      await addItem(id, quantity)
      navigate('/checkout', { replace: false })
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/products/${id}` } })
        return
      }
      addToast(err.response?.data?.message || 'Unable to proceed.', 'error')
    }
  }

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <Loader label="Loading product..." />
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-7xl rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </section>
    )
  }

  if (!product) return null

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <article className="overflow-hidden rounded-3xl border border-[#bdeaf2] bg-white">
            <button
              type="button"
              onClick={() => setZoom((prev) => !prev)}
              className="relative block aspect-[4/3] w-full overflow-hidden bg-[#edfafe] text-left"
            >
              {selectedMedia?.src ? (
                selectedMedia.type === 'video' ? (
                  <video src={selectedMedia.src} controls className="h-full w-full object-cover" />
                ) : (
                  <img
                    src={selectedMedia.src}
                    alt={name}
                    className={`h-full w-full object-cover transition duration-500 ${zoom ? 'scale-110' : 'scale-100'}`}
                  />
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[#0e336b]/50">No media</div>
              )}
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#0e336b]">
                {zoom ? 'Zoom out' : 'Click to zoom'}
              </span>
            </button>

            {mediaItems.length > 1 ? (
              <div className="grid grid-cols-5 gap-2 border-t border-[#d9eef4] p-3">
                {mediaItems.map((item, index) => (
                  <button
                    key={`${item.type}-${item.src}-${index}`}
                    type="button"
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`overflow-hidden rounded-xl border ${
                      selectedMediaIndex === index ? 'border-[#0e336b]' : 'border-[#cdebf2]'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="flex aspect-square items-center justify-center bg-[#0e336b] text-xs font-semibold text-white">
                        VIDEO
                      </div>
                    ) : (
                      <img src={item.src} alt={`${name} ${index + 1}`} className="aspect-square w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            ) : null}
          </article>

          <article className="rounded-3xl border border-[#bdeaf2] bg-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3f6e8a]">{product.category}</p>
            <h1 className="heading-font mt-2 text-3xl font-semibold text-[#0e336b]">{name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff4d5] px-3 py-1 font-semibold text-[#996b00]">
                <Star className="h-4 w-4 fill-[#f4ba43] text-[#f4ba43]" />
                {rating}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-semibold ${inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}
              >
                {inStock ? `${availableStock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mt-5">
              <p className="text-3xl font-bold text-[#0e336b]">{formatPrice(price)}</p>
              {typeof originalPrice === 'number' && originalPrice > price ? (
                <p className="mt-1 text-sm text-[#0e336b]/45 line-through">{formatPrice(originalPrice)}</p>
              ) : null}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="h-10 w-10 rounded-full border border-[#bdeaf2] text-lg font-semibold text-[#0e336b]"
              >
                -
              </button>
              <span className="min-w-8 text-center text-lg font-semibold text-[#0e336b]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="h-10 w-10 rounded-full border border-[#bdeaf2] text-lg font-semibold text-[#0e336b]"
              >
                +
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#0e336b] px-4 py-3 text-sm font-semibold text-[#0e336b] transition hover:bg-[#edfafe] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19559f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                Buy Now
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-[#d8eff4] bg-[#f7fcff] p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('specifications')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    activeTab === 'specifications'
                      ? 'bg-[#0e336b] text-white'
                      : 'border border-[#bdeaf2] text-[#0e336b]'
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('description')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                    activeTab === 'description'
                      ? 'bg-[#0e336b] text-white'
                      : 'border border-[#bdeaf2] text-[#0e336b]'
                  }`}
                >
                  Description
                </button>
              </div>

              {activeTab === 'specifications' ? (
                <div className="mt-4 space-y-2">
                  {specifications.length === 0 ? (
                    <p className="text-sm text-[#0e336b]/65">No specifications available.</p>
                  ) : (
                    specifications.map((spec, index) => (
                      <div key={`${spec.key}-${index}`} className="flex gap-3 rounded-xl bg-white px-3 py-2 text-sm">
                        <p className="min-w-32 font-semibold text-[#0e336b]">{spec.key}</p>
                        <p className="text-[#0e336b]/70">{spec.value}</p>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-[#0e336b]/70">
                  {product.description || 'Detailed product description is unavailable.'}
                </p>
              )}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-2xl bg-[#ecf9ff] p-3 text-sm text-[#0e336b]/75">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3f6e8a]" />
              Installation and operating guidance is available through MedCura support for eligible devices.
            </div>
          </article>
        </div>

        {(relatedLoading || relatedError || relatedProducts.length > 0) && (
          <div className="mt-12 rounded-3xl border border-[#c9ecf3] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3f6e8a]">More to Explore</p>
                <h2 className="heading-font mt-2 text-2xl font-semibold text-[#0e336b]">Related Products</h2>
              </div>
              {product.category ? (
                <p className="text-sm text-[#0e336b]/65">Showing similar equipment from {product.category}.</p>
              ) : null}
            </div>

            {relatedLoading ? (
              <div className="mt-6">
                <Loader label="Loading related products..." />
              </div>
            ) : null}

            {!relatedLoading && relatedError ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {relatedError}
              </div>
            ) : null}

            {!relatedLoading && !relatedError && relatedProducts.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id || item.id} product={item} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
