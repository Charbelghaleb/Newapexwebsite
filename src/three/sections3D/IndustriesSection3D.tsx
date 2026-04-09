import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ring, arc, ticks, dashedRing, brackets, crosshair, toBuffer } from '../holoGeometry'

const Z = -150
const R = 4.0
const STATION_GAP = 18 // X distance between stations

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

const M = { fog: true, transparent: true, depthWrite: false } as const

// ═══════════════════════════════════════════════════════
// PLANET 1: Crystal Planet (Icosahedron wireframe)
// ═══════════════════════════════════════════════════════

function CrystalPlanet() {
  const ref = useRef<THREE.Group>(null!)
  const edges = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(R, 1)
    return new THREE.EdgesGeometry(ico)
  }, [])

  // Orbital details
  const orbitals = useMemo(() => toBuffer([
    ...ring(5.0, 0, 48),
    ...ticks(R + 0.5, 60, 0.12),
    ...brackets(R + 1.8, 0.4),
    ...crosshair(0.6, 0.08),
  ]), [])

  const accentArcs = useMemo(() => toBuffer([
    ...arc(R + 0.2, 0.5, 1.8),
    ...arc(R + 0.2, Math.PI + 0.2, Math.PI + 1.5),
  ]), [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004
      ref.current.rotation.x += 0.001
    }
  })

  return (
    <group position={[-STATION_GAP, 0, 0]}>
      <group ref={ref} rotation={[0.2, 0, 0.15]}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.14} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[orbitals, 3]} count={orbitals.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.06} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[accentArcs, 3]} count={accentArcs.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// PLANET 2: Classic Globe (existing)
// ═══════════════════════════════════════════════════════

function ClassicGlobe() {
  const ref = useRef<THREE.Group>(null!)

  const latitudes = useMemo(() => {
    const pts: number[] = []
    const count = 11
    for (let i = 0; i < count; i++) {
      const phi = (i / (count - 1)) * Math.PI
      const y = Math.cos(phi) * R
      const r = Math.sin(phi) * R
      if (r > 0.3) pts.push(...ring(r, y, 48))
    }
    return toBuffer(pts)
  }, [])

  const longitudes = useMemo(() => {
    const pts: number[] = []
    const count = 8
    const segs = 48
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI
      const st = Math.sin(theta), ct = Math.cos(theta)
      for (let j = 0; j < segs; j++) {
        const a1 = (j / segs) * Math.PI * 2
        const a2 = ((j + 1) / segs) * Math.PI * 2
        pts.push(
          Math.sin(a1) * R * st, Math.cos(a1) * R, Math.sin(a1) * R * ct,
          Math.sin(a2) * R * st, Math.cos(a2) * R, Math.sin(a2) * R * ct,
        )
      }
    }
    return toBuffer(pts)
  }, [])

  const orbital = useMemo(() => toBuffer([
    ...ring(5.2, 0, 64),
    ...dashedRing(5.5, 24, 0.5),
    ...ticks(5.2, 80, 0.08),
  ]), [])

  const detail = useMemo(() => toBuffer([
    ...ticks(R, 80, 0.14, 0, 8, 0.28),
    ...crosshair(0.8, 0.1),
    ...brackets(R + 1.5, 0.45),
    ...brackets(R + 2.5, 0.35),
    ...ring(1.2, R * 0.85, 24),
    ...ring(1.2, -R * 0.85, 24),
    ...dashedRing(0.8, 8, 0.5, R * 0.92),
    ...dashedRing(0.8, 8, 0.5, -R * 0.92),
  ]), [])

  const accents = useMemo(() => toBuffer([
    ...arc(R + 0.1, 0.3, 1.2),
    ...arc(R + 0.1, Math.PI + 0.3, Math.PI + 1.2),
    ...arc(R * 0.75, 0.5, 1.5, R * 0.66),
    ...arc(R * 0.75, Math.PI + 0.5, Math.PI + 1.5, -R * 0.66),
  ]), [])

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.005
  })

  return (
    <group position={[0, 0, 0]}>
      <group ref={ref} rotation={[0.15, 0, 0.1]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[latitudes, 3]} count={latitudes.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.14} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[longitudes, 3]} count={longitudes.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.06} depthWrite={false} />
        </lineSegments>
        <group rotation={[0.5, 0, 0.3]}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[orbital, 3]} count={orbital.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.08} depthWrite={false} />
          </lineSegments>
        </group>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[detail, 3]} count={detail.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.04} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.20} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// PLANET 3: Ringed Planet (faceted sphere + Saturn rings)
// ═══════════════════════════════════════════════════════

