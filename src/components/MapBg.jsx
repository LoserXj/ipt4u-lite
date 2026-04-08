import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json'

const DIMS = [
  {
    key: 'giri', label: 'Overall GIRI', sublabel: 'Composite resilience score',
    expr: ['interpolate', ['linear'], ['coalesce', ['get', 'giri'], 50],
      0, '#ef4444', 25, '#f97316', 50, '#eab308', 75, '#84cc16', 100, '#22c55e'],
  },
  {
    key: 'abs', label: 'Absorb Capacity', sublabel: 'Pre-event resistance',
    expr: ['interpolate', ['linear'], ['coalesce', ['get', 'abs'], 50],
      0, '#22c55e', 25, '#84cc16', 50, '#eab308', 75, '#f97316', 100, '#ef4444'],
  },
  {
    key: 'resp', label: 'Respond Capacity', sublabel: 'Post-event coping',
    expr: ['interpolate', ['linear'], ['coalesce', ['get', 'resp'], 50],
      0, '#22c55e', 25, '#84cc16', 50, '#eab308', 75, '#f97316', 100, '#ef4444'],
  },
  {
    key: 'rest', label: 'Restore Capacity', sublabel: 'Recovery speed',
    expr: ['interpolate', ['linear'], ['coalesce', ['get', 'rest'], 50],
      0, '#ef4444', 25, '#f97316', 50, '#eab308', 75, '#84cc16', 100, '#22c55e'],
  },
]

const INTERVAL_MS = 3800

export default function MapBg({ onDimChange }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const rafRef       = useRef(null)
  const lngRef       = useRef(10)
  const timerRef     = useRef(null)
  const dimIdxRef    = useRef(0)
  const dataReadyRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || mapRef.current) return

    const map = new maplibregl.Map({
      container,
      style: MAP_STYLE,
      center: [lngRef.current, 18],
      zoom: 1.4,
      interactive: false,
      attributionControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      map.resize()

      map.addSource('cities-bg', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      })

      map.addLayer({
        id: 'cities-dots',
        type: 'circle',
        source: 'cities-bg',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 1, 1.6, 3, 2.4, 5, 3.5],
          'circle-color': DIMS[0].expr,
          'circle-opacity': 0.85,
          'circle-stroke-width': 0,
        },
      })

      fetch(`${import.meta.env.BASE_URL}data/global_resilience.json`)
        .then(r => r.json())
        .then(cities => {
          if (!mapRef.current) return
          const features = cities
            .filter(c => c.GIRI_city != null)
            .map(c => ({
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
              properties: {
                giri: c.GIRI_city,
                abs:  c.cap_abs,
                resp: c.cap_resp,
                rest: c.cap_rest,
              },
            }))
          mapRef.current.getSource('cities-bg')?.setData({ type: 'FeatureCollection', features })
          dataReadyRef.current = true
          onDimChange?.(DIMS[0])

          timerRef.current = setInterval(() => {
            if (!mapRef.current || !dataReadyRef.current) return
            dimIdxRef.current = (dimIdxRef.current + 1) % DIMS.length
            const d = DIMS[dimIdxRef.current]
            mapRef.current.setPaintProperty('cities-dots', 'circle-color', d.expr)
            onDimChange?.(d)
          }, INTERVAL_MS)
        })
        .catch(() => {})

      // Slow drift
      const drift = () => {
        lngRef.current += 0.012
        map.setCenter([(lngRef.current % 360) - 180, 18])
        rafRef.current = requestAnimationFrame(drift)
      }
      rafRef.current = requestAnimationFrame(drift)
    })

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(timerRef.current)
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 85%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 85%)',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%', opacity: 0.7 }} />
    </div>
  )
}
