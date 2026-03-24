import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import ProductCard from '../ProductCard.jsx'
import { getBestSellerProducts } from '../../services/products.js'

function BestSellingEquipment() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    getBestSellerProducts(8)
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
    <section className="bg-[#edfcfe] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="heading-font text-3xl font-semibold text-[#0e336b] sm:text-4xl">Best Sellers</h2>
            <p className="mt-2 text-sm text-[#0e336b]/70 sm:text-base">
              Most purchased equipment from home-care and clinical buyers.
            </p>
          </div>
          <Link
            to="/products?sort=popular"
            className="rounded-full border border-[#3dcbe5] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0e336b] transition hover:bg-[#dff7fb]"
          >
            See all best sellers
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-sm text-[#0e336b]/60">Loading best sellers...</p>
        ) : (
          <Motion.div
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} badgeLabel="Best Sale" />
            ))}
          </Motion.div>
        )}
      </div>
    </section>
  )
}

export default BestSellingEquipment

