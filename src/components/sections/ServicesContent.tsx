import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'

interface Props { progress: number }

const TIERS = [
  {
    tag: 'TIER_01', name: 'AI Foundations', price: '$1.5K–$3K', duration: '2–4 weeks',
    desc: 'Perfect for businesses new to AI. We introduce you to the basics and help you implement immediate wins.',
    features: ['AI readiness assessment', 'Tool recommendations', 'Custom SOPs', 'Team training'],
    roi: '2–3x / Year 1', featured: false,
  },
  {
    tag: 'TIER_02', name: 'Workflow Automation', price: '$3K–$10K', duration: '4–8 weeks',
    desc: "Ready to scale? We automate your core workflows and integrate your systems for seamless operations.",
    features: ['Workflow analysis & optimization', 'System integrations (CRM, PM, etc.)', 'Custom automation (3 processes)', 'AI-assisted operations'],
    roi: '3–5x / Year 1', featured: true,
  },
  {
    tag: 'TIER_03', name: 'Agentic AI', price: '$10K–$30K+', duration: '8–16 weeks',
    desc: "Full transformation. We design and deploy custom AI agents to create a truly lean, autonomous operation.",
    features: ['Business process re-engineering', 'Custom AI agent development', 'Autonomous workflows', 'Lean-office transformation'],
    roi: '5–10x / Year 1', featured: false,
  },
]

function scrollToProgress(p: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * maxScroll, behavior: 'smooth' })
}

export default function ServicesContent({ progress }: Props) {
  const opacity = smoothstep(0.37, 0.39, progress) * (1 - smoothstep(0.49, 0.50, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      opacity, padding: '80px clamp(16px, 4vw, 60px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '960px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

        <div className="section-label">service_tiers</div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#E0E0EC', margin: 0, textAlign: 'center' }}>Services</h2>
        <DiamondDivider />
        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem', color: '#6A6A8A', textAlign: 'center', maxWidth: '500px' }}>
          Three tiers designed to meet you where you are in your AI journey.
        </p>

        {/* Tier cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', width: '100%' }}>
          {TIERS.map((t) => (
            <div
              key={t.tag}
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                background: t.featured ? 'rgba(22,22,37,0.95)' : 'rgba(22,22,37,0.8)',
                border: `1px solid ${t.featured ? '#FF6B00' : '#252540'}`,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {t.featured && (
                <>
                  {/* Shimmer top border */}
                  <div className="tier-shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px' }} />
                  <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    fontFamily: '"Share Tech Mono", monospace', fontSize: '0.58rem',
                    letterSpacing: '0.1em', padding: '3px 8px',
                    background: 'linear-gradient(135deg, #FF6B00, #FFAA00)', color: '#000', fontWeight: 700,
                  }}>★ MOST POPULAR</div>
                </>
              )}

              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', letterSpacing: '0.15em', marginBottom: '8px' }}>{t.tag}</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 700, color: t.featured ? '#FF6B00' : '#00E5FF', marginBottom: '4px' }}>{t.name}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '2px' }}>{t.price}</div>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#6A6A8A', marginBottom: '14px' }}>{t.duration}</div>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#6A6A8A', lineHeight: 1.5, marginBottom: '16px' }}>{t.desc}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {t.features.map((f, i) => (
                  <li key={i} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#E0E0EC', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ color: t.featured ? '#FF6B00' : '#00E5FF', flexShrink: 0 }}>▸</span> {f}
                  </li>
                ))}
              </ul>

              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#6A6A8A', marginBottom: '16px' }}>
                ROI: <span style={{ color: t.featured ? '#FF6B00' : '#00E5FF' }}>{t.roi}</span>
              </div>

              <button
                onClick={() => scrollToProgress(0.90)}
                className="card-clip"
                style={{
                  fontFamily: '"Share Tech Mono", monospace', fontSize: '0.72rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase', width: '100%',
                  background: t.featured ? 'linear-gradient(135deg, #FF6B00, #FFAA00)' : 'transparent',
                  color: t.featured ? '#000' : '#00E5FF',
                  border: t.featured ? 'none' : '1px solid #00E5FF',
                  cursor: 'pointer', padding: '12px',
                  pointerEvents: 'auto',
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Retainer card */}
        <div style={{
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
          background: 'rgba(22,22,37,0.8)', borderLeft: '3px solid #FF6B00',
          border: '1px solid #252540', borderLeftColor: '#FF6B00',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          padding: '20px', width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', letterSpacing: '0.1em', marginBottom: '4px' }}>[ ongoing_support ]</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '6px' }}>Ongoing Support &amp; Advisory</div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#6A6A8A', margin: 0 }}>After your project, keep us on retainer for continuous optimization and support.</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', marginBottom: '4px' }}>Starting at</div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 900,
              background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>$980/month</div>
          </div>
        </div>
      </div>
    </div>
  )
}
