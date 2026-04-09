import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ring, arc, ticks, dashedRing, ribs, crosshair, brackets, radials, toBuffer } from '../holoGeometry'
import { useServiceSelection } from '../../context/ServiceSelectionContext'

const Z = -113
const OBJ_Y = 0

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

// ── Text ring — words along a circular path, proportional spacing ──
const CHAR_WIDTH = 0.75 // Orbitron avg char width ratio (wide geometric font + letterSpacing)

function TextRing({ y, r, phrase, size, color, op, maxRepeats, angleOffset = 0 }: {
  y: number; r: number; phrase: string[]
  size: number; color: string; op: number; maxRepeats?: number; angleOffset?: number
}) {
  const items = useMemo(() => {
    const gap = size * 0.8
    const wordWidths = phrase.map(w => w.length * size * CHAR_WIDTH)
    const phraseArc = wordWidths.reduce((sum, w) => sum + w + gap, 0)
    const circumference = 2 * Math.PI * r
    let repeats = Math.max(1, Math.floor(circumference / phraseArc))
    repeats = Math.min(repeats, maxRepeats ?? 16)
    const totalWordArc = wordWidths.reduce((s, w) => s + w, 0) * repeats
    const totalGapCount = phrase.length * repeats
    const remaining = circumference - totalWordArc
    const adjustedGap = remaining > 0 ? remaining / totalGapCount : gap

    const arr: { angle: number; word: string }[] = []
    let cur = angleOffset
    for (let rep = 0; rep < repeats; rep++) {
      for (let w = 0; w < phrase.length; w++) {
        const wordAng = wordWidths[w] / r
        const gapAng = adjustedGap / r
        arr.push({ angle: -(cur + wordAng / 2), word: phrase[w] })
        cur += wordAng + gapAng
      }
    }
    return arr
  }, [phrase, size, r, maxRepeats, angleOffset])

  return (
    <group>
      {items.map((item, i) => (
        <Text
          key={i}
          font={FONT_HEADING}
          fontSize={size}
          position={[Math.cos(item.angle) * r, y, Math.sin(item.angle) * r]}
          rotation={[0, -item.angle + Math.PI / 2, 0]}
          anchorX="center" anchorY="middle" color={color} renderOrder={10}
          material-fog={true} material-transparent={true} material-opacity={op}
          material-depthWrite={false} letterSpacing={0.06}
        >
          {item.word}
        </Text>
      ))}
    </group>
  )
}

// ── Clickable hit area for tier blocks ──
function TierHitArea({ position, width, height, tierId }: {
  position: [number, number, number]; width: number; height: number; tierId: string
}) {
  const { selectTier } = useServiceSelection()
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      onPointerDown={(e) => { e.stopPropagation(); selectTier(tierId) }}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = '' }}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent opacity={hovered ? 0.04 : 0} color="#00E5FF" depthWrite={false} />
    </mesh>
  )
}

