import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, AlertTriangle, Building2, Zap } from 'lucide-react'

const datasets = [
  {
    icon: <AlertTriangle size={22} />,
    tag: 'Available',
    title: 'Global Disaster Events',
    desc: 'A comprehensive record of 110,520 natural disaster events spanning 2005–2025, sourced from the GDACS database. Covers five hazard types with geographic coordinates, event magnitude, and affected country metadata.',
    stats: [
      { label: 'Events', value: '110,520' },
      { label: 'Hazard Types', value: '5' },
      { label: 'Coverage', value: '2005–2025' },
      { label: 'Source', value: 'GDACS' },
    ],
    hazards: ['Earthquake', 'Flood', 'Tropical Cyclone', 'Drought', 'Volcano'],
    path: '/data/disaster',
    cta: 'Explore Map',
    available: true,
  },
  {
    icon: <Building2 size={22} />,
    tag: 'Coming Soon',
    title: 'Building PV Potential',
    desc: 'Rooftop photovoltaic potential estimates for urban buildings across assessed cities, enabling analysis of renewable energy capacity as a resilience resource.',
    stats: [
      { label: 'Cities', value: '7,300+' },
      { label: 'Resolution', value: 'Building-level' },
      { label: 'Status', value: 'In preparation' },
    ],
    hazards: [],
    path: null,
    cta: null,
    available: false,
  },
  {
    icon: <Zap size={22} />,
    tag: 'Coming Soon',
    title: 'Critical Infrastructure Exposure',
    desc: 'Spatial exposure index for critical infrastructure (power grids, hospitals, transport nodes) to each of the five hazard types, derived from probabilistic risk modelling.',
    stats: [
      { label: 'Infra Types', value: '6' },
      { label: 'Hazard Types', value: '5' },
      { label: 'Status', value: 'In preparation' },
    ],
    hazards: [],
    path: null,
    cta: null,
    available: false,
  },
]

export default function Data() {
  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#afafaf' }}>
            Data Catalogue
          </p>
          <h1 className="font-bold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.18, color: '#000000' }}>
            Datasets
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#4b4b4b' }}>
            Underlying data powering the URSA platform. Explore available datasets or preview what's coming next.
          </p>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          {datasets.map((ds, i) => (
            <motion.div
              key={ds.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl p-8"
              style={{
                boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px',
                opacity: ds.available ? 1 : 0.6,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Left */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: ds.available ? '#000000' : '#efefef', color: ds.available ? '#ffffff' : '#4b4b4b' }}
                    >
                      {ds.icon}
                    </div>
                    <span
                      className="px-3 py-1 rounded-pill text-xs font-medium"
                      style={{
                        background: ds.available ? '#000000' : '#efefef',
                        color: ds.available ? '#ffffff' : '#4b4b4b',
                      }}
                    >
                      {ds.tag}
                    </span>
                  </div>

                  <h2 className="font-bold text-xl mb-3" style={{ color: '#000000' }}>{ds.title}</h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#4b4b4b', maxWidth: '560px' }}>{ds.desc}</p>

                  {ds.hazards.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {ds.hazards.map(h => (
                        <span
                          key={h}
                          className="px-3 py-1 rounded-pill text-xs"
                          style={{ background: '#efefef', color: '#000000' }}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {ds.available && ds.path && (
                    <Link
                      to={ds.path}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium no-underline transition-colors"
                      style={{ background: '#000000', color: '#ffffff' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#333333'}
                      onMouseLeave={e => e.currentTarget.style.background = '#000000'}
                    >
                      {ds.cta} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>

                {/* Right — stats grid */}
                <div className="grid grid-cols-2 gap-3 md:w-56 shrink-0">
                  {ds.stats.map(s => (
                    <div
                      key={s.label}
                      className="rounded-xl p-4"
                      style={{ background: '#f9f9f9' }}
                    >
                      <div className="font-bold text-base mb-0.5" style={{ color: '#000000' }}>{s.value}</div>
                      <div className="text-xs" style={{ color: '#afafaf' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000000' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs" style={{ color: '#afafaf' }}>
            © 2025 URSA — PolyU RICRI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
