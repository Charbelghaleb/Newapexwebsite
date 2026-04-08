import type { CSSProperties } from 'react'
import { smoothstep } from '../../utils/mathUtils'
import DiamondDivider from '../DiamondDivider'

interface Props { progress: number }

const TIER1 = [
  { name: 'Contractors', desc: 'Stop losing jobs to the guy who answered first' },
  { name: 'Painters', desc: 'Same-day estimates that close' },
  { name: 'Electricians', desc: "Emergency calls routed while you're on a panel" },
  { name: 'Plumbers', desc: '24/7 lead capture for burst pipes at 2 AM' },
  { name: 'HVAC', desc: 'Seasonal demand automation' },
  { name: 'Roofers', desc: 'Storm response campaigns deploy automatically' },
  { name: 'Landscaping', desc: 'Route optimization + automated upsells' },
  { name: 'Pest Control', desc: 'Seasonal campaign automation + review generation' },
]

const TIER2 = [
  { name: 'Barber Shops', desc: 'Fill every chair, every hour' },
  { name: 'Auto Repair', desc: 'Service reminders that bring customers back' },
  { name: 'Laundromats', desc: 'Loyalty programs + off-peak promotions' },
  { name: 'Restaurants', desc: 'Turn one-time diners into regulars' },
  { name: 'Medical', desc: 'No-shows down 60%. Reviews up 300%.' },
  { name: 'Veterinary', desc: 'Wellness check campaigns' },
  { name: 'Fitness Studios', desc: 'Class booking, retention sequences' },
  { name: 'Pet Grooming', desc: 'Automated rebooking + photo content' },
]

const TIER3 = [
  { name: 'E-Commerce', desc: 'AI product descriptions, email sequences' },
  { name: 'Content Creators', desc: 'Automate posting and brand deals pipeline' },
  { name: 'Small Online Operators', desc: 'Inventory marketing, abandoned cart recovery' },
]

const FEATURES = [
  { icon: '📞', label: 'Never Miss a Lead Again' },
  { icon: '📱', label: 'Social Media That Actually Posts' },
  { icon: '⭐', label: 'Reviews That Build Themselves' },
  { icon: '📅', label: 'Scheduling That Runs Itself' },
  { icon: '🔍', label: 'AI Search Visibility' },
  { icon: '📧', label: "Follow-Up That Never Forgets" },
]

const cardStyle: CSSProperties = {
  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
  background: 'rgba(22,22,37,0.8)', border: '1px solid #252540',
  backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
  padding: '16px',
}

function IndustryGrid({ items }: { items: typeof TIER1 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ ...cardStyle, padding: '10px 14px' }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.72rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '3px' }}>{item.name}</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: '#6A6A8A', lineHeight: 1.4 }}>{item.desc}</div>
        </div>
      ))}
    </div>
  )
}

export default function IndustriesContent({ progress }: Props) {
  const opacity = smoothstep(0.52, 0.54, progress) * (1 - smoothstep(0.63, 0.65, progress))

  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
      opacity, padding: '80px clamp(16px, 5vw, 80px)',
      overflowY: 'auto',
    }}>
      <div style={{ maxWidth: '720px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <div className="section-label">who_we_serve</div>

        <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 800, color: '#E0E0EC', margin: 0, lineHeight: 1.2 }}>
          AI Systems Built by People Who Run Real Businesses
        </h2>

        <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', color: '#6A6A8A', lineHeight: 1.6 }}>
          We built our first AI system to save a painting company. Then the plumber next door asked how we did it. Then the electrician down the street. They all had the same problems.
        </p>

        {/* Tier 1 */}
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#FF6B00', marginBottom: '4px' }}>TIER 1: Trades &amp; Construction — Where We Proved It</div>
          <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.85rem', color: '#6A6A8A', marginBottom: '10px' }}>These are our people. We ARE a trades business. Every system was battle-tested here first.</div>
          <IndustryGrid items={TIER1} />
        </div>

        {/* Tier 2 */}
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#00E5FF', marginBottom: '4px' }}>TIER 2: Local Service Businesses — Same Pain, Same Fix</div>
          <IndustryGrid items={TIER2} />
        </div>

        {/* Tier 3 */}
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: '#00E5FF', marginBottom: '4px' }}>TIER 3: Digital &amp; Hybrid Businesses</div>
          <IndustryGrid items={TIER3} />
        </div>

        {/* What Every Business Gets */}
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '12px' }}>What Every Business Gets</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ ...cardStyle, padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.82rem', color: '#E0E0EC', lineHeight: 1.3 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom callout */}
        <div style={{
          ...cardStyle,
          borderLeft: '3px solid #00E5FF', borderColor: '#252540', borderLeftColor: '#00E5FF',
        }}>
          <div style={{ fontFamily: '"Share Tech Mono", monospace', fontSize: '0.6rem', color: '#00E5FF', letterSpacing: '0.15em', marginBottom: '8px' }}>{'>'} the_niche</div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#E0E0EC', marginBottom: '6px' }}>Local. Service. Owner-Operated.</div>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem', color: '#6A6A8A', margin: 0, lineHeight: 1.5 }}>
            The tech industry builds for online businesses. We build for brick-and-mortar service businesses.
          </p>
        </div>
      </div>
    </div>
  )
}