// ══════════════════════════════════════════════════════════════
// ServicesText — right side, compressed vertical rhythm
//
// Group: [1.5, 0.8, -109]  rot [0, -0.15, 0]
// Pyramid: [-4.0, 0, -113]
// Camera: [-1, 0.5, -110]
// Visual gap = ~5.5 units — matches Offer's visual balance
// Y span: 2.80 to -4.38 = 7.18 units
// ══════════════════════════════════════════════════════════════
// ── Reusable tier block with accent sidebar, ghost echo, and bracket corners ──
function TierBlock({ y, z, tier, featured }: {
  y: number; z: number
  tier: { tag: string; label?: string; name: string; price: string; duration: string; roi: string; features: string[]; id: string }
  featured?: boolean
}) {
  const accent = featured ? '#FF6B00' : '#00E5FF'
  const accentDim = featured ? 'rgba(255,107,0,0.08)' : 'rgba(0,229,255,0.06)'
  const nameSize = featured ? 0.24 : 0.20
  const priceSize = featured ? 0.32 : 0.26
  const tagOp = featured ? 0.75 : 0.50
  const nameOp = featured ? 0.92 : 0.82

  // Vertical accent sidebar line
  const sidebarVerts = useMemo(() => new Float32Array([
    -0.12, 0.85, 0,  -0.12, -0.90, 0,
  ]), [])


  return (
    <group position={[0, y, z]}>
      {/* Accent sidebar */}
      <lineSegments renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sidebarVerts, 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={featured ? 0.35 : 0.18} depthWrite={false} />
      </lineSegments>

      {/* Tag */}
      <Text font={FONT_MONO} fontSize={0.085} position={[0, 0.72, 0]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={tagOp}
        material-depthWrite={false} letterSpacing={0.15}>
        {featured ? `★ ${tier.tag} · ${tier.label}` : tier.tag}
      </Text>

      {/* Tier name */}
      <Text font={FONT_HEADING} fontSize={nameSize} position={[0, 0.48, 0]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={2}
        material-fog={true} material-transparent={true} material-opacity={nameOp}
        material-depthWrite={false} letterSpacing={0.01}
        outlineWidth={0.004} outlineColor={accent} outlineOpacity={0.20}>
        {tier.name}
      </Text>
      {/* Ghost echo */}
      <Text font={FONT_HEADING} fontSize={nameSize} position={[0.04, 0.46, -0.12]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={0}
        material-fog={true} material-transparent={true} material-opacity={0.05}
        material-depthWrite={false} letterSpacing={0.01}>
        {tier.name}
      </Text>

      {/* Price */}
      <Text font={FONT_HEADING} fontSize={priceSize} position={[0, 0.18, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={featured ? 0.95 : 0.88}
        material-depthWrite={false}
        {...(featured ? { outlineWidth: 0.004, outlineColor: '#FF6B00', outlineOpacity: 0.20 } : {})}>
        {tier.price}
      </Text>

      {/* Duration + ROI */}
      <Text font={FONT_MONO} fontSize={0.075} position={[0, -0.05, 0]}
        anchorX="left" anchorY="middle" color="#6A6A8A" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.40}
        material-depthWrite={false}>
        {`${tier.duration}  ·  ROI: ${tier.roi}`}
      </Text>

      {/* Thin separator under meta */}
      <lineSegments position={[0, -0.16, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.0, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.08} depthWrite={false} />
      </lineSegments>

      {/* Features */}
      <Text font={FONT_BODY} fontSize={0.115} position={[0.15, -0.28, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.30}
        material-depthWrite={false} maxWidth={4.2} lineHeight={1.55}>
        {tier.features.map(f => `▸ ${f}`).join('\n')}
      </Text>

      {/* Hit area */}
      <TierHitArea position={[2.2, 0, 0.1]} width={5.0} height={2.0} tierId={tier.id} />
    </group>
  )
}

function ServicesText() {
  const textGroup = useRef<THREE.Group>(null!)

  return (
    <group ref={textGroup} position={[-5.0, 2.2, -109]} rotation={[0, 0.35, 0]}>

      {/* ── Tag ── */}
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 2.80, 0.4]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.6}
        material-depthWrite={false} letterSpacing={0.18}>
        {'> SERVICE_TIERS //'}
      </Text>

      {/* ── Headline ── */}
      <Text font={FONT_HEADING} fontSize={0.50} position={[0, 2.10, 0.25]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        material-fog={true} material-transparent={true} material-opacity={0.92}
        material-depthWrite={false} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25}>
        OUR SERVICES
      </Text>
      {/* Ghost echo */}
      <Text font={FONT_HEADING} fontSize={0.50} position={[0.06, 2.08, 0.10]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        material-fog={true} material-transparent={true} material-opacity={0.06}
        material-depthWrite={false} letterSpacing={-0.03}>
        OUR SERVICES
      </Text>

      {/* ── Subhead ── */}
      <Text font={FONT_BODY} fontSize={0.16} position={[0, 1.58, 0.1]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.32}
        material-depthWrite={false} lineHeight={1.6} maxWidth={5}>
        {'Three tiers designed to meet you\nwhere you are in your AI journey.'}
      </Text>

      {/* ── Orange divider ── */}
      <lineSegments position={[0, 1.15, 0.05]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {/* ═══ TIER BLOCKS ═══ */}

      <TierBlock y={0.15} z={0}
        tier={{ tag: 'TIER_01', name: 'AI Foundations', price: '$1.5K–$3K',
          duration: '2–4 weeks', roi: '2–3x', features: ['AI readiness assessment', 'Tool recommendations', 'Custom SOPs', 'Team training'], id: 'tier1' }}
      />

      <TierBlock y={-2.05} z={-0.05} featured
        tier={{ tag: 'TIER_02', label: 'MOST POPULAR', name: 'Workflow Automation', price: '$3K–$10K',
          duration: '4–8 weeks', roi: '3–5x', features: ['Workflow analysis & optimization', 'System integrations (CRM, PM, etc.)', 'Custom automation (3 processes)', 'AI-assisted operations'], id: 'tier2' }}
      />

      <TierBlock y={-4.25} z={-0.15}
        tier={{ tag: 'TIER_03', name: 'Agentic AI', price: '$10K–$30K+',
          duration: '8–16 weeks', roi: '5–10x', features: ['Process re-engineering', 'Custom AI agents', 'Autonomous workflows', 'Lean-office transformation'], id: 'tier3' }}
      />

      {/* ═══ RETAINER ═══ */}
      <lineSegments position={[0, -5.35, -0.25]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, -5.52, -0.25]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.55}
        material-depthWrite={false}>
        {'Ongoing Support & Advisory · $980/mo'}
      </Text>
    </group>
  )
}

// ══════════════════════════════════════════════════════════════
// ServiceDetailZone3D — 3D text content at X+14 (camera pans here)
// Shows selected tier info: name, price, features, description
// ══════════════════════════════════════════════════════════════
// ── Full pyramid copy with one tier glowing, used in each detail zone ──
function DetailPyramid({ position, highlightTier }: {
  position: [number, number, number]
  highlightTier: 'tier1' | 'tier2' | 'tier3'
}) {
  const ref = useRef<THREE.Group>(null!)

  // tier1=top(Y=2), tier2=mid(Y=0), tier3=bottom(Y=-2)
  const t1Op = highlightTier === 'tier3' ? 0.30 : 0.03
  const t2Op = highlightTier === 'tier2' ? 0.40 : 0.03
  const t3Op = highlightTier === 'tier1' ? 0.35 : 0.03

  const geoT1 = useMemo(() => toBuffer([
    ...ring(5.5, -2.0), ...ring(5.2, -2.0), ...ring(4.8, -2.0),
    ...ticks(5.5, 120, 0.10, -2.0, 10, 0.24),
    ...brackets(6.2, 0.5, -2.0),
    ...radials(5.5, 16, 0.4, -2.0),
    ...dashedRing(5.0, 28, 0.55, -2.0),
  ]), [])
  const geoT2 = useMemo(() => toBuffer([
    ...ring(3.8, 0), ...ring(3.5, 0),
    ...ticks(3.8, 80, 0.08, 0, 8, 0.18),
    ...brackets(4.4, 0.35, 0),
    ...dashedRing(3.65, 20, 0.55, 0),
    ...crosshair(0.6, 0.05, 0),
  ]), [])
  const geoT3 = useMemo(() => toBuffer([
    ...ring(2.2, 2.0), ...ring(1.9, 2.0), ...ring(0.8, 2.0),
    ...ticks(2.2, 48, 0.06, 2.0, 6, 0.14),
    ...brackets(2.8, 0.3, 2.0),
    ...dashedRing(2.05, 14, 0.55, 2.0),
    ...crosshair(1.2, 0.1, 2.0),
  ]), [])
  const geoSt = useMemo(() => toBuffer([
    ...ribs(5.3, -2.0, 3.6, 0, 12),
    ...ribs(3.6, 0, 2.0, 2.0, 8),
    0, -2.0, 0, 0, 2.0, 0,
  ]), [])
  const geoAc = useMemo(() => toBuffer([
    ...arc(5.3, 0.3, 1.0, -2.0), ...arc(5.3, Math.PI + 0.3, Math.PI + 1.0, -2.0),
    ...arc(3.6, 0.7, 1.4, 0), ...arc(3.6, Math.PI + 0.7, Math.PI + 1.4, 0),
    ...arc(2.1, 0.2, 0.9, 2.0), ...arc(2.1, Math.PI + 0.2, Math.PI + 0.9, 2.0),
  ]), [])

  useFrame(() => { if (ref.current) ref.current.rotation.y += 0.003 })

  return (
    <group position={position}>
      <group ref={ref} rotation={[0.3, 0, 0]}>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[geoT1, 3]} count={geoT1.length / 3} /></bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={t1Op} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[geoT2, 3]} count={geoT2.length / 3} /></bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={t2Op} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[geoT3, 3]} count={geoT3.length / 3} /></bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={t3Op} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[geoSt, 3]} count={geoSt.length / 3} /></bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.03} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[geoAc, 3]} count={geoAc.length / 3} /></bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.05} depthWrite={false} />
        </lineSegments>

        <TextRing y={-2.0} r={4.2} size={0.18} color="#00E5FF" op={t1Op}
          phrase={['TIER 3']} maxRepeats={16} angleOffset={0.10} />
        <TextRing y={0} r={2.8} size={0.12} color="#FF6B00" op={t2Op}
          phrase={['TIER 2']} />
        <TextRing y={2.0} r={1.2} size={0.09} color="#00E5FF" op={t3Op}
          phrase={['TIER 1']} />
      </group>
    </group>
  )
}

