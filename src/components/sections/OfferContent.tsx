import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'

interface Props { progress: number }

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)',
  border: '1px solid #252540',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  padding: '20px',
  display: 'flex', gap: '14px',
}

const GIFTS = [
  { title: '1. Scan Your Business (Free)', body: "We run your website through our Brand DNA system. In 3 minutes, we extract your colors, your voice, your imagery, and your market positioning." },
  { title: '2. Build You 2 Weeks of Social Content (Free)', body: "Using your Brand DNA, we generate 14 days of ready-to-post social media content — branded graphics, captions in your voice, hashtags targeting your local market." },
  { title: '3. Show You What AI Says About Your Business (Free)', body: "We run your business through ChatGPT, Perplexity, Google AI Overviews, and Claude. You'll see exactly what AI recommends when customers ask about businesses like yours." },
  { title: '4. Give You Your AI Visibility Score (Free)', body: "A detailed report showing where you rank in AI search, what's helping you, what's hurting you, and the specific steps to become the #1 AI recommendation in your market." },
]

function scrollToProgress(p: number) {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * maxScroll, behavior: 'smooth' })
}

export default function OfferContent({ progress }: Props) {
  const opacity = smoothstep(0.22, 0.24, progress) * (1 - smoothstep(0.33, 0.35, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity, padding: '80px clamp(16px, 5vw, 60px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '680px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Badge */}
        <div style={{ alignSelf: 'flex-start' }}>
          <span
            className="card-clip"
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
              color: '#000', padding: '6px 14px', fontWeight: 700,
            }}
          >
            FREE PACKAGE
          </span>
        </div>

        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
          fontWeight: 800, color: '#E0E0EC', margin: 0, lineHeight: 1.2,
        }}>
          Here's What We'll Do for Your Business —<br />
          <span style={{ color: '#FF6B00' }}>Before You Pay Us a Dime</span>
        </h2>

        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem', color: '#6A6A8A', margin: 0 }}>
          Most AI consultants show up with a slideshow. We show up with finished work.
        </p>

        {GIFTS.map((g, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>🎁</div>
            <div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#00E5FF', marginBottom: '6px', lineHeight: 1.3 }}>{g.title}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', color: '#6A6A8A', lineHeight: 1.5 }}>{g.body}</div>
            </div>
          </div>
        ))}

        {/* Value box */}
        <div style={{
          ...cardStyle,
          borderColor: '#FF6B00',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <div>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#6A6A8A', letterSpacing: '0.1em', marginBottom: '4px' }}>TOTAL VALUE</div>
            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', color: '#E0E0EC', lineHeight: 1 }}>$2,500+</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#6A6A8A', letterSpacing: '0.1em', marginBottom: '4px' }}>YOUR COST</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#00E5FF', lineHeight: 1 }}>$0</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          <button
            onClick={() => scrollToProgress(0.90)}
            className="card-clip"
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.78rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
              color: '#000', border: 'none', cursor: 'pointer',
              padding: '12px 24px', fontWeight: 700,
            }}
          >
            Get My Free Package →
          </button>
          <button
            onClick={() => scrollToProgress(0.90)}
            className="card-clip"
            style={{
              fontFamily: '"Share Tech Mono", monospace', fontSize: '0.78rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: 'rgba(22,22,37,0.6)', color: '#00E5FF',
              border: '1px solid #00E5FF', cursor: 'pointer', padding: '12px 24px',
            }}
          >
            Book a 15-Min Call
          </button>
        </div>

        {/* Churchill Guarantee */}
        <div style={{
          ...cardStyle,
          borderLeft: '3px solid #00E5FF', borderColor: '#252540', borderLeftColor: '#00E5FF',
        }}>
          <div style={{ width: '100%' }}>
            <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#00E5FF', letterSpacing: '0.15em', marginBottom: '10px' }}>
              {'>'} the_churchill_guarantee
            </div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', color: '#6A6A8A', lineHeight: 1.6, margin: 0 }}>
              We run a real business — Churchill Painting Corp in NYC. Every system we offer is running in our company right now.{' '}
              <strong style={{ color: '#E0E0EC' }}>If we can't identify at least $10,000 in annual savings for your business, the consultation is completely free.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
