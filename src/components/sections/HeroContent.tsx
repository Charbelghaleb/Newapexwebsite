import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'
import { FLAME_LOGO } from '../../context/ScrollContext'

interface Props { progress: number }

const card: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  border: '1px solid #252540',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
}

function scrollToProgress(p: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * maxScroll, behavior: 'smooth' })
}

export default function HeroContent({ progress }: Props) {
  const opacity = smoothstep(0.01, 0.03, progress) * (1 - smoothstep(0.08, 0.10, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity,
      transition: 'opacity 0.1s',
      pointerEvents: opacity > 0.1 ? 'none' : 'none',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>

        {/* Flame Logo */}
        <div className="logo-float fade-up-1">
          <img
            src={FLAME_LOGO}
            alt="Apex Prometheus Flame"
            style={{ width: '220px', height: '220px', objectFit: 'contain' }}
          />
        </div>

        {/* Diamond divider */}
        <div className="fade-up-2">
          <DiamondDivider />
        </div>

        {/* Headline */}
        <h1 className="fade-up-3" style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(2.8rem, 8vw, 6rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          color: '#E0E0EC',
          margin: 0,
        }}>
          Survive &amp; Thrive<br />
          <span style={{
            color: '#00E5FF',
            textShadow: '0 0 30px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.2)',
          }}>with AI</span>
        </h1>

        {/* Description */}
        <p className="fade-up-4" style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: 'clamp(1.05rem, 2.1vw, 1.3rem)',
          color: '#6A6A8A',
          maxWidth: '580px',
          lineHeight: 1.6,
          margin: 0,
        }}>
          We help small and mid-size businesses adopt AI tools and build lean operations.
          From basic implementations to full agentic workflows — we've done it in our own
          business, and we know how to do it in yours.
        </p>

        {/* Buttons */}
        <div className="fade-up-5" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', pointerEvents: 'auto' }}>
          <button
            onClick={() => scrollToProgress(0.90)}
            className="card-clip"
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.8rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
              color: '#000', border: 'none', cursor: 'pointer',
              padding: '14px 28px', fontWeight: 700,
            }}
          >
            Book Consultation →
          </button>
          <button
            onClick={() => scrollToProgress(0.37)}
            className="card-clip"
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.8rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(22,22,37,0.6)',
              color: '#00E5FF',
              border: '1px solid #00E5FF',
              cursor: 'pointer',
              padding: '14px 28px',
            }}
          >
            Explore Services
          </button>
        </div>
      </div>
    </div>
  )
}
