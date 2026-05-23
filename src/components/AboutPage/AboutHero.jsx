import { motion as Motion } from 'framer-motion'
import { ArrowRight, Phone, CheckCircle2 } from 'lucide-react'
import aboutbg from '../../assets/aboutbg11.png'
import { primaryContactNumber } from '../../constants/contact.js'

export default function HeroTypographyAlt() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-r  to-[#ece9e4]">
      
      {/* Container - Matching CareHero Structure */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-3">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          
          {/* --- Left Side: Content (Exactly as you had it) --- */}
          <div className="max-w-2xl">
            
            {/* Tag: Pill Style */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0e336b]/10 bg-white px-4 py-1.5 text-sm font-semibold text-[#0e336b] shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3dcbe5] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dcbe5]"></span>
              </span>
              Available in Chennai
            </Motion.div>

            {/* Main Headline */}
            <Motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl leading-[1.5] tracking-tight text-[#0e336b] sm:text-4xl lg:text-6xl"
            >
              <span className="font-medium">Expert medical care.</span> <br />
              {/* Highlighter Effect */}
              <span className="font-black">
                <span className="bg-gradient-to-r from-[#3dcbe5]/30 to-transparent px-2 decoration-clone leading-[1.3]">
                  In your living room.
                </span>
              </span>
            </Motion.h1>

            {/* Description */}
            <Motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-lg text-lg text-[#0e336b]/70 md:text-xl"
            >
              Medcura brings the hospital to you. We provide certified nursing, ICU setups, and elderly care with <span className="font-bold text-[#0e336b] underline decoration-[#3dcbe5] decoration-2 underline-offset-2">zero hassle.</span>
            </Motion.p>

            {/* Checklist */}
            <Motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#0e336b]/80"
            >
              {['Certified Nurses', 'ICU Equipment', 'Post-Op Care'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3dcbe5]" />
                      {item}
                  </div>
              ))}
            </Motion.div>

            {/* Buttons */}
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <button className="flex h-14 items-center gap-2 rounded-full bg-[#0e336b] px-8 text-base font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-lg">
                Book Appointment
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <a href={primaryContactNumber.href} className="flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-bold text-[#0e336b] shadow-sm ring-1 ring-[#0e336b]/10 transition-colors hover:bg-[#f0f9fa] hover:text-[#0e336b]">
                <Phone className="h-5 w-5 text-[#3dcbe5]" />
                Call Now
              </a>
            </Motion.div>
          </div>

          {/* --- Right Side: Image (CareHero Style) --- */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex h-full w-full items-center justify-center lg:justify-center"
          >
            <img 
              src={aboutbg} 
              alt="Expert Medical Care" 
              className="w-full max-w-none object-contain lg:w-[70%]" 
            />
          </Motion.div>

        </div>
      </div>
    </section>
  )
}
