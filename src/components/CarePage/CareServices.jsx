import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

// Central Animated Heart
const CentralHeart = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {/* Pulse Rings */}
    {[1, 2, 3].map((i) => (
      <Motion.circle
        key={i}
        cx="50" cy="50" r={20 + i * 10}
        fill="none"
        stroke="#48d1e9"
        strokeWidth="1"
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
      />
    ))}
    
    {/* Heart Shape */}
    <Motion.path
      d="M50 75 C50 75 25 55 25 40 C25 28 35 20 50 35 C65 20 75 28 75 40 C75 55 50 75 50 75"
      fill="#ef4444"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      style={{ transformOrigin: '50px 50px' }}
    />
    
    {/* ECG Line */}
    <Motion.path
      d="M20 50 L35 50 L40 40 L50 60 L55 45 L60 50 L80 50"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </svg>
)

// Small Equipment Icons
const SmallIcons = {
  bed: () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <rect x="5" y="20" width="30" height="4" rx="1" fill="#0e336b" />
      <rect x="8" y="15" width="24" height="5" rx="1" fill="#48d1e9" />
      <Motion.circle cx="10" cy="28" r="3" fill="#48d1e9" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      <Motion.circle cx="30" cy="28" r="3" fill="#48d1e9" animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
    </svg>
  ),
  monitor: () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <rect x="8" y="8" width="24" height="18" rx="2" fill="#0e336b" />
      <Motion.path
        d="M12 17 L16 17 L18 12 L22 22 L24 15 L28 17"
        fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <rect x="17" y="26" width="6" height="2" fill="#0e336b" />
      <rect x="14" y="28" width="12" height="3" rx="1" fill="#0e336b" />
    </svg>
  ),
  oxygen: () => (
    <svg viewBox="0 0 40 40" className="w-10 h-10">
      <rect x="12" y="8" width="14" height="24" rx="4" fill="#0e336b" />
      <rect x="15" y="5" width="8" height="6" rx="2" fill="#48d1e9" />
      <text x="14" y="24" fill="#48d1e9" fontSize="8" fontWeight="bold">O₂</text>
      {[0, 1].map((i) => (
        <Motion.circle
          key={i}
          cx={30 + i * 4}
          r="2"
          fill="#48d1e9"
          initial={{ cy: 20, opacity: 0.8 }}
          animate={{ cy: 8, opacity: 0 }}
          transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
        />
      ))}
    </svg>
  ),
}

const services = [
  { title: 'Hospital Bed', Icon: SmallIcons.bed, angle: -60 },
  { title: 'Vital Monitor', Icon: SmallIcons.monitor, angle: 0 },
  { title: 'Oxygen System', Icon: SmallIcons.oxygen, angle: 60 },
]

function CareServices() {
  return (
    <section className="px-6 py-20 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Content */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#48d1e9]/10 text-[#48d1e9] text-xs font-bold uppercase tracking-wider mb-6">
              <Motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#48d1e9]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Home ICU Setup
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0e336b] mb-6 leading-tight">
              Everything 
              <span className="text-[#48d1e9]"> Revolves Around</span>
              Patient Care
            </h2>

            <p className="text-lg text-[#0e336b]/60 mb-8">
              Complete ICU infrastructure centered on your loved one's recovery and comfort.
            </p>

            {/* Quick Features */}
            <div className="space-y-3 mb-8">
              {['24/7 technical support','Verified Staffs', 'Anytime Care'].map((item, i) => (
                <Motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#0e336b]/70">{item}</span>
                </Motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="flex items-center gap-2 bg-[#0e336b] !text-white px-7 py-3.5 rounded-full font-semibold hover:bg-[#48d1e9] hover:text-[#0e336b] transition-all"
              >
                Request Setup
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href="tel:+918778790244"
                className="flex items-center gap-2 border-2 border-[#0e336b]/10 text-[#0e336b] px-7 py-3.5 rounded-full font-semibold hover:border-[#48d1e9] transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            </div>
          </Motion.div>
          {/* Radial Illustration */}
          <Motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background Circle */}
            <div className="relative w-72 h-72 md:w-100 md:h-100">
              {/* Outer Ring */}
              <Motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#48d1e9]/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle Ring */}
              <Motion.div
                className="absolute inset-8 rounded-full border border-[#48d1e9]/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />

              {/* Center Heart */}
              <div className="absolute inset-16">
                <CentralHeart />
              </div>

              {/* Orbiting Service Icons */}
              {services.map((service, index) => {
                const angle = service.angle * (Math.PI / 180)
                const radius = 130
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                
                return (
                  <Motion.div
                    key={service.title}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ x, y }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                  >
                    <Motion.div
                      className="flex flex-col items-center"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-[#48d1e9]/20 flex items-center justify-center border border-[#e5e7eb]">
                        <service.Icon />
                      </div>
                      <span className="mt-2 text-xs font-semibold text-[#0e336b] whitespace-nowrap">
                        {service.title}
                      </span>
                    </Motion.div>
                  </Motion.div>
                )
              })}

              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <Motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-[#48d1e9]"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </Motion.div>

        
        </div>
      </div>
    </section>
  )
}

export default CareServices