import { motion as Motion } from 'framer-motion'

function AboutCta() {
  return (
    <section className="px-6 pb-20 md:px-10 md:pb-28">
      <Motion.div
        className="mx-auto max-w-6xl rounded-3xl border border-[#3dcbe5] bg-[#0e336b] px-8 py-12 text-center text-[#edfcfe] md:px-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#48d1e9]">The Medcura Promise</p>
        <h3 className="mt-3 text-3xl font-bold md:text-4xl">Trusted Care. Modern Solutions. Better Health.</h3>
        <p className="mx-auto mt-4 max-w-2xl text-[#edfcfe]/90">
          Delivering healthcare solutions you can rely on, every step of the way.
        </p>
      </Motion.div>
    </section>
  )
}

export default AboutCta

