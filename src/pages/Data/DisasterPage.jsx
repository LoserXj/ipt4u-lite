import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Layers, Map } from 'lucide-react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const HAZARD_COLOR = {
  EQ: '#EF4444',
  FL: '#3B82F6',
  TC: '#10B981',
  DR: '#F59E0B',
  VO: '#8B5CF6',
}
const HAZARD_LABEL = {
  EQ: 'Earthquake',
  FL: 'Flood',
  TC: 'Tropical Cyclone',
  DR: 'Drought',
  VO: 'Volcano',
}
const ALL_TYPES = ['EQ', 'FL', 'TC', 'DR', 'VO']

export default function DisasterPage() {
  const [points, setPoints]           = useState(null)
  const [summary, setSummary]         = useState(null)
  const [loading, setLoading]         = useState(true)
  const [activeTypes, setActiveTypes] = useState(new Set(ALL_TYPES))
  const [viewMode, setViewMode]       = useState('heat')   // 'heat' | 'dots'
  const [mapReady, setMapReady]       = useState(false)

  const mapContainerRef = useRef(null)
  const mapRef          = useRef(null)
  const popupRef        = useRef(null)

  // ── Load data ────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/disaster_points.json`).then(r => r.json()),
      fetch(`${import.meta.env.BASE_URL}data/disaster_summary.json`).then(r => r.json()),
    ]).then(([pts, sum]) => {
      setPoints(pts)
      setSummary(sum)
    }).catch(err => console.warn('Disaster data load failed', err))
      .finally(() => setLoading(false))
  }, [])

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
      center: [15, 15],
      zoom: 1.4,
      attributionControl: false,
    })
    mapRef.current = map
    requestAnimationFrame(() => mapRef.current?.resize())

    map.on('load', () => {
      map.resize()

      map.addSource('disasters-raw', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      // Heatmap layer
      map.addLayer({
        id: 'kde-heatmap',
        type: 'heatmap',
        source: 'disasters-raw',
        layout: { visibility: 'visible' },
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 3, 1.2, 6, 2.5],
          'heatmap-radius':    ['interpolate', ['linear'], ['zoom'], 0, 18, 3, 25, 6, 35, 9, 50],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0,    'rgba(0,0,0,0)',
            0.15, '#0f2a4a',
            0.35, '#1475b2',
            0.55, '#06b6d4',
            0.75, '#f59e0b',
            1.0,  '#ef4444',
          ],
          'heatmap-opacity': 0.88,
        },
      })

      // Dots layer
      map.addLayer({
        id: 'dots-layer',
        type: 'circle',
        source: 'disasters-raw',
        layout: { visibility: 'none' },
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 1.5, 4, 2.5, 7, 5],
          'circle-color': [
            'match', ['get', 'event_type'],
            'EQ', '#EF4444',
            'FL', '#3B82F6',
            'TC', '#10B981',
            'DR', '#F59E0B',
            'VO', '#8B5CF6',
            '#94A3B8',
          ],
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 1, 0.5, 5, 0.8],
          'circle-stroke-width': 0,
        },
      })

      setMapReady(true)
    })

    return () => { map.remove(); mapRef.current = null }
  }, [])

  // ── Filtered features ─────────────────────────────────────────────────────
  const filteredFeatures = useMemo(() => {
    if (!points) return []
    return points.filter(p => activeTypes.has(p.event_type)).map(p => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { event_type: p.event_type, year: p.year, country: p.country },
    }))
  }, [points, activeTypes])

  // ── Push filtered data to map ─────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    mapRef.current.getSource('disasters-raw')?.setData({
      type: 'FeatureCollection',
      features: filteredFeatures,
    })
  }, [mapReady, filteredFeatures])

  // ── Toggle view mode layers ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current
    if (!map.getLayer('kde-heatmap') || !map.getLayer('dots-layer')) return
    map.setLayoutProperty('kde-heatmap', 'visibility', viewMode === 'heat' ? 'visible' : 'none')
    map.setLayoutProperty('dots-layer',  'visibility', viewMode === 'dots' ? 'visible' : 'none')
  }, [mapReady, viewMode])

  // ── Dot hover tooltip ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || viewMode !== 'dots') return
    const map = mapRef.current

    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 8 })
    }
    const popup = popupRef.current

    const onEnter = e => {
      map.getCanvas().style.cursor = 'pointer'
      const p = e.features[0].properties
      const color = HAZARD_COLOR[p.event_type] || '#94a3b8'
      popup.setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`
          <div style="font-family:Inter,system-ui,sans-serif;font-size:12px;padding:10px 12px;
            background:#ffffff;border:1px solid #e2e2e2;border-radius:8px;
            color:#000;min-width:150px;line-height:1.7;box-shadow:rgba(0,0,0,0.12) 0px 4px 16px">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
              <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
              <span style="font-weight:700;font-size:13px">${HAZARD_LABEL[p.event_type] || p.event_type}</span>
            </div>
            <div style="color:#4b4b4b;font-size:11px">${p.country || '—'}</div>
            <div style="color:#afafaf;font-size:11px">${p.year || '—'}</div>
          </div>
        `)
        .addTo(map)
    }
    const onLeave = () => { map.getCanvas().style.cursor = ''; popup.remove() }

    map.on('mouseenter', 'dots-layer', onEnter)
    map.on('mouseleave', 'dots-layer', onLeave)
    return () => {
      map.off('mouseenter', 'dots-layer', onEnter)
      map.off('mouseleave', 'dots-layer', onLeave)
      popup.remove()
    }
  }, [mapReady, viewMode])

  // ── Summary stats ─────────────────────────────────────────────────────────
  const activeCounts = useMemo(() => {
    if (!points) return {}
    const counts = {}
    points.forEach(p => {
      if (activeTypes.has(p.event_type)) counts[p.event_type] = (counts[p.event_type] || 0) + 1
    })
    return counts
  }, [points, activeTypes])

  const totalActive = Object.values(activeCounts).reduce((s, v) => s + v, 0)

  const toggleType = (type) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) { if (next.size > 1) next.delete(type) }
      else next.add(type)
      return next
    })
  }

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Header */}
      <section className="px-6 py-10 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/data"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 no-underline transition-colors"
            style={{ color: '#4b4b4b' }}
            onMouseEnter={e => e.currentTarget.style.color = '#000'}
            onMouseLeave={e => e.currentTarget.style.color = '#4b4b4b'}
          >
            <ArrowLeft size={14} /> Back to Data Catalogue
          </Link>
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>Global Disaster Events</p>
          <h1 className="font-bold mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, color: '#000000' }}>
            Disaster Event Map
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#4b4b4b' }}>
            110,520 natural disaster events from GDACS (2005–2025). Filter by hazard type and toggle between heatmap and point view.
          </p>
        </motion.div>
      </section>

      {/* Controls */}
      <section className="px-6 pb-5 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap items-center gap-3">
          {/* Hazard type filters */}
          {ALL_TYPES.map(type => {
            const active = activeTypes.has(type)
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-pill text-sm font-medium transition-all cursor-pointer border"
                style={{
                  background: active ? HAZARD_COLOR[type] : '#ffffff',
                  color: active ? '#ffffff' : '#4b4b4b',
                  borderColor: active ? HAZARD_COLOR[type] : '#e2e2e2',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ background: active ? '#ffffff' : HAZARD_COLOR[type] }}
                />
                {HAZARD_LABEL[type]}
                {active && activeCounts[type] != null && (
                  <span className="text-xs opacity-80">{activeCounts[type].toLocaleString()}</span>
                )}
              </button>
            )
          })}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* View mode toggle */}
          <div
            className="inline-flex rounded-pill p-1 gap-1"
            style={{ background: '#efefef' }}
          >
            {[
              { key: 'heat', icon: <Layers size={14} />, label: 'Heatmap' },
              { key: 'dots', icon: <Map size={14} />, label: 'Points' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => setViewMode(m.key)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: viewMode === m.key ? '#000000' : 'transparent',
                  color: viewMode === m.key ? '#ffffff' : '#4b4b4b',
                  border: 'none',
                }}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="flex-1 px-6 pb-6 max-w-6xl mx-auto w-full">
        <div className="relative rounded-xl overflow-hidden" style={{ height: '520px', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px' }}>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white text-sm">Loading disaster data…</p>
              </div>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Event count badge */}
          <div
            className="absolute top-4 right-4 rounded-pill px-4 py-2 text-xs font-medium"
            style={{ background: '#ffffff', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px', color: '#000000' }}
          >
            {totalActive.toLocaleString()} events shown
          </div>

          {/* Heatmap legend */}
          {viewMode === 'heat' && (
            <div
              className="absolute bottom-4 left-4 rounded-xl px-4 py-3"
              style={{ background: '#ffffff', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px', minWidth: '180px' }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: '#000000' }}>Event Density</div>
              <div className="h-2 rounded-pill mb-1.5" style={{ background: 'linear-gradient(to right,#0f2a4a,#1475b2,#06b6d4,#f59e0b,#ef4444)' }} />
              <div className="flex justify-between text-xs" style={{ color: '#afafaf' }}>
                <span>Low</span><span>High</span>
              </div>
            </div>
          )}

          {/* Dots legend */}
          {viewMode === 'dots' && (
            <div
              className="absolute bottom-4 left-4 rounded-xl px-4 py-3"
              style={{ background: '#ffffff', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px' }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: '#000000' }}>Hazard Type</div>
              <div className="space-y-1">
                {ALL_TYPES.filter(t => activeTypes.has(t)).map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: HAZARD_COLOR[t] }} />
                    <span className="text-xs" style={{ color: '#4b4b4b' }}>{HAZARD_LABEL[t]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Summary cards */}
      {summary && (
        <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ALL_TYPES.map((type, i) => {
              const s = summary[type] || {}
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="p-5 rounded-xl"
                  style={{
                    boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px',
                    opacity: activeTypes.has(type) ? 1 : 0.35,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: HAZARD_COLOR[type] }} />
                    <span className="text-xs font-medium" style={{ color: '#000000' }}>{HAZARD_LABEL[type]}</span>
                  </div>
                  <div className="font-bold text-xl mb-0.5" style={{ color: '#000000' }}>
                    {(s.count || 0).toLocaleString()}
                  </div>
                  <div className="text-xs" style={{ color: '#afafaf' }}>events</div>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ background: '#000000' }} className="py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs" style={{ color: '#afafaf' }}>
            © 2025 URSA — PolyU RICRI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
