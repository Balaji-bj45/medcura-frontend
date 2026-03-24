import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const faqItems = [
  {
    question: 'Share patient details and location',
    answer: 'Provide us with essential patient information including medical history, current condition, and your location. Our team will assess the requirements and confirm the feasibility of home ICU setup.'
  },
  {
    question: 'Get setup confirmation from our team',
    answer: 'Our medical experts will review your request and provide confirmation within hours. We\'ll discuss equipment needs, care requirements, and scheduling details with you.'
  },
  {
    question: 'Receive equipment delivery and installation',
    answer: 'Our trained technicians will deliver all necessary ICU equipment to your home and ensure proper installation. All devices are tested and calibrated for optimal performance.'
  },
  {
    question: 'Begin care with guided handover',
    answer: 'Our medical team will conduct a comprehensive handover, training family members on basic care protocols and emergency procedures. 24/7 support begins immediately.'
  },
]

function CareStandards() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-[#f0fdff] to-[#e8f9fc] px-4 py-16 sm:px-6 md:px-10 md:py-20 lg:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <Motion.div
          className="mb-10 text-center md:mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#48d1e9] md:text-sm">
            How It Works
          </p>
          <h2 className="mt-4 text-3xl font-bold text-[#0e336b] md:text-4xl lg:text-5xl">
            Simple 4-Step Home ICU Setup Flow
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#0e336b]/60 md:text-lg">
            Getting started with our home ICU service is quick and hassle-free. Follow these simple steps.
          </p>
        </Motion.div>

        {/* FAQ Accordion */}
        <Motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {faqItems.map((item, index) => (
            <Motion.div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#a6e6f2] bg-white shadow-sm transition-shadow hover:shadow-md md:rounded-3xl"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#48d1e9]/5 md:px-8 md:py-5"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#48d1e9] to-[#3bb8cf] text-sm font-bold text-white shadow-md md:h-12 md:w-12 md:text-base">
                    {index + 1}
                  </span>
                  <span className="text-base font-semibold text-[#0e336b] md:text-lg">
                    {item.question}
                  </span>
                </div>
                <Motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#48d1e9]/10 md:h-10 md:w-10"
                >
                  <svg
                    className="h-5 w-5 text-[#48d1e9] md:h-6 md:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="border-t border-[#a6e6f2] bg-[#f8fdfe] px-5 py-4 md:px-8 md:py-6">
                      <div className="ml-0 md:ml-16">
                        <p className="text-sm leading-relaxed text-[#0e336b]/70 md:text-base">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          ))}
        </Motion.div>

      </div>
    </section>
  )
}

export default CareStandards