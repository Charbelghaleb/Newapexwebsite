import { useState, useEffect } from 'react'
import { smoothstep } from '../utils/mathUtils'
import { useServiceSelection } from '../context/ServiceSelectionContext'

interface Props { progress: number }

function scrollToProgress(p: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: p * max, behavior: 'smooth' })
}

// ═══════════════════════════════════════════════
// HUD PANEL — holographic card with corner brackets & header bar
// ═══════════════════════════════════════════════

function HudCorner({ top, left, color }: { top: boolean; left: boolean; color: string }) {
  const sz = 18
  return (
    <div style={{
      position: 'absolute',
      width: sz, height: sz,
      ...(top ? { top: -1 } : { bottom: -1 }),
      ...(left ? { left: -1 } : { right: -1 }),
      borderStyle: 'solid',
      borderColor: color,
      borderWidth: 0,
      ...(top && left   ? { borderTopWidth: 1, borderLeftWidth: 1 } : {}),
      ...(top && !left  ? { borderTopWidth: 1, borderRightWidth: 1 } : {}),
      ...(!top && left  ? { borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
      ...(!top && !left ? { borderBottomWidth: 1, borderRightWidth: 1 } : {}),
      pointerEvents: 'none',
    }} />
  )
}

function HudPanel({ children, variant = 'plasma', glow = false, label, compact, style }: {
  children: React.ReactNode
  variant?: 'plasma' | 'fire' | 'dim'
  glow?: boolean
  label?: string
  compact?: boolean
  style?: React.CSSProperties
}) {
  const c = {
    plasma: {
      border: 'rgba(0,229,255,0.20)',
      accent: '#00E5FF',
      accentDim: 'rgba(0,229,255,0.10)',
      headerBg: 'rgba(0,229,255,0.05)',
      shadow: 'rgba(0,229,255,0.10)',
      cornerColor: 'rgba(0,229,255,0.50)',
      dotColor: 'rgba(0,229,255,0.60)',
    },
    fire: {
      border: 'rgba(255,107,0,0.22)',
      accent: '#FF6B00',
      accentDim: 'rgba(255,107,0,0.10)',
      headerBg: 'rgba(255,107,0,0.05)',
      shadow: 'rgba(255,107,0,0.10)',
      cornerColor: 'rgba(255,107,0,0.50)',
      dotColor: 'rgba(255,107,0,0.60)',
    },
    dim: {
      border: 'rgba(37,37,64,0.55)',
      accent: '#6A6A8A',
      accentDim: 'rgba(106,106,138,0.06)',
      headerBg: 'rgba(22,22,37,0.20)',
      shadow: 'transparent',
      cornerColor: 'rgba(106,106,138,0.30)',
      dotColor: 'rgba(106,106,138,0.25)',
    },
  }[variant]

  return (
    <div style={{
      position: 'relative',
      background: `linear-gradient(170deg, ${c.headerBg} 0%, rgba(10,10,15,0.78) 35%, rgba(10,10,15,0.84) 100%)`,
      border: `1px solid ${c.border}`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      boxShadow: glow
        ? `0 0 30px ${c.shadow}, 0 0 60px rgba(0,0,0,0.4), inset 0 1px 0 ${c.accentDim}`
        : `0 0 15px rgba(0,0,0,0.25), inset 0 1px 0 ${c.accentDim}`,
      ...style,
    }}>
      {/* Corner brackets */}
      <HudCorner top left color={c.cornerColor} />
      <HudCorner top left={false} color={c.cornerColor} />
      <HudCorner top={false} left color={c.cornerColor} />
      <HudCorner top={false} left={false} color={c.cornerColor} />

      {/* Corner dots */}
      {[
        { top: -2.5, left: -2.5 },
        { top: -2.5, right: -2.5 },
        { bottom: -2.5, left: -2.5 },
        { bottom: -2.5, right: -2.5 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 4, height: 4,
          background: c.dotColor, borderRadius: '50%',
          pointerEvents: 'none', ...pos,
        } as React.CSSProperties} />
      ))}

      {/* Top edge accent glow */}
      <div style={{
        position: 'absolute', top: 0, left: 20, right: 20, height: 1,
        background: `linear-gradient(90deg, transparent, ${c.accentDim}, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Header bar */}
      {label && (
        <div style={{
          padding: compact ? '5px 14px' : '7px 18px',
          borderBottom: `1px solid ${c.border}`,
          background: c.headerBg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: '0.55rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: c.accent,
          }}>
            {'>'} {label}
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <div style={{ width: 4, height: 4, background: c.dotColor, borderRadius: '50%' }} />
            <div style={{ width: 4, height: 4, border: `1px solid ${c.cornerColor}`, transform: 'rotate(45deg)' }} />
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// HUD DIVIDER — thin line with diamond center
// ═══════════════════════════════════════════════

function HudDivider({ color = '#252540' }: { color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div style={{ width: 5, height: 5, border: `1px solid ${color}`, transform: 'rotate(45deg)', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, background: `linear-gradient(270deg, ${color}, transparent)` }} />
    </div>
  )
}

// ═══════════════════════════════════════════════
// STYLE TOKENS
// ═══════════════════════════════════════════════

const tag: React.CSSProperties = {
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: '0.58rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#6A6A8A',
  marginBottom: 8,
}

const h: React.CSSProperties = {
  fontFamily: 'Orbitron, sans-serif',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: '#E0E0EC',
  lineHeight: 1.15,
  margin: 0,
}

const p: React.CSSProperties = {
  fontFamily: 'Rajdhani, sans-serif',
  fontSize: 'clamp(0.88rem, 1.3vw, 1rem)',
  color: 'rgba(224,224,236,0.68)',
  lineHeight: 1.65,
  margin: 0,
}

const mono: React.CSSProperties = {
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: '0.65rem',
  letterSpacing: '0.08em',
  color: '#6A6A8A',
}

const ctaPrimary: React.CSSProperties = {
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  background: 'linear-gradient(135deg, #FF6B00, #FFAA00)',
  color: '#000',
  border: 'none',
  cursor: 'pointer',
  padding: '12px 24px',
  fontWeight: 700,
  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
  pointerEvents: 'auto' as const,
}

const ctaSecondary: React.CSSProperties = {
  fontFamily: '"Share Tech Mono", monospace',
  fontSize: '0.72rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  background: 'transparent',
  color: '#00E5FF',
  border: '1px solid rgba(0,229,255,0.4)',
  cursor: 'pointer',
  padding: '12px 24px',
  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
  pointerEvents: 'auto' as const,
}

// ═══════════════════════════════════════════════
// SECTION WRAPPER
// ═══════════════════════════════════════════════

type Pos = 'left' | 'center' | 'right' | 'split'

function Section({ children, visible, position = 'left', vAlign = 'bottom' }: {
  children: React.ReactNode; visible: number; position?: Pos; vAlign?: 'top' | 'center' | 'bottom'
}) {
  const base: React.CSSProperties = {
    position: 'absolute',
    opacity: visible,
    transform: `translateY(${(1 - visible) * 20}px)`,
    transition: 'opacity 0.2s, transform 0.2s',
    pointerEvents: visible > 0.1 ? 'auto' : 'none',
  }

  const pos: React.CSSProperties =
    position === 'center' ? {
      left: '50%', transform: `translateX(-50%) translateY(${(1 - visible) * 20}px)`,
      ...(vAlign === 'bottom' ? { bottom: '8vh' } : vAlign === 'top' ? { top: '12vh' } : { top: '50%', marginTop: '-20vh' }),
      width: 'min(90vw, 560px)',
    } :
    position === 'right' ? {
      right: '5vw',
      ...(vAlign === 'bottom' ? { bottom: '8vh' } : vAlign === 'center' ? { top: '50%', marginTop: '-20vh' } : { top: '12vh' }),
      width: 'min(420px, 38vw)',
    } :
    position === 'split' ? {
      left: '4vw', right: '4vw',
      ...(vAlign === 'bottom' ? { bottom: '6vh' } : { top: '12vh' }),
    } :
    { // left
      left: '5vw',
      ...(vAlign === 'bottom' ? { bottom: '8vh' } : vAlign === 'center' ? { top: '50%', marginTop: '-20vh' } : { top: '12vh' }),
      width: 'min(420px, 38vw)',
    }

  return <div style={{ ...base, ...pos }}>{children}</div>
}

// ═══════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const fi: React.CSSProperties = {
    width: '100%',
    background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(37,37,64,0.7)',
    color: '#E0E0EC',
    padding: '10px 12px',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: 8,
  }

  if (sent) return (
    <div style={{ ...mono, color: '#00E5FF', padding: '20px 0' }}>
      {'>'} message_sent // we'll be in touch shortly
    </div>
  )

  return (
    <form onSubmit={e => { e.preventDefault(); setSent(true) }}
      style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>
      <input style={fi} placeholder="name" required value={form.name}
        onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
      <input style={fi} type="email" placeholder="email" required value={form.email}
        onChange={e => setForm(s => ({ ...s, email: e.target.value }))} />
      <textarea style={{ ...fi, minHeight: '80px', resize: 'vertical' }}
        placeholder="tell us about your business..." required value={form.message}
        onChange={e => setForm(s => ({ ...s, message: e.target.value }))} />
    </form>
  )
}

// ═══════════════════════════════════════════════
// STAT BOX — inline metric display
// ═══════════════════════════════════════════════

function StatBox({ num, sub, color = '#00E5FF' }: { num: string; sub: string; color?: string }) {
  return (
    <div style={{
      flex: 1, textAlign: 'center', padding: '12px 8px',
      background: `linear-gradient(180deg, ${color === '#00E5FF' ? 'rgba(0,229,255,0.06)' : 'rgba(255,107,0,0.06)'} 0%, transparent 100%)`,
      border: `1px solid ${color === '#00E5FF' ? 'rgba(0,229,255,0.15)' : 'rgba(255,107,0,0.15)'}`,
      position: 'relative',
    }}>
      {/* tiny corner accents */}
      {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, left: 0 }, { bottom: 0, right: 0 }].map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 6, height: 6,
          borderStyle: 'solid', borderColor: color, borderWidth: 0,
          ...(pos.top !== undefined && pos.left !== undefined ? { top: -1, left: -1, borderTopWidth: 1, borderLeftWidth: 1 } : {}),
          ...(pos.top !== undefined && pos.right !== undefined ? { top: -1, right: -1, borderTopWidth: 1, borderRightWidth: 1 } : {}),
          ...(pos.bottom !== undefined && pos.left !== undefined ? { bottom: -1, left: -1, borderBottomWidth: 1, borderLeftWidth: 1 } : {}),
          ...(pos.bottom !== undefined && pos.right !== undefined ? { bottom: -1, right: -1, borderBottomWidth: 1, borderRightWidth: 1 } : {}),
          opacity: 0.35,
          pointerEvents: 'none',
        } as React.CSSProperties} />
      ))}
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.05rem', color, fontWeight: 700 }}>{num}</div>
      <div style={{ ...mono, fontSize: '0.5rem', marginTop: 3 }}>{sub}</div>
    </div>
  )
}

// ═══════════════════════════════════════════════
// SERVICE FORM OVERLAY — floats on right half when camera is in detail zone
// ═══════════════════════════════════════════════

function ServiceFormOverlay() {
  const { selectedTier, clearSelection } = useServiceSelection()
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [sent, setSent] = useState(false)

  const visible = !!selectedTier
  const tier = selectedTier
  const accentColor = tier?.featured ? '#FF6B00' : '#00E5FF'

  // Scroll lock
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [visible])

  const fi: React.CSSProperties = {
    width: '100%',
    background: 'rgba(10,10,15,0.6)',
    border: '1px solid rgba(37,37,64,0.7)',
    color: '#E0E0EC',
    padding: '10px 14px',
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: 10,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => { setSent(false); clearSelection(); setForm({ name: '', email: '', phone: '', company: '', message: '' }) }, 3000)
  }

  const handleBack = () => { clearSelection(); setSent(false) }

  return (
    <div style={{
      position: 'fixed',
      top: '12vh', right: '3vw',
      transform: `translateY(${visible ? '0' : '20px'})`,
      width: 'min(380px, 30vw)',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
      pointerEvents: visible ? 'auto' : 'none',
      zIndex: 20,
    }}>
      <HudPanel label={tier ? `${tier.tag} // GET_STARTED` : 'GET_STARTED'} variant={tier?.featured ? 'fire' : 'plasma'} glow>
        <div style={{ padding: '18px 20px' }}>

          {tier && (
            <>
              <div style={{ ...tag, color: accentColor, marginBottom: 6 }}>{'>'} INQUIRY_FORM</div>
              <p style={{ ...p, fontSize: '0.85rem', marginBottom: 14 }}>
                Tell us about your business and we'll tailor a {tier.name} package for you.
              </p>

              {sent ? (
                <div style={{ ...mono, color: '#00E5FF', padding: '30px 0', textAlign: 'center', fontSize: '0.75rem' }}>
                  {'>'} REQUEST_SENT //<br />we'll be in touch within 24 hours
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                  <input style={fi} placeholder="Name *" required value={form.name}
                    onFocus={e => (e.currentTarget.style.borderColor = accentColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(37,37,64,0.7)')}
                    onChange={e => setForm(s => ({ ...s, name: e.target.value }))} />
                  <input style={fi} type="email" placeholder="Email *" required value={form.email}
                    onFocus={e => (e.currentTarget.style.borderColor = accentColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(37,37,64,0.7)')}
                    onChange={e => setForm(s => ({ ...s, email: e.target.value }))} />
                  <input style={fi} type="tel" placeholder="Phone" value={form.phone}
                    onFocus={e => (e.currentTarget.style.borderColor = accentColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(37,37,64,0.7)')}
                    onChange={e => setForm(s => ({ ...s, phone: e.target.value }))} />
                  <input style={fi} placeholder="Company" value={form.company}
                    onFocus={e => (e.currentTarget.style.borderColor = accentColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(37,37,64,0.7)')}
                    onChange={e => setForm(s => ({ ...s, company: e.target.value }))} />
                  <textarea style={{ ...fi, minHeight: 70, resize: 'vertical' }}
                    placeholder="Tell us about your business..."
                    value={form.message}
                    onFocus={e => (e.currentTarget.style.borderColor = accentColor)}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(37,37,64,0.7)')}
                    onChange={e => setForm(s => ({ ...s, message: e.target.value }))} />
                  <button type="submit" style={{
                    ...ctaPrimary, marginTop: 6,
                    background: tier.featured ? 'linear-gradient(135deg, #FF6B00, #FFAA00)' : 'linear-gradient(135deg, #00E5FF, #0099CC)',
                    color: '#000', fontWeight: 700,
                  }}>
                    GET MY FREE PACKAGE →
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </HudPanel>
    </div>
  )
}

// ═══════════════════════════════════════════════
// MAIN OVERLAY
// ═══════════════════════════════════════════════

function BackToTiersButton() {
  const { selectedTier, clearSelection } = useServiceSelection()
  const visible = !!selectedTier

  return (
    <button
      onClick={() => clearSelection()}
      style={{
        position: 'fixed',
        top: '88px',
        left: '32px',
        zIndex: 25,
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: '0.78rem',
        letterSpacing: '0.14em',
        color: '#6A6A8A',
        background: 'rgba(10,10,15,0.7)',
        border: '1px solid rgba(37,37,64,0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: 'pointer',
        padding: '10px 20px',
        opacity: visible ? 1 : 0,
        transform: `translateX(${visible ? '0' : '-20px'})`,
        transition: 'opacity 0.4s ease 0.3s, transform 0.4s ease 0.3s, color 0.15s, border-color 0.15s',
        pointerEvents: visible ? 'auto' : 'none',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#E0E0EC'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#6A6A8A'; e.currentTarget.style.borderColor = 'rgba(37,37,64,0.5)' }}
    >
      ← BACK TO TIERS
    </button>
  )
}

export default function ContentOverlay({ progress }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <BackToTiersButton />
      <ServiceFormOverlay />
    </div>
  )
}
