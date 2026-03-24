import { motion as Motion } from 'framer-motion'

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.15, duration: 1.2, ease: 'easeInOut' },
      opacity: { delay: i * 0.15, duration: 0.3 },
    },
  }),
}

const float = {
  y: [0, -6, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
}

// ─── SVG Illustrations ────────────────────────────────────────

function FoundationSVG() {
  return (
    <Motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Ground */}
      <Motion.line
        x1="15"
        y1="95"
        x2="105"
        y2="95"
        stroke="#bce8f2"
        strokeWidth="2"
        strokeLinecap="round"
        variants={draw}
        custom={0}
      />
      {/* Building body */}
      <Motion.rect
        x="30"
        y="35"
        width="60"
        height="60"
        rx="4"
        stroke="#0e336b"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Roof */}
      <Motion.path
        d="M25 38L60 15L95 38"
        stroke="#0e336b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={2}
      />
      {/* Door */}
      <Motion.rect
        x="50"
        y="68"
        width="20"
        height="27"
        rx="2"
        stroke="#3f6e8a"
        strokeWidth="2"
        fill="none"
        variants={draw}
        custom={3}
      />
      {/* Cross symbol */}
      <Motion.line
        x1="60"
        y1="42"
        x2="60"
        y2="58"
        stroke="#3f6e8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={draw}
        custom={4}
      />
      <Motion.line
        x1="52"
        y1="50"
        x2="68"
        y2="50"
        stroke="#3f6e8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={draw}
        custom={4}
      />
      {/* Windows */}
      <Motion.rect
        x="35"
        y="45"
        width="10"
        height="10"
        rx="1.5"
        stroke="#bce8f2"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={5}
      />
      <Motion.rect
        x="75"
        y="45"
        width="10"
        height="10"
        rx="1.5"
        stroke="#bce8f2"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={5}
      />
      {/* Pulse dot */}
      <Motion.circle
        cx="60"
        cy="15"
        r="3"
        fill="#3f6e8a"
        initial={{ scale: 0 }}
        whileInView={{ scale: [0, 1.3, 1] }}
        viewport={{ once: true }}
        transition={{ delay: 1, duration: 0.5 }}
      />
    </Motion.svg>
  )
}

function PartnershipSVG() {
  return (
    <Motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Left person */}
      <Motion.circle
        cx="35"
        cy="30"
        r="10"
        stroke="#0e336b"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={0}
      />
      <Motion.path
        d="M15 75C15 58 25 50 35 50C40 50 44 52 47 55"
        stroke="#0e336b"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Right person */}
      <Motion.circle
        cx="85"
        cy="30"
        r="10"
        stroke="#3f6e8a"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={0}
      />
      <Motion.path
        d="M105 75C105 58 95 50 85 50C80 50 76 52 73 55"
        stroke="#3f6e8a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Handshake */}
      <Motion.path
        d="M47 65L55 58L65 62L73 55"
        stroke="#0e336b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={2}
      />
      <Motion.path
        d="M43 72L55 65L65 70L77 62"
        stroke="#3f6e8a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={3}
      />
      {/* Connection dots */}
      {[
        [60, 20],
        [50, 22],
        [70, 22],
      ].map(([cx, cy], i) => (
        <Motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="2"
          fill="#bce8f2"
          initial={{ scale: 0 }}
          whileInView={{ scale: [0, 1.5, 1] }}
          viewport={{ once: true }}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.4 }}
        />
      ))}
      {/* Ground */}
      <Motion.line
        x1="15"
        y1="95"
        x2="105"
        y2="95"
        stroke="#bce8f2"
        strokeWidth="2"
        strokeLinecap="round"
        variants={draw}
        custom={4}
      />
      {/* Sparkle */}
      <Motion.path
        d="M60 82L62 87L67 87L63 90L65 95L60 92L55 95L57 90L53 87L58 87Z"
        stroke="#3f6e8a"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={5}
      />
    </Motion.svg>
  )
}

