import { useState } from 'react'
import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'

interface Props { progress: number }

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'rgba(10,10,15,0.6)',
  border: '1px solid #252540',
  color: '#E0E0EC',
  padding: '12px 14px',
  fontFamily: 'Rajdhani, sans-serif',
  fontSize: '1rem',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function ContactContent({ progress }: Props) {
  const opacity = smoothstep(0.90, 0.92, progress) * (1 - smoothstep(0.99, 1.0, progress))
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity, padding: '80px clamp(16px, 4vw, 60px)',
      overflowY: 'auto', pointerEvents: opacity > 0.1 ? 'none' : 'none',
    }}>
      <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>

        <div className="section-label">contact_us</div>
        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#E0E0EC', margin: 0, textAlign: 'center' }}>
          Ready to Get Started?
        </h2>
        <DiamondDivider />
        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.05rem', color: '#6A6A8A', textAlign: 'center', maxWidth: '480px', lineHeight: 1.6 }}>
          Let's talk about how AI can transform your business. No pitch, no pressure — just a straight conversation about what's possible.
        </p>

        {/* Split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>

          {/* Contact Form */}
          <div style={{ ...cardStyle, padding: '28px', pointerEvents: 'auto' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</div>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.9rem', color: '#00E5FF', marginBottom: '8px' }}>MESSAGE SENT</div>
                <p style={{ fontFamily: 'Rajdhani, sans-serif', color: '#6A6A8A' }}>We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '4px' }}>Send a Message</div>

                <div>
                  <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>NAME</label>
                  <input
                    type="text" placeholder="Your name" required
                    value={formState.name}
                    onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00E5FF'}
                    onBlur={e => e.target.style.borderColor = '#252540'}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>EMAIL</label>
                  <input
                    type="email" placeholder="your@email.com" required
                    value={formState.email}
                    onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#00E5FF'}
                    onBlur={e => e.target.style.borderColor = '#252540'}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>MESSAGE</label>
                  <textarea
                    placeholder="Tell us about your business and what you're looking for..." required rows={4}
                    value={formState.message}
                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    onFocus={e => e.target.style.borderColor = '#00E5FF'}
                    onBlur={e => e.target.style.borderColor = '#252540'}
                  />
                </div>

                <button
                  type="submit"
                  className="card-clip"
                  style={{
                    fontFamily: '"Share Tech Mono", monospace', fontSize: '0.78rem',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
                    color: '#000', border: 'none', cursor: 'pointer',
                    padding: '14px', fontWeight: 700,
                  }}
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', pointerEvents: 'auto' }}>
            {[
              { icon: '📍', label: 'LOCATIONS', value: 'Staten Island, NY / Tampa, FL', href: null },
              { icon: '✉', label: 'EMAIL', value: 'info@apexprometheus.ai', href: 'mailto:info@apexprometheus.ai' },
              { icon: '☎', label: 'PHONE', value: '(718) 603-1726', href: 'tel:+17186031726' },
              { icon: '💬', label: 'TEXT / SMS', value: '(718) 603-1726', href: 'sms:+17186031726' },
            ].map((item, i) => (
              <div key={i} style={{ ...cardStyle, padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.58rem', color: '#6A6A8A', letterSpacing: '0.12em', marginBottom: '4px' }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#00E5FF', textDecoration: 'none' }}>{item.value}</a>
                  ) : (
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#E0E0EC' }}>{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            {/* Telegram / WhatsApp */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="https://t.me/ApexPrometheus"
                className="card-clip"
                style={{
                  flex: 1, padding: '12px', textAlign: 'center',
                  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
                  backdropFilter: 'blur(8px)', textDecoration: 'none',
                  fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem',
                  color: '#00E5FF', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                ✈ Telegram
              </a>
              <a
                href="https://wa.me/17186031726"
                className="card-clip"
                style={{
                  flex: 1, padding: '12px', textAlign: 'center',
                  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
                  backdropFilter: 'blur(8px)', textDecoration: 'none',
                  fontFamily: '"Share Tech Mono", monospace', fontSize: '0.65rem',
                  color: '#00E5FF', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                }}
              >
                💬 WhatsApp
              </a>
            </div>

            {/* Response time callout */}
            <div style={{ ...cardStyle, padding: '14px', borderLeft: '3px solid #00E5FF', borderColor: '#252540', borderLeftColor: '#00E5FF' }}>
              <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#00E5FF', letterSpacing: '0.1em', marginBottom: '6px' }}>{'>'} response_time</div>
              <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#6A6A8A', margin: 0 }}>We typically respond within 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          width: '100%', borderTop: '1px solid #252540', paddingTop: '20px', marginTop: '8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#00E5FF', letterSpacing: '0.2em' }}>APEX PROMETHEUS</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: '#6A6A8A' }}>© 2026 Apex Prometheus. All rights reserved.</div>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#6A6A8A', letterSpacing: '0.1em' }}>
            Staten Island, NY | Tampa, FL |{' '}
            <a href="mailto:info@apexprometheus.ai" style={{ color: '#00E5FF', textDecoration: 'none' }}>info@apexprometheus.ai</a>
          </div>
        </div>
      </div>
    </div>
  )
}
