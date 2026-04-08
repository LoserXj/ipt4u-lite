import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Globe, Shield } from 'lucide-react'
import MapBg from '../../components/MapBg'

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

const stats = [
  { label: 'Cities Assessed', value: 7300, suffix: '+' },
  { label: 'Countries Covered', value: 170, suffix: '+' },
  { label: 'Resilience Indicators', value: 18, suffix: '' },
  { label: 'Years of Disaster Data', value: 21, suffix: '' },
]

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Methodology', path: '/methodology' },
  { label: 'Data', path: '/data' },
  { label: 'Assessment', path: '/assessment' },
]

const modules = [
  {
    icon: <Shield size={24} />,
    title: 'Methodology',
    desc: 'Explore the URSA framework, 18 indicators across 3 resilience dimensions, and our probabilistic risk modelling approach.',
    path: '/methodology',
    cta: 'View Framework',
  },
  {
    icon: <Globe size={24} />,
    title: 'Assessment',
    desc: 'Interactive global map showing city-level resilience scores across Absorb, Respond, and Restore dimensions.',
    path: '/assessment',
    cta: 'Explore Map',
  },
]

const dimensions = [
  {
    label: 'Absorb',
    desc: 'Capacity to withstand and resist disaster impacts through infrastructure, ecosystems, and social equity.',
    indicators: ['Infrastructure Quality', 'Building Quality', 'Ecosystem Vitality', 'GINI Index', 'Housing Deprivation', 'Global Peace Index'],
  },
  {
    label: 'Respond',
    desc: 'Capacity to mobilise resources and coordinate effective emergency response when disaster strikes.',
    indicators: ['Macroeconomic Stability', 'Control of Corruption', 'Network Coverage', 'Logistics Performance', 'Gross National Savings', 'Political Stability'],
  },
  {
    label: 'Restore',
    desc: 'Capacity to rebuild and recover, returning to normal function and building back better over time.',
    indicators: ['Government Effectiveness', 'R&D Investment', 'Education Access', 'Technology Achievement', 'Human Development Index', 'Economic Complexity'],
  },
]

const pipeline = [
  { step: '01', title: 'Data Collection', desc: 'Aggregating data from World Bank, UNDP, WHO, WIPO, Yale EPI, and 110,520 GDACS disaster events spanning 2005–2025.' },
  { step: '02', title: 'Indicator Construction', desc: 'Normalising and weighting 18 sub-indicators across 3 resilience dimensions for 7,300+ cities.' },
  { step: '03', title: 'Risk Modelling', desc: 'Probabilistic hazard modelling across 5 disaster types — Earthquake, Flood, Cyclone, Drought, and Volcano.' },
  { step: '04', title: 'URSA Scoring', desc: 'Computing the Urban Resilience Scoring & Assessment index via trapezoid integration of Absorb, Respond, and Restore capacity scores.' },
]

function StatItem({ stat, visible, index }) {
  const count = useCountUp(stat.value, 1800, visible)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="text-center"
    >
      <div
        className="font-bold mb-2"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1, color: '#000000' }}
      >
        {count.toLocaleString()}{stat.suffix}
      </div>
      <div className="text-sm" style={{ color: '#4b4b4b' }}>{stat.label}</div>
    </motion.div>
  )
}