function RingedPlanet() {
  const ref = useRef<THREE.Group>(null!)
  const SR = 3.0 // smaller sphere

  const sphereEdges = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(SR, 2)
    return new THREE.EdgesGeometry(geo)
  }, [])

  const rings = useMemo(() => toBuffer([
    ...ring(5.0, 0, 72),
    ...ring(5.8, 0, 72),
    ...ring(6.4, 0, 72),
    ...dashedRing(5.4, 36, 0.4),
    ...ticks(5.0, 60, 0.10),
  ]), [])

  const accentRing = useMemo(() => toBuffer([
    ...ring(6.1, 0, 72),
    ...arc(5.0, 0.3, 2.0),
    ...arc(5.0, Math.PI, Math.PI + 1.5),
  ]), [])

  const details = useMemo(() => toBuffer([
    ...crosshair(0.5, 0.06),
    ...brackets(SR + 1.0, 0.3),
  ]), [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003
    }
  })

  return (
    <group position={[STATION_GAP, 0, 0]}>
      <group ref={ref} rotation={[0.1, 0, 0.05]}>
        {/* Sphere */}
        <lineSegments geometry={sphereEdges}>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.10} depthWrite={false} />
        </lineSegments>
        {/* Rings — tilted like Saturn */}
        <group rotation={[0.4, 0, 0.2]}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[rings, 3]} count={rings.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.12} depthWrite={false} />
          </lineSegments>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[accentRing, 3]} count={accentRing.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.15} depthWrite={false} />
          </lineSegments>
        </group>
        {/* Center details */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[details, 3]} count={details.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.05} depthWrite={false} />
        </lineSegments>
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// TEXT BLOCKS — always visible, one per station
// ═══════════════════════════════════════════════════════

const BUSINESSES = [
  ['Contractors', 'lose jobs on a ladder when the phone rings'],
  ['Barber Shops', 'solid Saturday, dead Tuesday'],
  ['Restaurants', 'one-time diners never come back'],
  ['Medical Offices', '$200 per no-show, 15 times a month'],
  ['Laundromats', 'empty machines from 2-5 PM every day'],
  ['Auto Shops', 'customers forget their 6-month reminder'],
  ['Fitness Studios', '40% of new members ghost after month one'],
  ['Retail Stores', 'Instagram dead since last year'],
  ['Content Creators', 'more time scheduling than creating'],
]

const FEATURES = [
  ['01', 'NEVER MISS A LEAD AGAIN', 'AI captures every inquiry 24/7'],
  ['02', 'SOCIAL MEDIA THAT POSTS', '20-30 branded posts per month, auto'],
  ['03', 'REVIEWS BUILD THEMSELVES', 'Auto requests after every job'],
  ['04', 'SCHEDULING RUNS ITSELF', 'Booked, reminded, no-shows down 60%'],
  ['05', 'AI SEARCH VISIBILITY', "Ask AI 'who is the best?' — you first"],
  ['06', 'FOLLOW-UP NEVER FORGETS', 'Automated sequences, nothing lost'],
]

