import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo1 from '../../assets/logo1.png'
import logo2 from '../../assets/logo2.png'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Methodology', path: '/methodology' },
  { label: 'Data', path: '/data' },
  { label: 'Assessment', path: '/assessment' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        background: '#ffffff',
        borderBottom: scrolled ? '1px solid #e2e2e2' : '1px solid transparent',
        boxShadow: scrolled ? 'rgba(0,0,0,0.08) 0px 2px 8px' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo1} alt="PolyU" className="h-10 w-auto object-contain" />
          <div className="w-px h-6 bg-gray-300" />
          <img src={logo2} alt="RICRI" className="h-10 w-auto object-contain" />
          <div className="w-px h-6 bg-gray-300" />
          <span className="font-bold text-base tracking-widest" style={{ color: '#000000' }}>
            IPT4U
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-150 no-underline"
                style={{
                  background: isActive ? '#000000' : 'transparent',
                  color: isActive ? '#ffffff' : '#000000',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#efefef'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ background: menuOpen ? '#efefef' : 'transparent' }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 pb-4 pt-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 rounded-lg text-sm font-medium mb-1 no-underline"
                style={{
                  background: isActive ? '#000000' : 'transparent',
                  color: isActive ? '#ffffff' : '#000000',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
