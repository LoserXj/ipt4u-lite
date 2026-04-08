import { motion } from 'framer-motion'

const dimensions = [
  {
    key: 'Absorb',
    desc: 'Physical and social capacity to withstand shocks without catastrophic loss.',
    indicators: [
      { name: 'Infrastructure Quality', source: 'World Economic Forum', desc: 'Quality of overall infrastructure including roads, ports, and utilities.' },
      { name: 'Building Quality', source: 'FM Global', desc: 'Structural resilience standards and building code compliance.' },
      { name: 'Ecosystem Vitality', source: 'Yale EPI', desc: 'Health of natural ecosystems providing protective services.' },
      { name: 'GINI Index', source: 'World Bank', desc: 'Income inequality — lower inequality improves collective resilience.' },
      { name: 'Housing Deprivation', source: 'Oxford MPI', desc: 'Proportion of population in inadequate housing conditions.' },
      { name: 'Global Peace Index', source: 'IEP', desc: 'Societal stability and peacefulness as pre-condition for absorptive capacity.' },
    ],
  },
  {
    key: 'Respond',
    desc: 'Institutional and logistical capacity to mobilise effective emergency response.',
    indicators: [
      { name: 'Macroeconomic Stability', source: 'World Bank', desc: 'Fiscal and monetary stability enabling emergency resource mobilisation.' },
      { name: 'Control of Corruption', source: 'World Bank WGI', desc: 'Governance quality ensuring aid reaches affected populations.' },
      { name: 'Network Coverage', source: 'ITU', desc: 'Mobile and internet coverage enabling disaster communication and coordination.' },
      { name: 'Logistics Performance', source: 'World Bank LPI', desc: 'Supply chain efficiency for delivering emergency goods and services.' },
      { name: 'Gross National Savings', source: 'World Bank', desc: 'Financial reserves available for emergency response expenditure.' },
      { name: 'Political Stability', source: 'World Bank WGI', desc: 'Government continuity enabling sustained disaster response operations.' },
    ],
  },
  {
    key: 'Restore',
    desc: 'Long-term capacity to rebuild and build back better after disaster events.',
    indicators: [
      { name: 'Government Effectiveness', source: 'World Bank WGI', desc: 'Quality of public services and policy implementation for reconstruction.' },
      { name: 'R&D Investment', source: 'World Bank', desc: 'Innovation capacity driving improved rebuilding technologies and practices.' },
      { name: 'Education Access', source: 'UNDP HDI', desc: 'Human capital enabling adaptive capacity and skills for recovery.' },
      { name: 'Technology Achievement', source: 'WIPO', desc: 'Technological readiness supporting smart infrastructure reconstruction.' },
      { name: 'Human Development Index', source: 'UNDP', desc: 'Composite of health, education, and living standards as recovery baseline.' },
      { name: 'Economic Complexity', source: 'Harvard GCI', desc: 'Economic diversification enabling more flexible and robust recovery pathways.' },
    ],
  },
]

const hazards = ['Earthquake', 'Flood', 'Tropical Cyclone', 'Drought', 'Volcano']

const sources = [
  'World Bank', 'World Bank WGI', 'World Bank LPI',
  'UNDP', 'Yale EPI', 'WIPO', 'Oxford MPI',
  'FM Global', 'IEP', 'ITU', 'Harvard GCI', 'GDACS',
]

