import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'
import { FLAME_LOGO } from '../../context/ScrollContext'

interface Props { progress: number }

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  padding: '24px',
}

const FEATURES = [
  { icon: '🛡', title: 'Real-World Experience', desc: "Built in a real business, not a lab." },
  { icon: '📈', title: 'Proven Results', desc: "Systems that generate measurable ROI from day one." },
  { icon: '⚡', title: 'Practical Solutions', desc: "No fluff, no theory — just things that work." },
  { icon: '📍', title: 'Local & Accessible', desc: "Staten Island, NY & Tampa, FL — in your corner." },
]

export default function AboutContent({ progress }: Props) {
  const opacity = smoothstep(0.77, 0.79, progress) * (1 - smoothstep(0.86, 0.88, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity, padding: '80px clamp(16px, 5vw, 80px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

        <div className="section-label">about_us</div>

        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#E0E0EC', margin: 0, textAlign: 'center' }}>
          Why Apex Prometheus?
        </h2>

        <DiamondDivider />

        {/* Main card */}
        <div style={{ ...cardStyle, position: 'relative', width: '100%' }}>
          {/* Circuit corner decorations */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '40px', height: '40px', borderTop: '1px solid rgba(0,229,255,0.3)', borderLeft: '1px solid rgba(0,229,255,0.3)' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40px', height: '40px', borderBottom: '1px solid rgba(0,229,255,0.3)', borderRight: '1px solid rgba(0,229,255,0.3)' }} />

          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#00E5FF', letterSpacing: '0.15em', marginBottom: '12px' }}>{'>'} not_theorists</div>

          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#E0E0EC', marginBottom: '14px', lineHeight: 1.3 }}>
            We're Practitioners, Not Theorists
          </h3>

          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#6A6A8A', lineHeight: 1.7, marginBottom: '12px' }}>
            Our founder runs a successful construction and painting company in Staten Island. He's built a lean operation by implementing AI and agentic workflows in his own business. We're not consultants who read about AI — we're business owners who live it every day.
          </p>

          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#6A6A8A', lineHeight: 1.7, marginBottom: '20px' }}>
            Apex Prometheus brings fire to your business — not as a gimmick, not as a pitch — as a tool we've already forged in the real world.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '3px' }}>{f.title}</div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: '#6A6A8A' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Founder card */}
        <div style={{ ...cardStyle, width: '100%', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={FLAME_LOGO}
            alt="Apex Prometheus"
            style={{ width: '72px', height: '72px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '4px' }}>Apex Prometheus</div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#6A6A8A', margin: '0 0 10px 0', lineHeight: 1.5 }}>
              Built by business owners who've done it. Powered by AI that actually works.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Staten Island NY', 'Tampa FL'].map((loc, i) => (
                <span key={i} style={{
                  fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem',
                  letterSpacing: '0.1em', padding: '4px 10px',
                  border: '1px solid #252540', color: '#6A6A8A',
                  background: 'rgba(10,10,15,0.5)',
                }}>📍 {loc}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
