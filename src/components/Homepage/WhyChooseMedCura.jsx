import {
  motion as Motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from 'framer-motion'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

const reasons = [
  {
    title: 'Certified Products',
    description:
      'Every listed item is quality-checked and sourced from trusted medical suppliers with full traceability.',
    color: '#3b9cb5',
    accent: '#e0f5fa',
    illustration: (
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <Motion.path
          d="M100 20 L160 50 V110 C160 150 130 175 100 185 C70 175 40 150 40 110 V50 L100 20Z"
          stroke="#3b9cb5"
          strokeWidth="2.5"
          fill="#e0f5fa"
          fillOpacity="0.3"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 0.3 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        />
        <Motion.path
          d="M100 40 L145 62 V108 C145 138 122 158 100 166 C78 158 55 138 55 108 V62 L100 40Z"
          fill="#3b9cb5"
          fillOpacity="0.08"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />
        <Motion.path
          d="M78 105 L92 119 L125 86"
          stroke="#3b9cb5"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6, ease: 'easeOut' }}
        />
        {[
          { cx: 30, cy: 30 },
          { cx: 170, cy: 40 },
          { cx: 25, cy: 140 },
          { cx: 175, cy: 130 },
        ].map((pos, i) => (
          <Motion.circle
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            r="3"
            fill="#3b9cb5"
            fillOpacity="0.3"
            initial={{ scale: 0 }}
            whileInView={{ scale: [0, 1.5, 1] }}
            viewport={{ once: true }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
          />
        ))}
        <Motion.path
          d="M165 85 L175 80 M168 92 L178 90"
          stroke="#3b9cb5"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, duration: 0.4 }}
        />
      </svg>
    ),
  },
  {
    title: 'Home Installation',
    description:
      'Guided setup assistance for critical equipment and home ICU configurations by trained professionals.',
    color: '#2a7fb5',
    accent: '#dceefb',
    illustration: (
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <Motion.path
          d="M40 100 L40 165 C40 168 42 170 45 170 L155 170 C158 170 160 168 160 165 L160 100"
          stroke="#2a7fb5"
          strokeWidth="2.5"
          fill="#dceefb"
          fillOpacity="0.25"
          initial={{ pathLength: 0, fillOpacity: 0 }}
          whileInView={{ pathLength: 1, fillOpacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
        <Motion.path
          d="M25 105 L100 45 L175 105"
          stroke="#2a7fb5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
        <Motion.rect
          x="82"
          y="125"
          width="36"
          height="45"
          rx="4"
          stroke="#2a7fb5"
          strokeWidth="2"
          fill="#2a7fb5"
          fillOpacity="0.1"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '100px 170px' }}
        />
        <Motion.circle
          cx="112"
          cy="150"
          r="2.5"
          fill="#2a7fb5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, type: 'spring' }}
        />
        <Motion.rect
          x="50"
          y="110"
          width="22"
          height="22"
          rx="3"
          stroke="#2a7fb5"
          strokeWidth="1.5"
          fill="#2a7fb5"
          fillOpacity="0.08"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, type: 'spring' }}
        />
        <Motion.line
          x1="61"
          y1="110"
          x2="61"
          y2="132"
          stroke="#2a7fb5"
          strokeWidth="1"
          opacity="0.4"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 }}
        />
        <Motion.line
          x1="50"
          y1="121"
          x2="72"
          y2="121"
          stroke="#2a7fb5"
          strokeWidth="1"
          opacity="0.4"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        />
        <Motion.rect
          x="128"
          y="110"
          width="22"
          height="22"
          rx="3"
          stroke="#2a7fb5"
          strokeWidth="1.5"
          fill="#2a7fb5"
          fillOpacity="0.08"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, type: 'spring' }}
        />
        <Motion.g
          initial={{ y: 10, opacity: 0, rotate: -15 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 0.6, type: 'spring' }}
        >
          <circle cx="165" cy="55" r="18" fill="#2a7fb5" fillOpacity="0.1" stroke="#2a7fb5" strokeWidth="1.5" />
          <path d="M158 55 L162 51 L168 57 L172 53" stroke="#2a7fb5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="160" cy="53" r="3" fill="none" stroke="#2a7fb5" strokeWidth="1.5" />
        </Motion.g>
        <Motion.rect
          x="130"
          y="55"
          width="14"
          height="25"
          rx="2"
          stroke="#2a7fb5"
          strokeWidth="1.5"
          fill="none"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{ transformOrigin: '137px 80px' }}
        />
        {[0, 1, 2].map((i) => (
          <Motion.circle
            key={i}
            cx={135 + i * 5}
            cy={48 - i * 8}
            r={3 + i}
            fill="#2a7fb5"
            fillOpacity="0.1"
            initial={{ y: 10, opacity: 0 }}
            whileInView={{
              y: [10, -5],
              opacity: [0, 0.15, 0],
            }}
            viewport={{ once: true }}
            transition={{
              delay: 1.5 + i * 0.3,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        ))}
      </svg>
    ),
  },
  {
    title: 'Same-Day Delivery',
    description:
      'Priority dispatch available in selected locations for urgent care requirements with live tracking.',
    color: '#1d6aa5',
    accent: '#d8e8f8',
    illustration: (
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <Motion.path
          d="M0 155 Q50 145 100 155 Q150 165 200 155"
          stroke="#1d6aa5"
          strokeWidth="2"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        {[30, 70, 110, 150].map((x, i) => (
          <Motion.line
            key={i}
            x1={x}
            y1="158"
            x2={x + 15}
            y2="156"
            stroke="#1d6aa5"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        ))}
        <Motion.g
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1.2, type: 'spring', stiffness: 40 }}
        >
          <rect x="35" y="95" width="80" height="50" rx="6" fill="#d8e8f8" fillOpacity="0.5" stroke="#1d6aa5" strokeWidth="2" />
          <path d="M115 105 L140 105 C144 105 147 108 147 112 L147 145 L115 145 L115 105Z" fill="#d8e8f8" fillOpacity="0.3" stroke="#1d6aa5" strokeWidth="2" />
          <path d="M118 108 L135 108 C138 108 140 110 140 113 L140 125 L118 125Z" fill="#1d6aa5" fillOpacity="0.1" stroke="#1d6aa5" strokeWidth="1.5" />
          <rect x="62" y="108" width="20" height="4" rx="2" fill="#1d6aa5" fillOpacity="0.3" />
          <rect x="70" y="100" width="4" height="20" rx="2" fill="#1d6aa5" fillOpacity="0.3" />
          <circle cx="147" cy="135" r="3" fill="#1d6aa5" fillOpacity="0.4" />
        </Motion.g>
        <Motion.g
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
        >
          <circle cx="60" cy="148" r="10" fill="white" stroke="#1d6aa5" strokeWidth="2.5" />
          <circle cx="60" cy="148" r="4" fill="#1d6aa5" fillOpacity="0.3" />
          <circle cx="130" cy="148" r="10" fill="white" stroke="#1d6aa5" strokeWidth="2.5" />
          <circle cx="130" cy="148" r="4" fill="#1d6aa5" fillOpacity="0.3" />
        </Motion.g>
        {[0, 1, 2].map((i) => (
          <Motion.line
            key={i}
            x1="20"
            y1={112 + i * 12}
            x2="32"
            y2={112 + i * 12}
            stroke="#1d6aa5"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, x: 10 }}
            whileInView={{
              opacity: [0, 0.5, 0],
              x: [10, -15],
            }}
            viewport={{ once: true }}
            transition={{
              delay: 1.5 + i * 0.2,
              duration: 0.8,
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
          />
        ))}
        <Motion.g
          initial={{ scale: 0, y: 10 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.4, type: 'spring' }}
        >
          <circle cx="165" cy="65" r="22" fill="white" stroke="#1d6aa5" strokeWidth="2" />
          <circle cx="165" cy="65" r="18" fill="#d8e8f8" fillOpacity="0.3" />
          <Motion.line
            x1="165"
            y1="65"
            x2="165"
            y2="52"
            stroke="#1d6aa5"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ rotate: 0 }}
            whileInView={{ rotate: 360 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8, duration: 3, ease: 'easeInOut' }}
            style={{ transformOrigin: '165px 65px' }}
          />
          <Motion.line
            x1="165"
            y1="65"
            x2="175"
            y2="65"
            stroke="#1d6aa5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="165" cy="65" r="2" fill="#1d6aa5" />
        </Motion.g>
        <Motion.g
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, type: 'spring', stiffness: 100 }}
        >
          <path d="M45 50 C45 38 55 30 65 30 C75 30 85 38 85 50 C85 65 65 80 65 80 C65 80 45 65 45 50Z" fill="#1d6aa5" fillOpacity="0.1" stroke="#1d6aa5" strokeWidth="1.5" />
          <circle cx="65" cy="50" r="6" fill="none" stroke="#1d6aa5" strokeWidth="1.5" />
          <circle cx="65" cy="50" r="2" fill="#1d6aa5" />
        </Motion.g>
      </svg>
    ),
  },
  {
    title: '24/7 Customer Support',
    description:
      'A dedicated support desk to help with product selection, usage guidance, and after-sales care.',
    color: '#0e336b',
    accent: '#dde3f0',
    illustration: (
      <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
        <Motion.circle
          cx="100"
          cy="85"
          r="40"
          fill="#dde3f0"
          fillOpacity="0.3"
          stroke="#0e336b"
          strokeWidth="2"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
        />
        <Motion.path
          d="M60 75 A40 40 0 0 1 140 75"
          stroke="#0e336b"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        />
        <Motion.rect
          x="50"
          y="72"
          width="14"
          height="26"
          rx="7"
          fill="#0e336b"
          fillOpacity="0.15"
          stroke="#0e336b"
          strokeWidth="2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, type: 'spring' }}
          style={{ transformOrigin: '57px 85px' }}
        />
        <Motion.rect
          x="136"
          y="72"
          width="14"
          height="26"
          rx="7"
          fill="#0e336b"
          fillOpacity="0.15"
          stroke="#0e336b"
          strokeWidth="2"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, type: 'spring' }}
          style={{ transformOrigin: '143px 85px' }}
        />
        <Motion.path
          d="M140 90 Q148 100 142 115 Q138 122 125 125"
          stroke="#0e336b"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />
        <Motion.circle
          cx="122"
          cy="127"
          r="5"
          fill="#0e336b"
          fillOpacity="0.2"
          stroke="#0e336b"
          strokeWidth="1.5"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5, type: 'spring' }}
        />
        <Motion.g
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3 }}
        >
          <circle cx="88" cy="82" r="3" fill="#0e336b" fillOpacity="0.5" />
          <circle cx="112" cy="82" r="3" fill="#0e336b" fillOpacity="0.5" />
          <Motion.path
            d="M90 95 Q100 105 110 95"
            stroke="#0e336b"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5, duration: 0.4 }}
          />
        </Motion.g>
        <Motion.g
          initial={{ scale: 0, x: -10 }}
          whileInView={{ scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, type: 'spring' }}
        >
          <rect x="25" y="130" width="55" height="26" rx="13" fill="#0e336b" fillOpacity="0.08" stroke="#0e336b" strokeWidth="1.5" />
          {[35, 48, 61].map((x, i) => (
            <Motion.circle
              key={i}
              cx={x}
              cy="143"
              r="2"
              fill="#0e336b"
              fillOpacity="0.3"
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.3, 1] }}
              viewport={{ once: true }}
              transition={{ delay: 1.8 + i * 0.15 }}
            />
          ))}
        </Motion.g>
        <Motion.g
          initial={{ scale: 0, x: 10 }}
          whileInView={{ scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.9, type: 'spring' }}
        >
          <rect x="115" y="138" width="45" height="22" rx="11" fill="#0e336b" fillOpacity="0.06" stroke="#0e336b" strokeWidth="1.5" />
          <Motion.line
            x1="125"
            y1="149"
            x2="150"
            y2="149"
            stroke="#0e336b"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.25"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2.1 }}
          />
        </Motion.g>
        {[1, 2, 3].map((i) => (
          <Motion.circle
            key={i}
            cx="100"
            cy="85"
            r={50 + i * 12}
            fill="none"
            stroke="#0e336b"
            strokeWidth="0.8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{
              opacity: [0, 0.1, 0],
              scale: [0.9, 1.05],
            }}
            viewport={{ once: true }}
            transition={{
              delay: 2.2 + i * 0.4,
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        ))}
      </svg>
    ),
  },
]