export default function Methodology() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: '#afafaf' }}>
            URSA Framework
          </p>
          <h1 className="font-bold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.18, color: '#000000' }}>
            Methodology
          </h1>
          <p className="text-lg max-w-2xl leading-relaxed" style={{ color: '#4b4b4b' }}>
            URSA (PolyU Urban Resilience Scoring & Assessment) is a composite index built on 18 sub-indicators across three resilience dimensions, applied to 7,300+ cities in 170+ countries.
          </p>
        </motion.div>
      </section>

      {/* Overview chips */}
      <section className="pb-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3">
          {[
            '18 Indicators', '3 Dimensions', '7,300+ Cities', '170+ Countries', '5 Hazard Types', '110,520 Disaster Events'
          ].map((chip) => (
            <span
              key={chip}
              className="px-4 py-2 rounded-pill text-sm font-medium"
              style={{ background: '#efefef', color: '#000000' }}
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20 border-t" style={{ background: '#000000', borderColor: '#222' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Analytical Pipeline</p>
            <h2 className="font-bold text-white" style={{ fontSize: '2rem', lineHeight: 1.22 }}>
              Four-stage process
            </h2>
          </div>
          <div className="relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-5 left-0 right-0 h-px" style={{ background: '#333', marginLeft: '2rem', marginRight: '2rem' }} />
            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                { n: '01', title: 'Data Collection', detail: 'Sourcing from 12+ global databases including World Bank, UNDP, WIPO, Yale EPI, and GDACS disaster records spanning 2005–2025.' },
                { n: '02', title: 'Indicator Construction', detail: 'Normalising raw data to 0–1 scale, applying directional weighting, and aggregating into sub-dimension scores per city.' },
                { n: '03', title: 'Risk Modelling', detail: 'Probabilistic exposure modelling using 110,520 GDACS events across 5 hazard types with frequency-magnitude analysis.' },
                { n: '04', title: 'URSA Scoring', detail: 'Computing composite index via trapezoid integration of capacity scores, combining Absorb, Respond, and Restore dimensions.' },
              ].map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-5 relative z-10"
                    style={{ background: '#ffffff', color: '#000000' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: '#ffffff' }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#afafaf' }}>{s.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GIRI formula callout */}
      <section className="py-20 border-b" style={{ borderColor: '#e2e2e2' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Scoring Formula</p>
              <h2 className="font-bold mb-4" style={{ fontSize: '2rem', lineHeight: 1.22, color: '#000000' }}>
                Trapezoid integration
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#4b4b4b' }}>
                The URSA score is computed as the area under a trapezoid formed by a city's three dimension scores (Absorb, Respond, Restore). This geometric approach rewards balanced performance across all three capacities rather than high scores in a single dimension.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#4b4b4b' }}>
                The final score is normalised to a 0–100 scale, where 100 represents maximum resilience across all three dimensions equally.
              </p>
            </div>
            <div
              className="rounded-xl p-8 flex items-center justify-center"
              style={{ background: '#000000', minHeight: '220px' }}
            >
              <div className="text-center">
                <div className="font-bold text-2xl mb-4" style={{ color: '#ffffff', fontFamily: 'monospace' }}>
                  URSA = ½ × (A + R₁ + R₂) × h
                </div>
                <div className="flex justify-center gap-8 text-sm" style={{ color: '#afafaf' }}>
                  <span>A = Absorb</span>
                  <span>R₁ = Respond</span>
                  <span>R₂ = Restore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 18 Indicators */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Indicator Framework</p>
            <h2 className="font-bold" style={{ fontSize: '2rem', lineHeight: 1.22, color: '#000000' }}>
              18 indicators, 3 dimensions
            </h2>
          </div>
          <div className="space-y-16">
            {dimensions.map((dim, di) => (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-baseline gap-4 mb-8">
                  <h3 className="font-bold text-2xl" style={{ color: '#000000' }}>{dim.key}</h3>
                  <p className="text-sm" style={{ color: '#4b4b4b' }}>{dim.desc}</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dim.indicators.map((ind, ii) => (
                    <div
                      key={ind.name}
                      className="p-5 rounded-xl"
                      style={{ boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px' }}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-sm" style={{ color: '#000000' }}>{ind.name}</h4>
                        <span
                          className="text-xs px-2 py-0.5 rounded-pill shrink-0"
                          style={{ background: '#efefef', color: '#4b4b4b' }}
                        >
                          {ind.source}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#4b4b4b' }}>{ind.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Modelling */}
      <section className="py-20" style={{ background: '#000000' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Risk Modelling</p>
            <h2 className="font-bold text-white" style={{ fontSize: '2rem', lineHeight: 1.22 }}>
              Probabilistic hazard framework
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#afafaf' }}>
                We model disaster risk using 110,520 historical events from the GDACS database (2005–2025), computing city-level exposure across 5 natural hazard types. Exposure is calculated as the frequency-weighted magnitude of events within a city's catchment area.
              </p>
              <div className="flex flex-wrap gap-2">
                {hazards.map((h) => (
                  <span
                    key={h}
                    className="px-4 py-2 rounded-pill text-sm font-medium border"
                    style={{ borderColor: '#333', color: '#ffffff' }}
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '110,520', label: 'GDACS Events' },
                { n: '2005–2025', label: 'Time Coverage' },
                { n: '5', label: 'Hazard Types' },
                { n: '7,300+', label: 'Cities Modelled' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-6 border"
                  style={{ borderColor: '#333' }}
                >
                  <div className="font-bold text-2xl mb-1" style={{ color: '#ffffff' }}>{s.n}</div>
                  <div className="text-xs" style={{ color: '#afafaf' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 border-t" style={{ borderColor: '#e2e2e2' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Data Provenance</p>
            <h2 className="font-bold" style={{ fontSize: '2rem', lineHeight: 1.22, color: '#000000' }}>
              Data sources
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {sources.map((src) => (
              <span
                key={src}
                className="px-4 py-2 rounded-pill text-sm font-medium"
                style={{ background: '#efefef', color: '#000000' }}
              >
                {src}
              </span>
            ))}
          </div>
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
