import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const DIMS = [
  { key: 'GIRI_city', label: 'Overall URSA', dir: 1 },
  { key: 'cap_abs',   label: 'Absorb',       dir: -1 },
  { key: 'cap_resp',  label: 'Respond',      dir: -1 },
  { key: 'cap_rest',  label: 'Restore',      dir: 1 },
]

function colorExpr(field, dir) {
  if (dir === 1) {
    return ['interpolate', ['linear'], ['coalesce', ['get', field], 50],
      0, '#d73027', 25, '#f46d43', 50, '#ffffbf', 75, '#a6d96a', 100, '#1a9850',
    ]
  }
  return ['interpolate', ['linear'], ['coalesce', ['get', field], 50],
    0, '#1a9850', 25, '#a6d96a', 50, '#ffffbf', 75, '#f46d43', 100, '#d73027',
  ]
}

function legendGradient(dir) {
  if (dir === 1) return 'linear-gradient(to right,#d73027,#f46d43,#ffffbf,#a6d96a,#1a9850)'
  return 'linear-gradient(to right,#1a9850,#a6d96a,#ffffbf,#f46d43,#d73027)'
}

export default function Assessment() {
  const [activeDim, setActiveDim] = useState('GIRI_city')
  const [cities, setCities]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [mapReady, setMapReady]   = useState(false)
  const [hoveredCity, setHoveredCity] = useState(null)

  const mapContainerRef = useRef(null)
  const mapRef          = useRef(null)
  const popupRef        = useRef(null)

  const dim = DIMS.find(d => d.key === activeDim)

  // Load data
  useEffect(() => {
    fetch('/data/global_resilience.json')
      .then(r => r.json())
      .then(data => setCities(data))
      .catch(err => console.warn('Failed to load resilience data', err))
      .finally(() => setLoading(false))
  }, [])

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json',
      center: [15, 20],
      zoom: 1.8,
      attributionControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      map.resize()

      map.addSource('cities', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      map.addLayer({
        id: 'cities-layer',
        type: 'circle',
        source: 'cities',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            1, 2, 3, 3, 6, 5, 9, 8,
          ],
          'circle-color': colorExpr('GIRI_city', 1),
          'circle-opacity': 0.85,
          'circle-stroke-width': 0.4,
          'circle-stroke-color': 'rgba(0,0,0,0.3)',
        },
      })

      setMapReady(true)
    })

    return () => { map.remove(); mapRef.current = null }
  }, [])

  // Push data to map
  useEffect(() => {
    if (!mapReady || !cities || !mapRef.current) return
    const features = cities
      .filter(c => c.GIRI_city != null)
      .map(c => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: {
          city: c.city,
          country: c.country_name,
          region: c.region_name,
          GIRI_city: c.GIRI_city,
          cap_abs: c.cap_abs,
          cap_resp: c.cap_resp,
          cap_rest: c.cap_rest,
        },
      }))
    mapRef.current.getSource('cities')?.setData({ type: 'FeatureCollection', features })
  }, [mapReady, cities])

  // Update color on dimension change
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    if (!mapRef.current.getLayer('cities-layer')) return
    mapRef.current.setPaintProperty('cities-layer', 'circle-color', colorExpr(dim.key, dim.dir))
  }, [activeDim, mapReady, dim])

  // Hover tooltip
  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const map = mapRef.current

    if (!popupRef.current) {
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10,
      })
    }
    const popup = popupRef.current

    const onEnter = e => {
      map.getCanvas().style.cursor = 'pointer'
      const p = e.features[0].properties
      const val = p[activeDim]
      setHoveredCity(p)
      popup
        .setLngLat(e.features[0].geometry.coordinates)
        .setHTML(`
          <div style="font-family:Inter,system-ui,sans-serif;font-size:12px;padding:10px 12px;
            background:#ffffff;border:1px solid #e2e2e2;border-radius:8px;
            color:#000000;min-width:170px;line-height:1.6;
            box-shadow:rgba(0,0,0,0.12) 0px 4px 16px">
            <div style="font-weight:700;font-size:13px;margin-bottom:2px">${p.city}</div>
            <div style="color:#4b4b4b;font-size:11px;margin-bottom:8px">${p.country} · ${p.region}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="color:#4b4b4b;font-size:11px">URSA Score</span>
              <span style="font-weight:700;font-size:15px">${p.GIRI_city != null ? Number(p.GIRI_city).toFixed(1) : '—'}</span>
            </div>
            ${activeDim !== 'GIRI_city' ? `
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="color:#4b4b4b;font-size:11px">${dim.label}</span>
              <span style="font-size:12px">${val != null ? Number(val).toFixed(1) : '—'}</span>
            </div>` : ''}
          </div>
        `)
        .addTo(map)
    }

    const onLeave = () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
      setHoveredCity(null)
    }

    map.on('mouseenter', 'cities-layer', onEnter)
    map.on('mouseleave', 'cities-layer', onLeave)

    return () => {
      map.off('mouseenter', 'cities-layer', onEnter)
      map.off('mouseleave', 'cities-layer', onLeave)
      popup.remove()
    }
  }, [mapReady, activeDim, dim])

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Header */}
      <section className="px-6 py-10 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#afafaf' }}>
            URSA Framework
          </p>
          <h1 className="font-bold mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.2, color: '#000000' }}>
            Urban Resilience Assessment
          </h1>
          <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#4b4b4b' }}>
            Interactive map of URSA (PolyU Urban Resilience Scoring & Assessment) scores across 7,300+ cities. Select a resilience dimension to update the colour mapping. Hover over any city for details.
          </p>
        </motion.div>
      </section>

      {/* Dimension Selector */}
      <section className="px-6 pb-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-wrap gap-2">
          {DIMS.map((d) => {
            const active = activeDim === d.key
            return (
              <button
                key={d.key}
                onClick={() => setActiveDim(d.key)}
                className="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{
                  background: active ? '#000000' : '#efefef',
                  color: active ? '#ffffff' : '#000000',
                  border: 'none',
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#e2e2e2' }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = '#efefef' }}
              >
                {d.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Map */}
      <section className="flex-1 px-6 pb-6 max-w-6xl mx-auto w-full">
        <div className="relative rounded-xl overflow-hidden" style={{ height: '560px', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px' }}>
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-white text-sm">Loading city data…</p>
              </div>
            </div>
          )}

          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Legend */}
          <div
            className="absolute bottom-4 left-4 rounded-xl px-4 py-3"
            style={{ background: '#ffffff', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px', minWidth: '200px' }}
          >
            <div className="text-xs font-medium mb-2" style={{ color: '#000000' }}>{dim.label}</div>
            <div
              className="h-2 rounded-pill mb-1.5"
              style={{ background: legendGradient(dim.dir) }}
            />
            <div className="flex justify-between text-xs" style={{ color: '#afafaf' }}>
              <span>{dim.dir === -1 ? 'Better' : 'Worse'}</span>
              <span>{dim.dir === -1 ? 'Worse' : 'Better'}</span>
            </div>
          </div>

          {/* City count badge */}
          {cities && (
            <div
              className="absolute top-4 right-4 rounded-pill px-4 py-2 text-xs font-medium"
              style={{ background: '#ffffff', boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px', color: '#000000' }}
            >
              {cities.filter(c => c.GIRI_city != null).length.toLocaleString()} cities
            </div>
          )}
        </div>
      </section>

      {/* Summary cards */}
      {cities && (
        <section className="px-6 pb-16 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Global Mean URSA', value: (cities.reduce((s, c) => s + (c.GIRI_city ?? 0), 0) / cities.filter(c => c.GIRI_city != null).length).toFixed(1) },
              { label: 'Cities Assessed', value: cities.filter(c => c.GIRI_city != null).length.toLocaleString() },
              { label: 'Countries', value: [...new Set(cities.map(c => c.country_name))].length },
              { label: 'Regions', value: [...new Set(cities.map(c => c.region_name).filter(Boolean))].length },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-5 rounded-xl"
                style={{ boxShadow: 'rgba(0,0,0,0.12) 0px 4px 16px 0px' }}
              >
                <div className="font-bold text-2xl mb-1" style={{ color: '#000000' }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#4b4b4b' }}>{s.label}</div>
              </motion.div>
            ))}
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
