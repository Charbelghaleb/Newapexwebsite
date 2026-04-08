import { useState } from 'react'
import { FLAME_LOGO } from '../context/ScrollContext'

const SCROLL_PAGES = 25

interface Props {
  scrollProgress: number
  scrollY: number
}

const NAV_LINKS = [
  { label: 'Problem', target: 0.12 },
  { label: 'Services', target: 0.37 },
  { label: 'Industries', target: 0.52 },
  { label: 'Social Media', target: 0.67 },
  { label: 'About', target: 0.77 },
  { label: 'Contact', target: 0.90 },
]

function scrollToProgress(p: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * maxScroll, behavior: 'smooth' })
}

export default function Navigation({ scrollProgress, scrollY }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const visible = scrollProgress > 0.01
  const blurred = scrollY > 50

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(16px, 4vw, 48px)',
        background: blurred ? 'rgba(10,10,15,0.85)' : 'transparent',
        backdropFilter: blurred ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: blurred ? 'blur(20px)' : 'none',
        borderBottom: blurred ? '1px solid rgba(37,37,64,0.5)' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.5s ease, background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo + Brand */}
      <button
        onClick={() => scrollToProgress(0)}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <img src={FLAME_LOGO} alt="Apex Prometheus" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        <span style={{
          fontFamily: 'Orbitron, sans-serif', fontWeight: 800, fontSize: '0.8rem',
          letterSpacing: '0.1em', color: '#00E5FF', textTransform: 'uppercase',
        }}>
          APEX PROMETHEUS
        </span>
      </button>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="hidden-mobile">
        {NAV_LINKS.map(link => (
          <button
            key={link.label}
            onClick={() => scrollToProgress(link.target)}
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.7rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: '#6A6A8A', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'color 0.2s',
              padding: '4px 0',
              borderBottom: '1px solid transparent',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = '#00E5FF'
              ;(e.target as HTMLElement).style.borderBottomColor = '#00E5FF'
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = '#6A6A8A'
              ;(e.target as HTMLElement).style.borderBottomColor = 'transparent'
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      {/* CTA Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => scrollToProgress(0.90)}
          className="card-clip"
          style={{
            fontFamily: '"Share Tech Mono", monospace', fontSize: '0.72rem',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
            color: '#000',
            border: 'none', cursor: 'pointer',
            padding: '10px 20px',
            fontWeight: 700,
          }}
        >
          Book Consultation →
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="show-mobile"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'none', flexDirection: 'column', gap: '5px', padding: '4px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#E0E0EC', transition: 'all 0.3s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#E0E0EC', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#E0E0EC', transition: 'all 0.3s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '72px', left: 0, right: 0,
          background: 'rgba(10,10,15,0.97)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #252540',
          padding: '16px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.label}
              onClick={() => { scrollToProgress(link.target); setMenuOpen(false) }}
              style={{
                fontFamily: '"Share Tech Mono", monospace', fontSize: '0.8rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#6A6A8A', background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 8px', textAlign: 'left',
                borderBottom: '1px solid #252540',
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
