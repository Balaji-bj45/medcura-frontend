import { motion as Motion } from 'framer-motion'
import HospitalMonitor from '../../assets/HospitalMonitor.png'
import Delivery from '../../assets/Delivery.png'
import SameDaySupport from '../../assets/Support1.png'

const highlights = [
  {
    title: 'Hospital Bed + Monitoring',
    details: [
      'Includes hospital bed, monitor setup, and oxygen support as per patient requirement.',
      'Professional medical-grade equipment ensuring ICU-level care at home.',
      '24/7 monitoring capabilities with real-time health tracking systems.'
    ],
    image: HospitalMonitor,
  },
  {
    title: 'Delivery and Installation',
    details: [
      'End-to-end delivery, placement, and installation handled by trained support staff.',
      'Complete equipment testing and calibration before handover to family.',
      'Comprehensive training provided to family members on equipment usage.'
    ],
    image: Delivery,
  },
  {
    title: 'Same-day Support Window',
    details: [
      'Same-day availability in select service areas when equipment and team slots are open.',
      'Priority emergency response for critical care requirements.',
      'Dedicated support team available for queries and assistance round the clock.'
    ],
    image: SameDaySupport,
  },
]

function CareApproach() {
  return (
    <section className="px-6 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <Motion.span
              className="text-[#48d1e9] text-sm font-semibold uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Care Services
            </Motion.span>
            <Motion.h2
              className="mt-2 text-3xl font-bold text-[#0e336b] md:text-4xl lg:text-5xl"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Home ICU Setup for Family Comfort
            </Motion.h2>
          </div>
          <Motion.p
            className="text-[#0e336b]/60 max-w-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            We bring core ICU infrastructure into the home with a setup flow focused on speed, safety, and clarity.
          </Motion.p>
        </div>

        {/* Horizontal Cards */}
        <div className="space-y-6">
          {highlights.map((item, index) => (
            <Motion.article
              key={item.title}
              className="group grid md:grid-cols-2 gap-6 p-4 rounded-3xl bg-white border border-[#98deed]/30 hover:border-[#48d1e9] hover:shadow-xl hover:shadow-[#48d1e9]/10 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Image - Full Cover */}
              <div className={`relative rounded-2xl overflow-hidden h-72 md:h-80 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 h-12 w-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center font-bold text-[#0e336b] shadow-lg z-10">
                  {`0${index + 1}`}
                </div>
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center p-4 md:p-8 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <h3 className="text-2xl font-bold text-[#0e336b] group-hover:text-[#48d1e9] transition-colors">
                  {item.title}
                </h3>
                
                {/* 3 Line Details */}
                <ul className="mt-4 space-y-3">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[#0e336b]/60 leading-relaxed">
                      <svg 
                        className="w-5 h-5 text-[#0e336b] flex-shrink-0 mt-0.5" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-sm md:text-base">{detail}</span>
                    </li>
                  ))}
                </ul>

              <a href="/products"><button className="mt-6 inline-flex items-center gap-2 text-[#0e336b] font-semibold text-sm hover:gap-3 transition-all cursor-pointer">
                 view products
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button></a>  
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CareApproach