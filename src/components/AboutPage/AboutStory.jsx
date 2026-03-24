import { motion } from 'framer-motion'
import { Quote, Activity, HeartHandshake } from 'lucide-react'
import aboutbg3 from '../../assets/aboutbg3.png'

function AboutStory() {
  return (
    <section 
      className="relative flex min-h-screen flex-col justify-start overflow-hidden bg-cover bg-no-repeat pt-16 md:pt-24 pb-96" // Added large bottom padding to ensure text doesn't overlap image subject
      style={{ 
        backgroundImage: `url(${aboutbg3})`,
        backgroundPosition: 'center bottom', // Key change: Anchors image to bottom
      }}
    >
      {/* --- Overlay (Top to Bottom) --- 
          Solid at top for text, transparent at bottom for image.
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#edfcfe] via-white/95 to-transparent h-[70%]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-10">
        
        {/* --- CONTENT AT TOP --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          
          {/* Decorative Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-[#0e336b]"
          >
            <Quote className="h-6 w-6 fill-current opacity-50" />
          </motion.div>

          {/* Headline */}
          <h2 className="text-4xl font-bold leading-tight text-[#0e336b] md:text-5xl lg:text-6xl">
            Who We Are
            <span className="block mt-2 text-3xl font-medium italic text-[#3dcbe5] md:text-4xl font-serif">
              & Our Promise to You.
            </span>
          </h2>

          {/* Narrative Content - Centered & Width Constrained */}
          <div className="mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-[#0e336b]/80 md:text-xl">
            <p>
              Medcura is more than a medical equipment provider; we are a Tamil Nadu–based partner in your recovery journey. Specializing in home care, post-surgical recovery, and long-term patient support.
            </p>
            
            <p className="font-medium italic text-[#0e336b]">
              "With over 9 years of operational experience, we work closely with hospitals, clinics, and families to ensure patients receive the right equipment at the right time."
            </p>

            <p>
              Our strength lies in <span className="font-bold underline decoration-[#3dcbe5]/40 underline-offset-4">rapid delivery</span> and a customer-first approach that brings confidence to every healthcare decision.
            </p>
          </div>

          {/* Stats Area - Centered Row */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-8 md:gap-16 border-t border-[#0e336b]/10 pt-8">
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edfcfe] text-[#0e336b]">
                <Activity className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0e336b] leading-none">9+</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0e336b]/60">Years Active</p>
              </div>
            </div>

            <div className="h-12 w-px bg-[#0e336b]/20 hidden sm:block"></div>

            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edfcfe] text-[#0e336b]">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[#0e336b] leading-none">100%</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0e336b]/60">Support</p>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </section>
  )
}

export default AboutStory