'use client'

import { motion as Motion } from 'framer-motion'
import { Activity, Eye } from 'lucide-react'

function AboutMetrics() {
  return (
    <section className="px-6 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        
        {/* Mission Card - Light & Airy */}
        <Motion.article
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#f0f9fa] p-8 md:p-10"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Decorative Icon Background */}
          <Activity className="absolute -right-6 -top-6 h-48 w-48 text-[#3dcbe5]/10 rotate-12" />
          
          <div className="relative z-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0e336b] text-white shadow-lg">
              <Activity className="h-6 w-6" />
            </div>
            
            <h3 className="text-3xl font-bold tracking-tight text-[#0e336b]">Our Mission</h3>
            <div className="mt-2 h-1 w-12 rounded-full bg-[#3dcbe5]" />
            
            <p className="mt-6 text-lg leading-relaxed text-[#0e336b]/80">
              We empower people to manage their health with confidence. By delivering 
              <span className="font-semibold"> affordable, certified, and accessible</span> medical products, 
              we simplify healthcare decisions without compromising on safety.
            </p>
          </div>
        </Motion.article>

        {/* Vision Card - Bold & Solid */}
        <Motion.article
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0e336b] p-8 md:p-10 text-white"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Decorative Icon Background */}
          <Eye className="absolute -right-6 -bottom-6 h-48 w-48 text-white/5 -rotate-12" />

          <div className="relative z-10">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3dcbe5] text-[#0e336b] shadow-lg">
              <Eye className="h-6 w-6" />
            </div>

            <h3 className="text-3xl font-bold tracking-tight text-white">Our Vision</h3>
            <div className="mt-2 h-1 w-12 rounded-full bg-[#3dcbe5]" />

            <p className="mt-6 text-lg leading-relaxed text-blue-100">
              To be the trusted healthcare partner for families and professionals. 
              We are redefining the experience to create a future where quality healthcare is 
              <span className="font-semibold text-[#3dcbe5]"> understood, immediate, and universally accessible.</span>
            </p>
          </div>
        </Motion.article>

      </div>
    </section>
  )
}

export default AboutMetrics
