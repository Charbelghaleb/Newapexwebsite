import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'

interface Props { progress: number }

const CARDS = [
  { icon: '⚡', title: "You're Losing Time (and Money)", body: "Manual processes drain your team's productivity. While competitors automate, you're stuck in the old way of doing things." },
  { icon: '👥', title: "Your Team is Overwhelmed", body: "Without lean operations, you need more staff to handle the same workload. AI can do the heavy lifting — if you know how to use it." },
  { icon: '📉', title: "You're Falling Behind", body: "The AI adoption gap is real. Large companies are already reaping the benefits. SMBs that wait will find themselves at a serious disadvantage." },
  { icon: '🛡', title: "You Don't Know Where to Start", body: "There's too much hype, too many tools, and too many consultants selling snake oil. You need someone who's actually done it." },
]

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)',
  border: '1px solid #252540',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  padding: '20px',
}

export default function ProblemContent({ progress }: Props) {
  const opacity = smoothstep(0.12, 0.14, progress) * (1 - smoothstep(0.19, 0.20, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      opacity, padding: '80px clamp(16px, 5vw, 80px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div className="section-label">problem_statement</div>

        <h2 style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 800, color: '#E0E0EC', margin: 0, lineHeight: 1.1,
        }}>The Problem</h2>

        <DiamondDivider />

        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.1rem', color: '#6A6A8A', lineHeight: 1.6 }}>
          AI isn't a luxury anymore — it's a necessity. Businesses that don't adopt AI now will struggle to compete tomorrow.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {CARDS.map((c, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{c.icon}</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '8px', lineHeight: 1.3 }}>{c.title}</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem', color: '#6A6A8A', lineHeight: 1.5 }}>{c.body}</div>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div style={{
          ...cardStyle,
          borderLeft: '3px solid #FF6B00',
          borderColor: '#252540',
          borderLeftColor: '#FF6B00',
        }}>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem', color: '#00E5FF', letterSpacing: '0.15em', marginBottom: '10px' }}>
            {'>'} reality_check
          </div>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#6A6A8A', lineHeight: 1.6, margin: 0 }}>
            Businesses that adopt AI now will dominate their markets. Those that wait will become irrelevant. The question isn't{' '}
            <em>"should we adopt AI?"</em> — it's{' '}
            <strong style={{ background: 'linear-gradient(135deg, #FF6B00, #FFAA00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              "how quickly can we get started?"
            </strong>
          </p>
        </div>
      </div>
    </div>
  )
}
