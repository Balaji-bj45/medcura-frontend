import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

function NeedHelpChoosing() {
  return (
    <section className="bg-white mt-10 px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 rounded-[2rem] bg-[#edfcfe] p-8 md:flex-row md:items-center md:p-12"
      >
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e336b]/10 text-[#0e336b]">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0e336b]">Critical Care Support</span>
          </div>
          
          <h3 className="text-3xl font-bold text-[#0e336b] md:text-4xl">
            Need Home ICU Setup?
          </h3>
          <p className="mt-4 text-[0.95rem] font-medium leading-relaxed text-[#0e336b]/70">
            Request rapid setup assistance for hospital beds, oxygen systems, monitoring equipment, and caregiver coordination.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/care"
            className="group inline-flex items-center gap-2 rounded-full bg-[#0e336b] px-8 py-4 text-sm font-semibold !text-white transition-all hover:bg-[#09254a] hover:shadow-lg hover:shadow-[#0e336b]/20"
          >
            Go to Care Services
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Motion.div>
    </section>
  )
}

export default NeedHelpChoosing