function TextStation1() {
  return (
    <group position={[-STATION_GAP - 8, 1.0, 4]} rotation={[0, 0.35, 0]}>
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 3.2, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.6} letterSpacing={0.18}>
        {'> target_audience //'}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.50} position={[0, 2.5, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.92} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25}>
        WHO IS THIS FOR?
      </Text>
      <Text font={FONT_HEADING} fontSize={0.50} position={[0.04, 2.48, -0.15]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        {...M} material-opacity={0.06} letterSpacing={-0.03}>
        WHO IS THIS FOR?
      </Text>
      <Text font={FONT_BODY} fontSize={0.14} position={[0, 1.85, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        {...M} material-opacity={0.38} lineHeight={1.5} maxWidth={6}>
        {"If you own a local business and you're reading\nthis at 10 PM — this is for you."}
      </Text>
      <lineSegments position={[0, 1.35, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, 3.5,0,0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      {BUSINESSES.map(([name, pain], i) => (
        <Text key={name} font={FONT_BODY} fontSize={0.125}
          position={[0, 1.05 - i * 0.30, 0]}
          anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
          {...M} material-opacity={0.42} maxWidth={6.5}>
          {`▸ ${name} — ${pain}`}
        </Text>
      ))}
      <Text font={FONT_MONO} fontSize={0.12} position={[0, -1.8, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={1}
        {...M} material-opacity={0.50} letterSpacing={0.08}>
        {'Same problems. Same AI. Different industry.'}
      </Text>
    </group>
  )
}

function TextStation2() {
  return (
    <group position={[-8, 1.0, 4]} rotation={[0, 0.35, 0]}>
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 3.2, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.6} letterSpacing={0.18}>
        {'> who_we_serve //'}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.40} position={[0, 2.6, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.92} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25}>
        AI SYSTEMS BUILT FOR
      </Text>
      <Text font={FONT_HEADING} fontSize={0.40} position={[0, 2.05, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={2}
        {...M} material-opacity={0.85} letterSpacing={-0.03}>
        REAL BUSINESSES
      </Text>
      <Text font={FONT_HEADING} fontSize={0.40} position={[0.04, 2.58, -0.15]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        {...M} material-opacity={0.06} letterSpacing={-0.03}>
        AI SYSTEMS BUILT FOR
      </Text>
      <lineSegments position={[0, 1.65, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, 3.5,0,0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, 1.35, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.60} letterSpacing={0.05}>
        TIER 1: TRADES & CONSTRUCTION
      </Text>
      <Text font={FONT_BODY} fontSize={0.12} position={[0, 1.05, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        {...M} material-opacity={0.32} maxWidth={6} lineHeight={1.5}>
        {"Contractors · Painters · Electricians · Plumbers\nHVAC · Roofers · Landscaping · Pest Control"}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, 0.35, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={1}
        {...M} material-opacity={0.60} letterSpacing={0.05}>
        TIER 2: LOCAL SERVICE BUSINESSES
      </Text>
      <Text font={FONT_BODY} fontSize={0.12} position={[0, 0.05, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        {...M} material-opacity={0.32} maxWidth={6} lineHeight={1.5}>
        {"Barber Shops · Auto Repair · Laundromats\nRestaurants · Medical · Veterinary\nFitness Studios · Pet Grooming"}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.14} position={[0, -0.75, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={1}
        {...M} material-opacity={0.60} letterSpacing={0.05}>
        TIER 3: DIGITAL & HYBRID
      </Text>
      <Text font={FONT_BODY} fontSize={0.12} position={[0, -1.05, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        {...M} material-opacity={0.32} maxWidth={6} lineHeight={1.5}>
        {"E-Commerce · Content Creators\nSmall Online Operators"}
      </Text>
    </group>
  )
}

function TextStation3() {
  return (
    <group position={[STATION_GAP - 8, 1.0, 4]} rotation={[0, 0.35, 0]}>
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 3.2, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.6} letterSpacing={0.18}>
        {'> core_systems //'}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.48} position={[0, 2.55, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.92} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25}>
        WHAT EVERY
      </Text>
      <Text font={FONT_HEADING} fontSize={0.48} position={[0, 1.95, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={2}
        {...M} material-opacity={0.85} letterSpacing={-0.03}>
        BUSINESS GETS
      </Text>
      <Text font={FONT_HEADING} fontSize={0.48} position={[0.04, 2.53, -0.15]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        {...M} material-opacity={0.06} letterSpacing={-0.03}>
        WHAT EVERY
      </Text>
      <lineSegments position={[0, 1.55, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, 3.5,0,0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
      </lineSegments>
      {FEATURES.map(([num, title, desc], i) => {
        const y = 1.15 - i * 0.55
        return (
          <group key={num}>
            <Text font={FONT_MONO} fontSize={0.09} position={[0, y + 0.08, 0]}
              anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
              {...M} material-opacity={0.50} letterSpacing={0.15}>
              {`[${num}]`}
            </Text>
            <Text font={FONT_HEADING} fontSize={0.155} position={[0.45, y + 0.08, 0]}
              anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
              {...M} material-opacity={0.58}>
              {title}
            </Text>
            <Text font={FONT_BODY} fontSize={0.10} position={[0.45, y - 0.15, 0]}
              anchorX="left" anchorY="middle" color="#6A6A8A" renderOrder={1}
              {...M} material-opacity={0.28} maxWidth={5.5}>
              {desc}
            </Text>
          </group>
        )
      })}
      <lineSegments position={[0, -2.25, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, 3.5,0,0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_MONO} fontSize={0.10} position={[0, -2.5, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.45} letterSpacing={0.12}>
        {'> the_niche'}
      </Text>
      <Text font={FONT_HEADING} fontSize={0.16} position={[0, -2.8, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={1}
        {...M} material-opacity={0.55} letterSpacing={0.04}>
        LOCAL. SERVICE. OWNER-OPERATED.
      </Text>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT — 3 stations side by side
// ═══════════════════════════════════════════════════════

export default function IndustriesSection3D() {
  return (
    <group position={[0, 0, Z]}>
      {/* 3 Planets */}
      <CrystalPlanet />
      <ClassicGlobe />
      <RingedPlanet />

      {/* 3 Text blocks */}
      <TextStation1 />
      <TextStation2 />
      <TextStation3 />
    </group>
  )
}
