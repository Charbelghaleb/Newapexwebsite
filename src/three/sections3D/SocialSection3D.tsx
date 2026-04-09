import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { ring, arc, ticks, dashedRing, crosshair, brackets, radials, toBuffer } from '../holoGeometry'
import { useScroll } from '../../context/ScrollContext'
import { smootherstep } from '../../utils/mathUtils'

const Z = -224

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

const M = { fog: true, transparent: true, depthWrite: false } as const

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════

const STEPS = [
  { num: '01', title: 'BRAND DNA EXTRACTION', desc: 'Scan your site, pull colors, voice, images. Complete brand profile in minutes — not weeks.' },
  { num: '02', title: 'CONTENT AT SCALE', desc: '20-30 branded posts monthly — graphics, captions, hashtags, calendar. All automated.' },
  { num: '03', title: 'AUTO POST & OPTIMIZE', desc: 'Posts go out while you work. We monitor & adjust. More of what works.' },
]

const BEFORE_ITEMS = [
  'X  Last post: 4 months ago',
  'X  Followers: 487 (stagnant)',
  'X  Social leads: 0-1/month',
  'X  Time: 0 hrs or 8+/week',
]

const AFTER_ITEMS = [
  '\u2713  Posts: 5-7 per week',
  '\u2713  Followers: +15-25%/mo',
  '\u2713  Social leads: 8-12/mo',
  '\u2713  Your time: 30 min',
]

const PACKAGES = [
  { name: 'Content Starter', price: '$500/mo', features: ['12 branded posts/mo', 'Custom graphics & captions', 'Posting calendar', 'Analytics report'], featured: false },
  { name: 'Content Pro', price: '$1,000/mo', features: ['20 branded posts/mo', 'Auto scheduling & posting', 'Stories/Reels concepts', 'Bi-weekly optimization', 'Hashtag strategy'], featured: true },
  { name: 'Content Domination', price: '$2,000/mo', features: ['30+ posts all platforms', 'Full video content', 'Engagement monitoring', 'Weekly strategy calls', 'Competitor monitoring'], featured: false },
]

const STATS = [
  { value: '67%', label: 'more leads from\nconsistent posting' },
  { value: '78%', label: 'check social\nbefore hiring' },
  { value: '6-8hrs', label: 'wasted weekly\non social' },
  { value: '30min', label: 'your time with\nour system' },
]

// ═══════════════════════════════════════════════════════
// HELPERS — wireframe rect + filled card (with reveal multiplier)
// ═══════════════════════════════════════════════════════

function WireRect({ x, y, z, w, h, color, opacity }: {
  x: number; y: number; z: number; w: number; h: number; color: string; opacity: number
}) {
  const verts = useMemo(() => new Float32Array([
    0, 0, 0, w, 0, 0,  w, 0, 0, w, -h, 0,
    w, -h, 0, 0, -h, 0,  0, -h, 0, 0, 0, 0,
  ]), [w, h])
  return (
    <lineSegments position={[x, y, z]} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[verts, 3]} count={8} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  )
}

