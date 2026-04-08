import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ring, arc, ticks, dashedRing, ribs, crosshair, brackets, radials, toBuffer } from '../holoGeometry'

const Z = -113
const OBJ_Y = 0

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

// ── Title — centered above pyramid top ──
function ServicesTitle() {
  return (
    <group position={[0, 4.2, Z]}>
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 1.2, 0]} anchorX="center" anchorY="middle"
        color="#FF6B00" renderOrder={1} material-fog material-transparent material-opacity={0.6} letterSpacing={0.18}>
        {'> SERVICE_TIERS //'}
      </Text>

      <Text font={FONT_HEADING} fontSize={0.50} position={[0, 0.6, 0]} anchorX="center" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.92}
        letterSpacing={-0.03} outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25}>
        SERVICES
      </Text>
      <Text font={FONT_HEADING} fontSize={0.50} position={[0.04, 0.58, -0.15]} anchorX="center" anchorY="middle"
        color="#00E5FF" renderOrder={0} material-fog material-transparent material-opacity={0.06} letterSpacing={-0.03}>
        SERVICES
      </Text>

      <Text font={FONT_BODY} fontSize={0.14} position={[0, -0.05, 0]} anchorX="center" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.35}
        lineHeight={1.6} textAlign="center" maxWidth={6}>
        {'Three tiers designed to meet you where you are in your AI journey.'}
      </Text>

      <lineSegments position={[-2.25, -0.45, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ── Left panel: Tier 1 + Tier 3 stacked ──
function LeftTiers() {
  return (
    <group position={[-7.5, 1.0, Z]} rotation={[0, 0.3, 0]}>

      {/* ── TIER 01 ── */}
      <Text font={FONT_MONO} fontSize={0.07} position={[0, 2.2, 0]} anchorX="left" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.4} letterSpacing={0.15}>
        TIER_01
      </Text>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, 1.95, 0]} anchorX="left" anchorY="middle"
        color="#00E5FF" renderOrder={1} material-fog material-transparent material-opacity={0.7} letterSpacing={0.01}>
        AI Foundations
      </Text>
      <Text font={FONT_HEADING} fontSize={0.20} position={[0, 1.62, 0]} anchorX="left" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.8}>
        $1.5K–$3K
      </Text>
      <Text font={FONT_MONO} fontSize={0.065} position={[0, 1.40, 0]} anchorX="left" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.3}>
        2–4 weeks · ROI: 2–3x
      </Text>
      <lineSegments position={[0, 1.25, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.0, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.10} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_BODY} fontSize={0.10} position={[0, 1.05, 0]} anchorX="left" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.25}
        maxWidth={3.5} lineHeight={1.5}>
        {'▸ AI readiness assessment\n▸ Tool recommendations\n▸ Custom SOPs\n▸ Team training'}
      </Text>

      {/* ── Separator ── */}
      <lineSegments position={[0, 0.15, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#252540" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>

      {/* ── TIER 03 ── */}
      <Text font={FONT_MONO} fontSize={0.07} position={[0, -0.15, 0]} anchorX="left" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.4} letterSpacing={0.15}>
        TIER_03
      </Text>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, -0.40, 0]} anchorX="left" anchorY="middle"
        color="#00E5FF" renderOrder={1} material-fog material-transparent material-opacity={0.7} letterSpacing={0.01}>
        Agentic AI
      </Text>
      <Text font={FONT_HEADING} fontSize={0.20} position={[0, -0.73, 0]} anchorX="left" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.8}>
        $10K–$30K+
      </Text>
      <Text font={FONT_MONO} fontSize={0.065} position={[0, -0.95, 0]} anchorX="left" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.3}>
        8–16 weeks · ROI: 5–10x
      </Text>
      <lineSegments position={[0, -1.10, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.0, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.10} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_BODY} fontSize={0.10} position={[0, -1.30, 0]} anchorX="left" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.25}
        maxWidth={3.5} lineHeight={1.5}>
        {'▸ Process re-engineering\n▸ Custom AI agents\n▸ Autonomous workflows\n▸ Lean-office transformation'}
      </Text>

      {/* ── Retainer at bottom ── */}
      <lineSegments position={[0, -2.20, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_MONO} fontSize={0.07} position={[0, -2.40, 0]} anchorX="left" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.3} letterSpacing={0.1}>
        [ ongoing_support ]
      </Text>
      <Text font={FONT_BODY} fontSize={0.10} position={[0, -2.60, 0]} anchorX="left" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.35}>
        Ongoing Support & Advisory
      </Text>
      <Text font={FONT_HEADING} fontSize={0.16} position={[0, -2.85, 0]} anchorX="left" anchorY="middle"
        color="#FF6B00" renderOrder={1} material-fog material-transparent material-opacity={0.6}>
        $980/month
      </Text>
    </group>
  )
}

