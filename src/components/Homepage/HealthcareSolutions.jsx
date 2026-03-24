import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard.jsx'
import { getFeaturedProducts } from '../../services/products.js'

function HealthcareSolutions() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    getFeaturedProducts(8)
      .then((data) => {
        if (!ignore) setProducts(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="heading-font text-3xl font-semibold text-[#0e336b] sm:text-4xl">Featured Products</h2>
            <p className="mt-2 text-sm text-[#0e336b]/70 sm:text-base">
              New arrivals and prioritized products from our medical catalog.
            </p>
          </div>
          <Link
            to="/products?featured=true"
            className="rounded-full border border-[#3dcbe5] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0e336b] transition hover:bg-[#edfcfe]"
          >
            View featured
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-[#0e336b]/60">Loading featured products...</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} badgeLabel="New Arrival" />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HealthcareSolutions