export default function Home() {
  const statsRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [currentDim, setCurrentDim] = useState(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden">
        {/* Animated map background */}
        <MapBg onDimChange={setCurrentDim} />

        {/* Dim label badge — top right */}
        <div className="absolute top-6 right-6 z-10">
          <AnimatePresence mode="wait">
            {currentDim && (
              <motion.div
                key={currentDim.key}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className="text-right"
              >
                <div
                  className="inline-block px-4 py-2 rounded-pill text-xs font-medium mb-1"
                  style={{ background: 'rgba(255,255,255,0.92)', color: '#000000', backdropFilter: 'blur(6px)', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px' }}
                >
                  Now showing: <span className="font-bold">{currentDim.label}</span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>{currentDim.sublabel}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium mb-8"
            style={{ background: '#efefef', color: '#000000' }}
          >
            <Globe size={14} />
            URSA · PolyU Urban Resilience Scoring & Assessment
          </div>
          <h1
            className="font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 3.25rem)', lineHeight: 1.15, color: '#000000' }}
          >
            Measuring Urban<br />Resilience at<br />Global Scale
          </h1>
          <p className="text-lg mb-10 max-w-xl" style={{ color: '#4b4b4b', lineHeight: 1.6 }}>
            URSA (PolyU Urban Resilience Scoring & Assessment) evaluates how 7,300+ cities across 170 countries can absorb, respond to, and recover from natural disaster events.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill font-medium text-sm no-underline transition-colors"
              style={{ background: '#000000', color: '#ffffff' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#333333'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
            >
              Explore Assessment <ArrowRight size={16} />
            </Link>
            <Link
              to="/methodology"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-pill font-medium text-sm no-underline transition-colors border"
              style={{ background: '#ffffff', color: '#000000', borderColor: '#000000' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#efefef'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              View Methodology
            </Link>
          </div>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          className="mt-20 flex items-center gap-2 text-sm"
          style={{ color: '#afafaf' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-px h-10 bg-gray-200" />
          Scroll to explore
        </motion.div>
        </div>{/* /z-10 content */}
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-24 border-t border-b" style={{ borderColor: '#e2e2e2' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <StatItem key={s.label} stat={s} visible={statsVisible} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Analytical Pipeline</p>
            <h2 className="font-bold" style={{ fontSize: '2.25rem', lineHeight: 1.22, color: '#000000' }}>
              From data to decision
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipeline.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-6 rounded-xl"
                style={{ boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px' }}
              >
                <div
                  className="text-xs font-bold mb-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#000000', color: '#ffffff' }}
                >
                  {p.step}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: '#000000' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#4b4b4b' }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-24" style={{ background: '#000000' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Three Capacities</p>
            <h2 className="font-bold" style={{ fontSize: '2.25rem', lineHeight: 1.22, color: '#ffffff' }}>
              Resilience dimensions
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {dimensions.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="p-8 rounded-xl border"
                style={{ borderColor: '#333333' }}
              >
                <h3 className="font-bold text-2xl mb-3" style={{ color: '#ffffff' }}>{d.label}</h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#afafaf' }}>{d.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {d.indicators.map((ind) => (
                    <span
                      key={ind}
                      className="text-xs px-3 py-1 rounded-pill"
                      style={{ background: '#1a1a1a', color: '#afafaf' }}
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Platform Modules</p>
            <h2 className="font-bold" style={{ fontSize: '2.25rem', lineHeight: 1.22, color: '#000000' }}>
              Where to start
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 rounded-xl flex flex-col justify-between"
                style={{ boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px', minHeight: '220px' }}
              >
                <div>
                  <div className="mb-4" style={{ color: '#000000' }}>{m.icon}</div>
                  <h3 className="font-bold text-xl mb-3" style={{ color: '#000000' }}>{m.title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#4b4b4b' }}>{m.desc}</p>
                </div>
                <Link
                  to={m.path}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium no-underline w-fit transition-colors"
                  style={{ background: '#000000', color: '#ffffff' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#333333'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#000000'}
                >
                  {m.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000000' }} className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-pill flex items-center justify-center bg-white">
                  <span className="text-black font-bold text-xs">IP</span>
                </div>
                <span className="font-bold text-white text-base">URSA</span>
              </div>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: '#afafaf' }}>
                URSA · PolyU Urban Resilience Scoring & Assessment — assessing urban resilience across 7,300+ cities worldwide.
              </p>
            </div>
            <div className="flex gap-16">
              <div>
                <p className="text-white font-bold text-sm mb-4">Platform</p>
                {navLinks.map((l) => (
                  <Link key={l.path} to={l.path} className="block text-sm mb-2 no-underline transition-colors" style={{ color: '#afafaf' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#afafaf'}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-4">About</p>
                <p className="text-sm" style={{ color: '#afafaf' }}>PolyU RICRI</p>
                <p className="text-sm mt-2" style={{ color: '#afafaf' }}>URSA Research</p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t" style={{ borderColor: '#222222' }}>
            <p className="text-xs" style={{ color: '#afafaf' }}>
              © 2025 URSA — PolyU RICRI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