// ── Right panel: Tier 2 (featured) ──
function RightTier() {
  return (
    <group position={[7.5, 1.0, Z]} rotation={[0, -0.3, 0]}>

      <Text font={FONT_MONO} fontSize={0.08} position={[0, 2.2, 0]} anchorX="right" anchorY="middle"
        color="#FF6B00" renderOrder={1} material-fog material-transparent material-opacity={0.6} letterSpacing={0.15}>
        ★ TIER_02 · MOST POPULAR
      </Text>
      <Text font={FONT_HEADING} fontSize={0.18} position={[0, 1.90, 0]} anchorX="right" anchorY="middle"
        color="#FF6B00" renderOrder={1} material-fog material-transparent material-opacity={0.85} letterSpacing={0.01}>
        Workflow Automation
      </Text>
      <Text font={FONT_HEADING} fontSize={0.28} position={[0, 1.48, 0]} anchorX="right" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.92}
        outlineWidth={0.004} outlineColor="#FF6B00" outlineOpacity={0.2}>
        $3K–$10K
      </Text>
      <Text font={FONT_MONO} fontSize={0.07} position={[0, 1.20, 0]} anchorX="right" anchorY="middle"
        color="#6A6A8A" renderOrder={1} material-fog material-transparent material-opacity={0.35}>
        4–8 weeks · ROI: 3–5x
      </Text>

      <lineSegments position={[-3.5, 1.05, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.5, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.15} depthWrite={false} />
      </lineSegments>

      <Text font={FONT_BODY} fontSize={0.11} position={[0, 0.80, 0]} anchorX="right" anchorY="middle"
        color="#E0E0EC" renderOrder={1} material-fog material-transparent material-opacity={0.28}
        maxWidth={3.5} lineHeight={1.5} textAlign="right">
        {'▸ Workflow analysis & optimization\n▸ System integrations (CRM, PM, etc.)\n▸ Custom automation (3 processes)\n▸ AI-assisted operations'}
      </Text>

      {/* Featured border */}
      <lineSegments position={[-3.6, 2.35, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([
              0, 0, 0, 3.7, 0, 0,
              3.7, 0, 0, 3.7, -2.2, 0,
              3.7, -2.2, 0, 0, -2.2, 0,
              0, -2.2, 0, 0, 0, 0,
            ]), 3]} count={8} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

export default function ServicesSection3D() {
  const groupRef = useRef<THREE.Group>(null!)

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
      <ServicesTitle />
      <LeftTiers />
      <RightTier />

      <group position={[0, OBJ_Y, Z]}>
        <group ref={groupRef} rotation={[0.3, 0, 0]}>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier1, 3]} count={tier1.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.14} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier2, 3]} count={tier2.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.20} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[tier3, 3]} count={tier3.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.16} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[structure, 3]} count={structure.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.05} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry><bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} /></bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
          </lineSegments>
        </group>
      </group>
    </>
  )
}