function HomeICUSVG() {
  return (
    <Motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* House body */}
      <Motion.rect
        x="25"
        y="50"
        width="70"
        height="45"
        rx="4"
        stroke="#0e336b"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={0}
      />
      {/* Roof */}
      <Motion.path
        d="M20 53L60 22L100 53"
        stroke="#0e336b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Heart */}
      <Motion.path
        d="M48 68C48 62 55 58 60 64C65 58 72 62 72 68C72 76 60 84 60 84C60 84 48 76 48 68Z"
        stroke="#3f6e8a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={2}
      />
      {/* Pulse line */}
      <Motion.path
        d="M30 105L42 105L48 98L54 112L60 95L66 108L72 105L90 105"
        stroke="#3f6e8a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={3}
      />
      {/* Chimney */}
      <Motion.rect
        x="75"
        y="28"
        width="10"
        height="18"
        rx="2"
        stroke="#bce8f2"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={4}
      />
      {/* Smoke puffs */}
      {[
        [80, 24, 3],
        [83, 18, 2.5],
        [79, 12, 2],
      ].map(([cx, cy, r], i) => (
        <Motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          stroke="#bce8f2"
          strokeWidth="1.2"
          fill="none"
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: [0, 0.7, 0], y: -8 }}
          viewport={{ once: true }}
          transition={{
            delay: 1.5 + i * 0.3,
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
      {/* Heartbeat dot */}
      <Motion.circle
        cx="60"
        cy="72"
        r="2.5"
        fill="#3f6e8a"
        initial={{ scale: 0 }}
        whileInView={{ scale: [0, 1.4, 1] }}
        viewport={{ once: true }}
        transition={{ delay: 1.2, duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
      />
    </Motion.svg>
  )
}

function EcommerceSVG() {
  return (
    <Motion.svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Screen */}
      <Motion.rect
        x="20"
        y="18"
        width="80"
        height="55"
        rx="6"
        stroke="#0e336b"
        strokeWidth="2.5"
        fill="none"
        variants={draw}
        custom={0}
      />
      {/* Screen stand */}
      <Motion.path
        d="M50 73L50 82L40 88L80 88L70 82L70 73"
        stroke="#0e336b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={1}
      />
      {/* Cart icon on screen */}
      <Motion.path
        d="M42 35L47 35L52 52L68 52L72 38L50 38"
        stroke="#3f6e8a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={draw}
        custom={2}
      />
      {/* Cart wheels */}
      <Motion.circle
        cx="54"
        cy="57"
        r="2.5"
        stroke="#3f6e8a"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={3}
      />
      <Motion.circle
        cx="66"
        cy="57"
        r="2.5"
        stroke="#3f6e8a"
        strokeWidth="1.5"
        fill="none"
        variants={draw}
        custom={3}
      />
      {/* Floating elements */}
      {/* Package */}
      <Motion.rect
        x="78"
        y="28"
        width="14"
        height="12"
        rx="2"
        stroke="#bce8f2"
        strokeWidth="1.5"
        fill="none"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.3, duration: 0.5 }}
      />
      <Motion.line
        x1="85"
        y1="28"
        x2="85"
        y2="40"
        stroke="#bce8f2"
        strokeWidth="1"
        variants={draw}
        custom={5}
      />
      {/* Signal waves */}
      {[12, 18, 24].map((r, i) => (
        <Motion.path
          key={i}
          d={`M${95 + i * 2} ${18 - i * 3}A${r} ${r} 0 0 1 ${95 + i * 2 + r * 0.4} ${18 - i * 3 - r * 0.3}`}
          stroke="#bce8f2"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 0.8, 0] }}
          viewport={{ once: true }}
          transition={{
            delay: 1.5 + i * 0.2,
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      ))}
      {/* Rocket */}
      <Motion.g
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8, duration: 0.8, ease: 'easeOut' }}
      >
        <Motion.path
          d="M15 100L22 90L18 86Z"
          stroke="#3f6e8a"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <Motion.path
          d="M18 96L12 102M22 92L16 98"
          stroke="#bce8f2"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </Motion.g>
      {/* Coins */}
      {[
        [30, 100],
        [38, 96],
        [34, 104],
      ].map(([cx, cy], i) => (
        <Motion.circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          stroke="#3f6e8a"
          strokeWidth="1.5"
          fill="none"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 + i * 0.15, type: 'spring' }}
        />
      ))}
    </Motion.svg>
  )
}

