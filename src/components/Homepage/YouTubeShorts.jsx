import { motion as Motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CHANNEL_URL = 'https://youtube.com/@medcubeequipments?si=VjbWW_dogdvbQpoO'
const SHORT_IDS = [
  '08mkfuKlhLk',
  'DhnlVgIuntA',
  '_oy8HXCHCbw',
  'PcOeWt5C4Ic',
  'M1ZkOsLPyMo',
  'U2UJY6wwUBg',
]

function YouTubeShorts() {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = 300
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#48d1e9]">
              YouTube Shorts
            </span>
            <h2 className="mt-3 text-[1.85rem] font-bold leading-tight text-[#0e336b] md:text-[2.5rem]">
              Watch All Shorts
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation Arrows */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e336b]/20 text-[#0e336b] transition hover:border-[#48d1e9] hover:bg-[#48d1e9] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#0e336b]/20 disabled:hover:bg-transparent disabled:hover:text-[#0e336b]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e336b]/20 text-[#0e336b] transition hover:border-[#48d1e9] hover:bg-[#48d1e9] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#0e336b]/20 disabled:hover:bg-transparent disabled:hover:text-[#0e336b]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-full border border-[#0e336b]/20 px-5 py-2.5 text-sm font-semibold text-[#0e336b] transition hover:border-[#48d1e9] hover:text-[#48d1e9]"
            >
              Visit YouTube Channel
            </a>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Left Gradient Fade */}
          {canScrollLeft && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
          )}

          {/* Right Gradient Fade */}
          {canScrollRight && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />
          )}

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {SHORT_IDS.map((shortId, index) => (
              <Motion.div
                key={shortId}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="w-[260px] flex-shrink-0 overflow-hidden rounded-3xl border border-[#0e336b]/10 bg-[#edfcfe] p-3 shadow-lg sm:w-[280px]"
              >
                <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${shortId}?rel=0`}
                    title={`MedCube Equipments YouTube Short ${index + 1}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </Motion.div>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e336b]/20 text-[#0e336b] transition hover:border-[#48d1e9] hover:bg-[#48d1e9] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0e336b]/20 text-[#0e336b] transition hover:border-[#48d1e9] hover:bg-[#48d1e9] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hide scrollbar for WebKit browsers */}
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default YouTubeShorts