// ── Detail zone text — no rotation, properly sized ──
function ZoneText({ position, tier }: {
  position: [number, number, number]
  tier: { tag: string; name: string; price: string; duration: string; roi: string; desc: string; features: string[]; featured: boolean }
}) {
  const accent = tier.featured ? '#FF6B00' : '#00E5FF'

  return (
    <group position={position}>
      {/* Tag */}
      <Text font={FONT_MONO} fontSize={0.09} position={[0, 2.45, 0]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.6}
        material-depthWrite={false} letterSpacing={0.18}>
        {`> ${tier.tag} //`}
      </Text>

      {/* Tier name */}
      <Text font={FONT_HEADING} fontSize={0.32} position={[0, 2.05, 0]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.92}
        material-depthWrite={false} letterSpacing={-0.02}
        outlineWidth={0.004} outlineColor={accent} outlineOpacity={0.25}>
        {tier.name}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.32} position={[0.04, 2.03, -0.15]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={0}
        material-fog={true} material-transparent={true} material-opacity={0.06}
        material-depthWrite={false} letterSpacing={-0.02}>
        {tier.name}
      </Text>

      {/* Price */}
      <Text font={FONT_HEADING} fontSize={0.26} position={[0, 1.60, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.95}
        material-depthWrite={false}
        outlineWidth={0.003} outlineColor={accent} outlineOpacity={0.2}>
        {tier.price}
      </Text>

      {/* Duration + ROI */}
      <Text font={FONT_MONO} fontSize={0.075} position={[0, 1.28, 0]}
        anchorX="left" anchorY="middle" color="#6A6A8A" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.45}
        material-depthWrite={false}>
        {`${tier.duration} · ROI: ${tier.roi}`}
      </Text>

      {/* Divider */}
      <lineSegments position={[0, 1.10, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.0, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.22} depthWrite={false} />
      </lineSegments>

      {/* Description */}
      <Text font={FONT_BODY} fontSize={0.12} position={[0, 0.82, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.35}
        material-depthWrite={false} lineHeight={1.6} maxWidth={4}>
        {tier.desc}
      </Text>

      {/* Features label */}
      <Text font={FONT_MONO} fontSize={0.07} position={[0, 0.30, 0]}
        anchorX="left" anchorY="middle" color={accent} renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.5}
        material-depthWrite={false} letterSpacing={0.15}>
        {'> INCLUDES'}
      </Text>

      {/* Feature list */}
      <Text font={FONT_BODY} fontSize={0.11} position={[0, 0.16, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        material-fog={true} material-transparent={true} material-opacity={0.30}
        material-depthWrite={false} maxWidth={4} lineHeight={1.5}>
        {tier.features.map(f => `▸ ${f}`).join('\n')}
      </Text>
    </group>
  )
}

// ── Three detail zones — far right, each with full pyramid + text ──
// Zones at X=50, 90, 130 — far enough that they're never visible from services
function ServiceDetailZones() {
  const tier1Data = { tag: 'TIER_01', name: 'AI Foundations', price: '$1.5K–$3K', duration: '2–4 weeks', roi: '2–3x / Year 1', desc: 'Perfect for businesses new to AI. We introduce you to the basics and help you implement immediate wins.', features: ['AI readiness assessment', 'Tool recommendations', 'Custom SOPs', 'Team training'], featured: false }
  const tier2Data = { tag: 'TIER_02', name: 'Workflow Automation', price: '$3K–$10K', duration: '4–8 weeks', roi: '3–5x / Year 1', desc: 'Ready to scale? We automate your core workflows and integrate your systems for seamless operations.', features: ['Workflow analysis & optimization', 'System integrations (CRM, PM, etc.)', 'Custom automation (3 processes)', 'AI-assisted operations'], featured: true }
  const tier3Data = { tag: 'TIER_03', name: 'Agentic AI', price: '$10K–$30K+', duration: '8–16 weeks', roi: '5–10x / Year 1', desc: 'Full transformation. We design and deploy custom AI agents to create a truly lean, autonomous operation.', features: ['Business process re-engineering', 'Custom AI agent development', 'Autonomous workflows', 'Lean-office transformation'], featured: false }

  return (
    <>
      {/* Zone 1 — AI Foundations */}
      <DetailPyramid position={[40, 0, Z]} highlightTier="tier1" />
      <ZoneText position={[46, 0.5, Z + 4]} tier={tier1Data}  />

      {/* Zone 2 — Workflow Automation */}
      <DetailPyramid position={[80, 0, Z]} highlightTier="tier2" />
      <ZoneText position={[86, 0.5, Z + 4]} tier={tier2Data}  />

      {/* Zone 3 — Agentic AI */}
      <DetailPyramid position={[120, 0, Z]} highlightTier="tier3" />
      <ZoneText position={[126, 0.5, Z + 4]} tier={tier3Data}  />
    </>
  )
}

export default function ServicesSection3D() {
  const groupRef = useRef<THREE.Group>(null!)
  const { selectedTier } = useServiceSelection()
  const sel = selectedTier?.id || null
  // Mapping: tier1=top ring (Y=2), tier2=middle (Y=0), tier3=bottom (Y=-2)
  // Opacity: selected ring = bright, others = very dim
  const t1Op = sel === null ? 0.14 : sel === 'tier3' ? 0.30 : 0.02  // bottom ring = Agentic AI
  const t2Op = sel === null ? 0.20 : sel === 'tier2' ? 0.40 : 0.02  // middle ring = Workflow
  const t3Op = sel === null ? 0.16 : sel === 'tier1' ? 0.35 : 0.02  // top ring = AI Foundations
  const stOp = sel === null ? 0.05 : 0.02
  const acOp = sel === null ? 0.18 : 0.04
  const tr1Op = sel === null ? 0.15 : sel === 'tier3' ? 0.30 : 0.02
  const tr2Op = sel === null ? 0.20 : sel === 'tier2' ? 0.35 : 0.02
  const tr3Op = sel === null ? 0.15 : sel === 'tier1' ? 0.30 : 0.02

  const tier1 = useMemo(() => toBuffer([
    ...ring(5.5, -2.0), ...ring(5.2, -2.0), ...ring(4.8, -2.0),
    ...ticks(5.5, 120, 0.10, -2.0, 10, 0.24),
    ...brackets(6.2, 0.5, -2.0),
    ...radials(5.5, 16, 0.4, -2.0),
    ...dashedRing(5.0, 28, 0.55, -2.0),
  ]), [])

  const tier2 = useMemo(() => toBuffer([
    ...ring(3.8, 0), ...ring(3.5, 0),
    ...ticks(3.8, 80, 0.08, 0, 8, 0.18),
    ...brackets(4.4, 0.35, 0),
    ...dashedRing(3.65, 20, 0.55, 0),
    ...crosshair(0.6, 0.05, 0),
  ]), [])

  const tier3 = useMemo(() => toBuffer([
    ...ring(2.2, 2.0), ...ring(1.9, 2.0), ...ring(0.8, 2.0),
    ...ticks(2.2, 48, 0.06, 2.0, 6, 0.14),
    ...brackets(2.8, 0.3, 2.0),
    ...dashedRing(2.05, 14, 0.55, 2.0),
    ...crosshair(1.2, 0.1, 2.0),
  ]), [])

  const structure = useMemo(() => toBuffer([
    ...ribs(5.3, -2.0, 3.6, 0, 12),
    ...ribs(3.6, 0, 2.0, 2.0, 8),
    0, -2.0, 0, 0, 2.0, 0,
  ]), [])

  const accents = useMemo(() => toBuffer([
    ...arc(5.3, 0.3, 1.0, -2.0), ...arc(5.3, Math.PI + 0.3, Math.PI + 1.0, -2.0),
    ...arc(3.6, 0.7, 1.4, 0), ...arc(3.6, Math.PI + 0.7, Math.PI + 1.4, 0),
    ...arc(2.1, 0.2, 0.9, 2.0), ...arc(2.1, Math.PI + 0.2, Math.PI + 0.9, 2.0),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003
  })

  return (
    <>
      <ServicesText />
      <ServiceDetailZones />

      <group position={[3.5, 0.8, Z]}>
        <group ref={groupRef} rotation={[0.3, 0, 0]}>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier1, 3]} count={tier1.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={t1Op} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier2, 3]} count={tier2.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={t2Op} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier3, 3]} count={tier3.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={t3Op} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[structure, 3]} count={structure.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={stOp} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={acOp} depthWrite={false} />
          </lineSegments>

          <TextRing y={-2.0} r={4.2} size={0.18} color="#00E5FF" op={tr1Op}
            phrase={['TIER 3']} maxRepeats={16} angleOffset={0.10} />
          <TextRing y={0} r={2.8} size={0.12} color="#FF6B00" op={tr2Op}
            phrase={['TIER 2']} />
          <TextRing y={2.0} r={1.2} size={0.09} color="#00E5FF" op={tr3Op}
            phrase={['TIER 1']} />
        </group>
      </group>
    </>
  )
}