// ─── Data ──────────────────────────────────────────────────────

const timeline = [
  {
    year: '2017',
    title: 'Foundation',
    detail:
      'MedCura began with a mission to make quality home-care medical equipment easier to access.',
    Illustration: FoundationSVG,
  },
  {
    year: '2019',
    title: 'Clinical Partnerships',
    detail:
      'Expanded supplier and hospital partnerships to improve product reliability and care continuity.',
    Illustration: PartnershipSVG,
  },
  {
    year: '2022',
    title: 'Home ICU Expansion',
    detail:
      'Launched structured home ICU setup support with installation and caregiver guidance.',
    Illustration: HomeICUSVG,
  },
  {
    year: '2026',
    title: 'E-Commerce Platform',
    detail:
      'Introduced integrated commerce, care services, and post-order support in a single platform.',
    Illustration: EcommerceSVG,
  },
]

// ─── Component ─────────────────────────────────────────────────

function AboutRoadmap() {
  return (
    <section className="px-6 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          {/* Animated header SVG */}
         

          <h3 className="heading-font text-3xl font-bold text-[#0e336b] md:text-5xl">
            Our Journey
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#0e336b]/55 md:text-base">
            From humble beginnings to a comprehensive healthcare platform —
            every step brought us closer to better care.
          </p>
        </Motion.div>

        {/* Timeline */}
        <div className="space-y-3 md:space-y-6">
          {timeline.map((item, index) => {
            const { Illustration } = item
            const isEven = index % 2 === 0

            return (
              <Motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="group relative"
              >
                {/* Connector line (not on last) */}
                {index < timeline.length - 1 && (
                  <div className="absolute bottom-0 left-1/2 hidden h-6 w-px -translate-x-1/2 translate-y-full bg-gradient-to-b from-[#bce8f2] to-transparent md:block" />
                )}

                <div
                  className={`flex flex-col overflow-hidden rounded-3xl border border-[#c9edf3] bg-white transition-all duration-500 hover:border-[#3f6e8a]/30 hover:shadow-2xl hover:shadow-[#bce8f2]/40 md:flex-row ${
                    !isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Illustration side */}
                  <div className="flex items-center justify-center bg-gradient-to-br from-[#f8fdff] to-[#eef8fb] p-8 md:w-5/12 md:p-10">
                    <Motion.div animate={float}>
                      <Illustration />
                    </Motion.div>
                  </div>

                  {/* Content side */}
                  <div className="flex flex-1 flex-col justify-center p-6 md:p-10">
                    {/* Year badge */}
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e336b] text-sm font-bold text-white shadow-lg shadow-[#0e336b]/20">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-[#bce8f2] to-transparent" />
                      <span className="rounded-full border border-[#c9edf3] bg-[#f0fafe] px-3 py-1 text-xs font-bold tracking-widest text-[#3f6e8a]">
                        {item.year}
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold text-[#0e336b] md:text-3xl">
                      {item.title}
                    </h4>

                    <p className="mt-3 max-w-md text-sm leading-relaxed text-[#0e336b]/55 md:text-base">
                      {item.detail}
                    </p>

                    {/* Progress bar */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f0fafe]">
                        <Motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#0e336b] to-[#3f6e8a]"
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${((index + 1) / timeline.length) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#3f6e8a]">
                        {Math.round(((index + 1) / timeline.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </Motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default AboutRoadmap