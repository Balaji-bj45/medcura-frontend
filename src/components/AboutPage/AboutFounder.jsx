import { motion as Motion } from 'framer-motion'
import { ArrowRight, Clock3, MapPin, BadgeCheck } from 'lucide-react'
import founderImage from '../../assets/founder/IMG_2319.JPG.jpeg'

const highlights = [
  { icon: Clock3, text: '9+ years experience' },
  { icon: MapPin, text: 'Chennai based' },
  { icon: BadgeCheck, text: 'Trusted service' },
]

export default function AboutFounder() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <Motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-[#3dcbe5] tracking-wider uppercase mb-4"
        >
          About the Founder
        </Motion.p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src={founderImage}
                alt="Founder"
                className="w-full aspect-[4/5] object-cover rounded-3xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-[#0e336b] text-white px-6 py-3 rounded-2xl shadow-lg">
                <p className="text-2xl font-bold">9+</p>
                <p className="text-xs text-white/70">Years</p>
              </div>
            </div>
          </Motion.div>

          {/* Content */}
          <Motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0e336b] leading-tight">
              Built to make home-care support feel faster and more human.
            </h2>

          

              <p className=" leading-relaxed">
          MedCura was shaped by a simple belief: families should not struggle to find trusted medical equipment at
          the moment they need it most. That belief continues to guide how the company operates every day.
        </p>
        <p>
          From recovery care at home to hospital-grade support for clinics and care teams, the founder&apos;s focus
          has always been on quick response, practical guidance, and dependable service that reduces stress for
          patients and caregivers.
        </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-3">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full"
                >
                  <item.icon className="w-4 h-4 text-[#3dcbe5]" />
                  <span className="text-sm text-slate-700">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="border-l-4 border-[#3dcbe5] pl-4 py-2">
              <p className="text-slate-500 italic">
                "Good healthcare support is about showing up on time and making care feel manageable."
              </p>
            </blockquote>

          
          </Motion.div>
        </div>
      </div>
    </section>
  )
}