function AnimatedCounter({ value, suffix, isInView }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const ctrl = animate(0, value, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [isInView, value])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

function FeatureCard({ reason, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10%' })
  const isEven = index % 2 === 0

  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <div
        className={`flex flex-col overflow-hidden rounded-[28px] border bg-white transition-all duration-500 hover:shadow-xl lg:flex-row ${
          isEven ? '' : 'lg:flex-row-reverse'
        }`}
        style={{
          borderColor: `${reason.color}15`,
          boxShadow: `0 1px 30px -8px ${reason.color}10`,
        }}
      >
        {/* Illustration */}
        <div
          className="relative flex items-center justify-center p-10 lg:w-[45%] lg:p-14"
          style={{
            background: `linear-gradient(145deg, ${reason.accent}60, ${reason.accent}20)`,
          }}
        >
          <Motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full lg:left-7 lg:top-7"
            style={{ backgroundColor: `${reason.color}12` }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: reason.color }}
            >
              {index + 1}
            </span>
          </Motion.div>

          <Motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
            className="h-44 w-44 sm:h-52 sm:w-52"
          >
            {reason.illustration}
          </Motion.div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center px-8 py-10 lg:px-14 lg:py-14">
          <Motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
            className="mb-6 h-1 rounded-full"
            style={{ backgroundColor: reason.color }}
          />

          <Motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-[1.65rem] font-bold tracking-tight text-[#0e336b] sm:text-3xl"
          >
            {reason.title}
          </Motion.h3>

          <Motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-500"
          >
            {reason.description}
          </Motion.p>

          <Motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-7"
          >
            <button
              className="group/btn inline-flex items-center gap-2 rounded-full border-2 px-6 py-2.5 text-sm font-semibold transition-all duration-300 hover:gap-3"
              style={{
                borderColor: `${reason.color}30`,
                color: reason.color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${reason.color}08`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Learn more
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </button>
          </Motion.div>
        </div>
      </div>
    </Motion.div>
  )
}

function WhyChooseMedCura() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })
  const bgY = useTransform(smoothProgress, [0, 1], [0, -40])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fafcfd] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
    >
      {/* Background */}
      <Motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #3b9cb510 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #0e336b08 0%, transparent 70%)',
          }}
        />
      </Motion.div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-20 text-center">
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
          

            <h2 className="mx-auto mt-5 max-w-lg text-4xl font-bold tracking-tight text-[#0e336b] sm:text-5xl lg:text-[3.2rem]">
               
              Why choose us
            </h2>

            <Motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-slate-400"
            >
              Medical-grade products with seamless support — for homes, clinics,
              and hospitals across India.
            </Motion.p>
          </Motion.div>

         
        </div>

        {/* Cards */}
        <div className="space-y-10 lg:space-y-14">
          {reasons.map((reason, i) => (
            <FeatureCard key={reason.title} reason={reason} index={i} />
          ))}
        </div>

       
      </div>
    </section>
  )
}

export default WhyChooseMedCura