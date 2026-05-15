import { useEffect, useMemo, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { getCategories } from '../../services/categories.js'
import { MEDCURA_CATEGORIES } from '../../constants/catalog.js'

function getFallbackCategory(name) {
  return MEDCURA_CATEGORIES.find((item) => item.name === name)
}

function ShopByCategory() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    getCategories()
      .then((data) => {
        if (ignore) return
        setLoadFailed(false)
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (ignore) return
        setLoadFailed(true)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const visibleCategories = useMemo(() => {
    const fromApi = categories.filter((item) => item?.isActive !== false)
    return loadFailed ? MEDCURA_CATEGORIES : fromApi
  }, [categories, loadFailed])

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="heading-font text-3xl font-semibold text-[#0e336b] sm:text-4xl">Shop by Category</h2>
            <p className="mt-3 text-sm text-[#0e336b]/65 sm:text-base">
              Dedicated medical categories built for real clinical and home-care workflows.
            </p>
          </div>

          <Link
            to="/products"
            className="rounded-full border border-[#3dcbe5] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#0e336b] transition hover:bg-[#edfcfe]"
          >
            View all products
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map((category, index) => {
            const fallback = getFallbackCategory(category.name)
            const description =
              category.description ||
              fallback?.description ||
              'Curated products for specialized medical use cases.'

            return (
              <Motion.div
                key={category._id || category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="group block rounded-3xl border border-[#bdeaf2] bg-[#f6fdff] p-5 transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-35px_rgba(14,51,107,0.5)]"
                >
                  <h3 className="text-lg font-semibold text-[#0e336b]">{category.name}</h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#0e336b]/70">{description}</p>

                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#3f6e8a]">
                    Browse products
                    <span className="transition-transform group-hover:translate-x-1">{'>'}</span>
                  </span>
                </Link>
              </Motion.div>
            )
          })}
        </div>

        {loading && <p className="mt-4 text-sm text-[#0e336b]/60">Loading categories...</p>}
      </div>
    </section>
  )
}

export default ShopByCategory
