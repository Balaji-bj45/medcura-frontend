import { Link } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { primaryContactNumber } from '../../constants/contact.js'

function CareCta() {
  return (
    <section className="px-6 pb-20 md:px-10 md:pb-28">
      <Motion.div
        className="mx-auto max-w-6xl rounded-3xl border border-[#0e336b]/15 bg-gradient-to-r from-[#0e336b] to-[#14508f] p-8 md:p-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fe6f6]">Need Immediate Support</p>
        <h3 className="mt-3 max-w-3xl text-3xl font-bold text-white md:text-4xl">Request Home ICU Setup for Your Patient</h3>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base">
          Share your requirement now. Our team will confirm equipment options, delivery timeline, and same-day
          availability where applicable.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link to="/contact" className="rounded-full bg-[#48d1e9] px-6 py-3 text-sm font-semibold text-[#0e336b]">
            Request Home ICU Setup
          </Link>
          <a
            href={primaryContactNumber.href}
            className="rounded-full border border-white/50 px-6 py-3 text-sm font-semibold !text-white"
          >
            Call Care Desk
          </a>
          <Link to="/contact" className="rounded-full border border-[#7fe6f6]/60 px-6 py-3 text-sm font-semibold !text-white">
            Check Same-day Availability
          </Link>
        </div>
      </Motion.div>
    </section>
  )
}

export default CareCta