function HudCard({ x, y, z, w, h, color, fillOpacity = 0.05, borderOpacity = 0.18 }: {
  x: number; y: number; z: number; w: number; h: number; color: string
  fillOpacity?: number; borderOpacity?: number
}) {
  const cornerSize = 0.08
  const corners = useMemo(() => new Float32Array([
    0, 0, 0, cornerSize, 0, 0,  0, 0, 0, 0, -cornerSize, 0,
    w, 0, 0, w - cornerSize, 0, 0,  w, 0, 0, w, -cornerSize, 0,
    0, -h, 0, cornerSize, -h, 0,  0, -h, 0, 0, -h + cornerSize, 0,
    w, -h, 0, w - cornerSize, -h, 0,  w, -h, 0, w, -h + cornerSize, 0,
  ]), [w, h, cornerSize])

  return (
    <group>
      <mesh position={[x + w / 2, y - h / 2, z - 0.02]} renderOrder={0}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color={color} transparent opacity={fillOpacity} depthWrite={false} />
      </mesh>
      <WireRect x={x} y={y} z={z} w={w} h={h} color={color} opacity={borderOpacity} />
      <lineSegments position={[x, y, z + 0.005]} renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[corners, 3]} count={16} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={borderOpacity * 1.8} depthWrite={false} />
      </lineSegments>
      <lineSegments position={[x + 0.15, y, z + 0.005]} renderOrder={3}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, w - 0.30, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={fillOpacity * 2} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// LEFT TEXT — headline + 3-step process
// ═══════════════════════════════════════════════════════

function LeftText({ t }: { t: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.position.x = -3.6 - 0.5 * (1 - t)
  })

  return (
    <group ref={groupRef} position={[-4.1, 1.5, Z + 4]} rotation={[0, 0.22, 0]}>

      {/* Tag with dash prefix */}
      <lineSegments position={[-0.35, 2.6, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 0.28, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.50 * t} depthWrite={false} />
      </lineSegments>
      <Text font={FONT_MONO} fontSize={0.12} position={[0, 2.6, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.6 * t} letterSpacing={0.18}>
        CONTENT_AUTOMATION
      </Text>

      {/* Headline */}
      <Text font={FONT_HEADING} fontSize={0.38} position={[0, 2.05, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.92 * t} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25 * t}>
        YOUR SOCIAL MEDIA
      </Text>
      <Text font={FONT_HEADING} fontSize={0.38} position={[0, 1.55, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.92 * t} letterSpacing={-0.03}
        outlineWidth={0.005} outlineColor="#00E5FF" outlineOpacity={0.25 * t}>
        ISN'T DEAD.
      </Text>
      <Text font={FONT_HEADING} fontSize={0.32} position={[0, 1.00, 0]}
        anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={2}
        {...M} material-opacity={0.88 * t} letterSpacing={-0.03}>
        IT'S JUST RUNNING
      </Text>
      <Text font={FONT_HEADING} fontSize={0.32} position={[0, 0.58, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={2}
        {...M} material-opacity={0.88 * t} letterSpacing={-0.03}
        outlineWidth={0.004} outlineColor="#FF6B00" outlineOpacity={0.25 * t}>
        ON MANUAL.
      </Text>

      {/* Ghost echoes */}
      <Text font={FONT_HEADING} fontSize={0.38} position={[0.04, 2.03, -0.15]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        {...M} material-opacity={0.06 * t} letterSpacing={-0.03}>
        YOUR SOCIAL MEDIA
      </Text>
      <Text font={FONT_HEADING} fontSize={0.38} position={[0.04, 1.53, -0.15]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={0}
        {...M} material-opacity={0.06 * t} letterSpacing={-0.03}>
        ISN'T DEAD.
      </Text>
      <Text font={FONT_HEADING} fontSize={0.32} position={[0.04, 0.56, -0.15]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={0}
        {...M} material-opacity={0.05 * t} letterSpacing={-0.03}>
        ON MANUAL.
      </Text>

      {/* Cyan divider with diamond */}
      <lineSegments position={[0, 0.22, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([
            0, 0, 0, 1.6, 0, 0,   1.8, 0, 0, 3.8, 0, 0,
            1.6, 0, 0, 1.7, 0.06, 0,  1.7, 0.06, 0, 1.8, 0, 0,
            1.8, 0, 0, 1.7, -0.06, 0,  1.7, -0.06, 0, 1.6, 0, 0,
          ]), 3]} count={12} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.35 * t} depthWrite={false} />
      </lineSegments>

      {/* Body */}
      <Text font={FONT_BODY} fontSize={0.12} position={[0, -0.05, 0]}
        anchorX="left" anchorY="top" color="#E0E0EC" renderOrder={1}
        {...M} material-opacity={0.35 * t} lineHeight={1.6} maxWidth={3.8}>
        {"You haven't posted in 3 months. Maybe 6. Your competitors who DO post consistently are getting the calls you're not."}
      </Text>

      {/* Orange divider */}
      <lineSegments position={[0, -0.55, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.8, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.22 * t} depthWrite={false} />
      </lineSegments>

      {/* HOW IT WORKS */}
      <Text font={FONT_MONO} fontSize={0.09} position={[0, -0.78, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.55 * t} letterSpacing={0.15}>
        {'> HOW_IT_WORKS //'}
      </Text>

      {/* 3-step process with number boxes */}
      {STEPS.map(({ num, title, desc }, i) => {
        const y = -1.10 - i * 0.72
        const numW = 0.30
        const numH = 0.24
        return (
          <group key={num}>
            <mesh position={[numW / 2, y + 0.06, -0.01]} renderOrder={0}>
              <planeGeometry args={[numW, numH]} />
              <meshBasicMaterial color="#FF6B00" transparent opacity={0.10 * t} depthWrite={false} />
            </mesh>
            <WireRect x={-numW / 2 + numW / 2} y={y + 0.06 + numH / 2} z={0} w={numW} h={numH} color="#FF6B00" opacity={0.35 * t} />
            <Text font={FONT_MONO} fontSize={0.10} position={[numW / 2, y + 0.06, 0.01]}
              anchorX="center" anchorY="middle" color="#FF6B00" renderOrder={3}
              {...M} material-opacity={0.80 * t} letterSpacing={0.08}>
              {num}
            </Text>

            <Text font={FONT_HEADING} fontSize={0.135} position={[0.48, y + 0.06, 0]}
              anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={1}
              {...M} material-opacity={0.65 * t}>
              {title}
            </Text>
            <Text font={FONT_BODY} fontSize={0.085} position={[0.48, y - 0.14, 0]}
              anchorX="left" anchorY="top" color="#6A6A8A" renderOrder={1}
              {...M} material-opacity={0.30 * t} maxWidth={3.3} lineHeight={1.4}>
              {desc}
            </Text>
            {i < 2 && (
              <lineSegments position={[1.8, y - 0.36, 0]} renderOrder={1}>
                <bufferGeometry>
                  <bufferAttribute attach="attributes-position"
                    args={[new Float32Array([
                      -0.3, 0, 0, 0.3, 0, 0,
                      0.3, 0, 0, 0.22, 0.05, 0,
                      0.3, 0, 0, 0.22, -0.05, 0,
                    ]), 3]} count={6} />
                </bufferGeometry>
                <lineBasicMaterial color="#00E5FF" transparent opacity={0.25 * t} depthWrite={false} />
              </lineSegments>
            )}
          </group>
        )
      })}

      {/* Bottom accent */}
      <lineSegments position={[0, -3.35, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 3.8, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#00E5FF" transparent opacity={0.10 * t} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// RIGHT TEXT — before/after, pricing, stats
// ═══════════════════════════════════════════════════════

function RightText({ t }: { t: number }) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.position.x = 3.6 + 0.5 * (1 - t)
  })

  return (
    <group ref={groupRef} position={[4.1, 1.5, Z + 4]} rotation={[0, -0.22, 0]}>

      {/* ── BEFORE / AFTER ── */}
      <Text font={FONT_MONO} fontSize={0.09} position={[0, 2.6, 0]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.55 * t} letterSpacing={0.15}>
        {'> RESULTS //'}
      </Text>

      {/* Before box */}
      <HudCard x={0} y={2.35} z={-0.02} w={2.35} h={1.30}
        color="#FF3333" fillOpacity={0.04 * t} borderOpacity={0.20 * t} />
      <Text font={FONT_MONO} fontSize={0.07} position={[0.10, 2.24, 0]}
        anchorX="left" anchorY="middle" color="#FF3333" renderOrder={3}
        {...M} material-opacity={0.65 * t} letterSpacing={0.10}>
        BEFORE APEX PROMETHEUS:
      </Text>
      {BEFORE_ITEMS.map((item, i) => (
        <Text key={`b-${i}`} font={FONT_BODY} fontSize={0.088} position={[0.12, 1.98 - i * 0.22, 0]}
          anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={3}
          {...M} material-opacity={0.45 * t} maxWidth={2.1}>
          {item}
        </Text>
      ))}

      {/* After box */}
      <HudCard x={2.55} y={2.35} z={-0.02} w={2.35} h={1.30}
        color="#00E5FF" fillOpacity={0.04 * t} borderOpacity={0.20 * t} />
      <Text font={FONT_MONO} fontSize={0.07} position={[2.65, 2.24, 0]}
        anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={3}
        {...M} material-opacity={0.65 * t} letterSpacing={0.10}>
        AFTER APEX PROMETHEUS:
      </Text>
      {AFTER_ITEMS.map((item, i) => (
        <Text key={`a-${i}`} font={FONT_BODY} fontSize={0.088} position={[2.67, 1.98 - i * 0.22, 0]}
          anchorX="left" anchorY="middle" color="#00E5FF" renderOrder={3}
          {...M} material-opacity={0.55 * t} maxWidth={2.1}>
          {item}
        </Text>
      ))}

      {/* Divider */}
      <lineSegments position={[0, 0.78, 0]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.9, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18 * t} depthWrite={false} />
      </lineSegments>

      {/* ── PRICING CARDS ── */}
      <Text font={FONT_MONO} fontSize={0.09} position={[0, 0.55, -0.05]}
        anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={1}
        {...M} material-opacity={0.55 * t} letterSpacing={0.15}>
        {'> PACKAGES //'}
      </Text>

      {PACKAGES.map((pkg, i) => {
        const px = i * 1.68
        const py = 0.28
        const pw = 1.55
        const ph = pkg.featured ? 1.95 : 1.70
        const accent = pkg.featured ? '#FF6B00' : '#00E5FF'

        return (
          <group key={pkg.name}>
            <HudCard x={px} y={py} z={-0.08} w={pw} h={ph}
              color={accent}
              fillOpacity={(pkg.featured ? 0.07 : 0.04) * t}
              borderOpacity={(pkg.featured ? 0.30 : 0.15) * t} />

            {/* Accent sidebar */}
            <lineSegments position={[px, py - 0.06, -0.06]} renderOrder={3}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, 0, -(ph - 0.12), 0]), 3]} count={2} />
              </bufferGeometry>
              <lineBasicMaterial color={accent} transparent opacity={(pkg.featured ? 0.40 : 0.14) * t} depthWrite={false} />
            </lineSegments>

            {/* MOST POPULAR badge */}
            {pkg.featured && (
              <>
                <mesh position={[px + pw / 2, py + 0.09, -0.05]} renderOrder={2}>
                  <planeGeometry args={[0.85, 0.13]} />
                  <meshBasicMaterial color="#FF6B00" transparent opacity={0.80 * t} depthWrite={false} />
                </mesh>
                <Text font={FONT_MONO} fontSize={0.055} position={[px + pw / 2, py + 0.09, -0.04]}
                  anchorX="center" anchorY="middle" color="#000000" renderOrder={4}
                  {...M} material-opacity={0.95 * t} letterSpacing={0.12}>
                  MOST POPULAR
                </Text>
              </>
            )}

            {/* Name */}
            <Text font={FONT_HEADING} fontSize={0.115} position={[px + 0.09, py - 0.16, -0.05]}
              anchorX="left" anchorY="middle" color="#E0E0EC" renderOrder={3}
              {...M} material-opacity={0.85 * t}
              {...(pkg.featured ? { outlineWidth: 0.003, outlineColor: '#FF6B00', outlineOpacity: 0.20 * t } : {})}>
              {pkg.name}
            </Text>

            {/* Price */}
            <Text font={FONT_HEADING} fontSize={0.19} position={[px + 0.09, py - 0.38, -0.05]}
              anchorX="left" anchorY="middle" color="#FF6B00" renderOrder={3}
              {...M} material-opacity={0.80 * t}
              outlineWidth={pkg.featured ? 0.003 : 0} outlineColor="#FF6B00" outlineOpacity={0.2 * t}>
              {pkg.price}
            </Text>

            {/* Separator */}
            <lineSegments position={[px + 0.09, py - 0.52, -0.05]} renderOrder={3}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, pw - 0.18, 0, 0]), 3]} count={2} />
              </bufferGeometry>
              <lineBasicMaterial color={accent} transparent opacity={0.12 * t} depthWrite={false} />
            </lineSegments>

            {/* Features */}
            {pkg.features.map((f, j) => (
              <Text key={j} font={FONT_BODY} fontSize={0.075} position={[px + 0.09, py - 0.66 - j * 0.18, -0.05]}
                anchorX="left" anchorY="middle" color="#6A6A8A" renderOrder={3}
                {...M} material-opacity={0.40 * t} maxWidth={1.35}>
                {`\u25B8 ${f}`}
              </Text>
            ))}
          </group>
        )
      })}

      {/* Divider */}
      <lineSegments position={[0, -1.95, -0.10]} renderOrder={1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.9, 0, 0]), 3]} count={2} />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.14 * t} depthWrite={false} />
      </lineSegments>

      {/* ── STAT BOXES ── */}
      {STATS.map(({ value, label }, i) => {
        const sx = i * 1.25
        const sy = -2.18
        const sw = 1.12
        const sh = 0.65

        return (
          <group key={value}>
            <HudCard x={sx} y={sy} z={-0.12} w={sw} h={sh}
              color="#00E5FF" fillOpacity={0.03 * t} borderOpacity={0.15 * t} />

            <Text font={FONT_HEADING} fontSize={0.21} position={[sx + sw / 2, sy - 0.20, -0.10]}
              anchorX="center" anchorY="middle" color="#FF6B00" renderOrder={3}
              {...M} material-opacity={0.78 * t}
              outlineWidth={0.002} outlineColor="#FF6B00" outlineOpacity={0.15 * t}>
              {value}
            </Text>
            <Text font={FONT_BODY} fontSize={0.06} position={[sx + sw / 2, sy - 0.46, -0.10]}
              anchorX="center" anchorY="middle" color="#6A6A8A" renderOrder={3}
              {...M} material-opacity={0.32 * t} lineHeight={1.3} textAlign="center" maxWidth={1.0}>
              {label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// ORBITAL HOLOGRAM — centered between text columns
// ═══════════════════════════════════════════════════════

const ORBITS: [number, number, number, number][] = [
  [4.8, 0,    0,    0.3],
  [4.0, 0.5,  0.2, -0.4],
  [3.3, -0.3, 0.6,  0.35],
  [2.6, 0.7, -0.3, -0.25],
]

function OrbitalHologram({ t }: { t: number }) {
  const groupRef = useRef<THREE.Group>(null!)
  const wrapRef = useRef<THREE.Group>(null!)
  const dotRefs = useRef<(THREE.Points | null)[]>([])
  const dotPositions = useMemo(
    () => ORBITS.map(([r]) => new Float32Array([r, 0, 0])),
    [],
  )

  const hub = useMemo(() => toBuffer([
    ...ring(1.4), ...ring(1.0), ...ring(0.6),
    ...dashedRing(1.2, 14, 0.5),
    ...dashedRing(0.8, 10, 0.5),
    ...crosshair(0.4, 0.06),
    ...radials(1.4, 12, 0.2),
    ...ticks(1.4, 36, 0.06),
  ]), [])

  const boundary = useMemo(() => toBuffer([
    ...ring(5.8, 0, 80),
    ...dashedRing(6.1, 30, 0.4),
    ...ticks(5.8, 100, 0.08, 0, 10, 0.18),
    ...brackets(6.6, 0.5),
    ...brackets(2.0, 0.25),
  ]), [])

  const orbitGeos = useMemo(
    () => ORBITS.map(([r]) => toBuffer(ring(r, 0, 64))),
    [],
  )

  const orbitDetail = useMemo(
    () => ORBITS.map(([r]) => toBuffer([
      ...dashedRing(r + 0.12, 18, 0.4),
      ...dashedRing(r - 0.12, 16, 0.35),
    ])),
    [],
  )

  const accents = useMemo(() => toBuffer([
    ...arc(5.6, 0.3, 1.1),
    ...arc(5.6, Math.PI + 0.3, Math.PI + 1.1),
    ...arc(1.3, 0.8, 1.8),
    ...arc(1.3, Math.PI + 0.8, Math.PI + 1.8),
  ]), [])

  useFrame(({ clock }) => {
    if (groupRef.current && t > 0.01) groupRef.current.rotation.y += 0.002
    if (wrapRef.current) {
      const s = 0.65 * t
      wrapRef.current.scale.set(s, s, s)
    }
    ORBITS.forEach(([r, , , speed], i) => {
      const a = clock.elapsedTime * speed
      dotPositions[i][0] = Math.cos(a) * r
      dotPositions[i][2] = Math.sin(a) * r
      const pts = dotRefs.current[i]
      if (pts) pts.geometry.attributes.position.needsUpdate = true
    })
  })

  return (
    <group ref={wrapRef} position={[0, 1.5, Z]} scale={0}>
      <group ref={groupRef}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[hub, 3]} count={hub.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.15 * t} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[boundary, 3]} count={boundary.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.05 * t} depthWrite={false} />
        </lineSegments>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.20 * t} depthWrite={false} />
        </lineSegments>
        {ORBITS.map(([, rx, rz], i) => (
          <group key={i} rotation={[rx, 0, rz]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[orbitGeos[i], 3]} count={orbitGeos[i].length / 3} />
              </bufferGeometry>
              <lineBasicMaterial color="#00E5FF" transparent opacity={0.12 * t} depthWrite={false} />
            </lineSegments>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[orbitDetail[i], 3]} count={orbitDetail[i].length / 3} />
              </bufferGeometry>
              <lineBasicMaterial color="#00E5FF" transparent opacity={0.03 * t} depthWrite={false} />
            </lineSegments>
            <points ref={el => { dotRefs.current[i] = el }}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[dotPositions[i], 3]} count={1} />
              </bufferGeometry>
              <pointsMaterial
                size={3} color={i % 2 === 0 ? '#00E5FF' : '#FF6B00'}
                transparent opacity={0.9 * t} depthWrite={false} sizeAttenuation={false}
              />
            </points>
          </group>
        ))}
      </group>
    </group>
  )
}

// ═══════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════

export default function SocialSection3D() {
  const { progress } = useScroll()
  const leftT = smootherstep(0.870, 0.890, progress)
  const rightT = smootherstep(0.885, 0.905, progress)
  const holoT = smootherstep(0.898, 0.918, progress)

  return (
    <>
      <LeftText t={leftT} />
      <OrbitalHologram t={holoT} />
      <RightText t={rightT} />
    </>
  )
}
