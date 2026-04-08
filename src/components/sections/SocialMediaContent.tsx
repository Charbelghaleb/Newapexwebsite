import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'

interface Props { progress: number }

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
}

const PACKAGES = [
  {
    name: 'Content Starter', price: '$500/mo',
    features: ['12 posts/month', 'Branded graphics', 'Content calendar', 'Monthly analytics'],
    featured: false,
  },
  {
    name: 'Content Pro', price: '$1,000/mo',
    features: ['20 posts/month', 'Automated scheduling', 'Stories/Reels', 'Bi-weekly optimization', 'Hashtag strategy'],
    featured: true,
  },
  {
    name: 'Content Domination', price: '$2,000/mo',
    features: ['30+ posts/month', 'Video content', 'Engagement monitoring', 'Weekly calls', 'Competitor monitoring'],
    featured: false,
  },
]

const STATS = [
  { value: '67%', label: 'more leads from social media' },
  { value: '78%', label: 'check social before hiring' },
  { value: '6-8hrs', label: 'average time wasted weekly' },
  { value: '30min', label: 'with our system' },
]

function scrollToProgress(p: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * maxScroll, behavior: 'smooth' })
}

export default function SocialMediaContent({ progress }: Props) {
  const opacity = smoothstep(0.67, 0.69, progress) * (1 - smoothstep(0.74, 0.75, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity, padding: '80px clamp(16px, 4vw, 60px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '860px', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>

        <div className="section-label">content_automation</div>

        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 800, color: '#E0E0EC', margin: 0, textAlign: 'center', lineHeight: 1.2 }}>
          Your Social Media Isn't Dead.<br />
          <span style={{ color: '#FF6B00' }}>It's Just Running on Manual.</span>
        </h2>

        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#6A6A8A', textAlign: 'center', maxWidth: '520px', lineHeight: 1.6 }}>
          You haven't posted in 3 months. Maybe 6. Your competitors who DO post consistently are getting the calls you're not.
        </p>

        {/* 3-step flow */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {['Brand DNA Extraction', 'Content Production at Scale', 'Automated Posting & Optimization'].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ ...cardStyle, padding: '10px 16px', textAlign: 'center', minWidth: '160px' }}>
                <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', marginBottom: '4px' }}>0{i + 1}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', fontWeight: 600, color: '#E0E0EC' }}>{step}</div>
              </div>
              {i < 2 && <span style={{ color: '#00E5FF', fontSize: '1rem' }}>→</span>}
            </div>
          ))}
        </div>

        {/* Before / After */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
          <div style={{ ...cardStyle, border: '1px solid rgba(255,51,51,0.4)', padding: '16px' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#FF3333', letterSpacing: '0.1em', marginBottom: '12px' }}>[ BEFORE ]</div>
            {[['Last post', '4 months ago'], ['Followers', '487 stagnant'], ['Social leads', '0–1/month'], ['Time spent', '0 or 8+ hrs/wk']].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                <span style={{ color: '#6A6A8A' }}>{k}</span>
                <span style={{ color: '#E0E0EC' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ ...cardStyle, border: '1px solid rgba(0,229,255,0.4)', padding: '16px' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#00E5FF', letterSpacing: '0.1em', marginBottom: '12px' }}>[ AFTER ]</div>
            {[['Posts/week', '5–7'], ['Followers', '+15–25%/month'], ['Social leads', '8–12/month'], ['Time spent', '30 min reviewing']].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
                <span style={{ color: '#6A6A8A' }}>{k}</span>
                <span style={{ color: '#00E5FF' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', width: '100%' }}>
          {PACKAGES.map((p, i) => (
            <div key={i} style={{
              ...cardStyle,
              border: `1px solid ${p.featured ? '#FF6B00' : '#252540'}`,
              padding: '20px', position: 'relative', overflow: 'hidden',
            }}>
              {p.featured && <div className="tier-shimmer" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px' }} />}
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.82rem', fontWeight: 700, color: p.featured ? '#FF6B00' : '#00E5FF', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '12px' }}>{p.price}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: '#6A6A8A', display: 'flex', gap: '6px' }}>
                    <span style={{ color: p.featured ? '#FF6B00' : '#00E5FF' }}>▸</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollToProgress(0.90)}
                className="card-clip"
                style={{
                  width: '100%', fontFamily: '"Share Tech Mono", monospace', fontSize: '0.7rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                  background: p.featured ? 'linear-gradient(135deg, #FF6B00, #FFAA00)' : 'transparent',
                  color: p.featured ? '#000' : '#00E5FF',
                  border: p.featured ? 'none' : '1px solid #00E5FF',
                  padding: '10px', pointerEvents: 'auto',
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', width: '100%' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ ...cardStyle, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 900, color: '#00E5FF', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.78rem', color: '#6A6A8A', lineHeight: 1.3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
