import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { arc, ticks, crosshair, dashedRing, brackets, toBuffer } from '../holoGeometry'

const Z = -39
const OBJ_X = -8.0

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

// ── Problem text — right side ──
function ProblemText() {
  const X = -1.5
  const baseY = 0.8

  return (
    <group position={[X, baseY, Z]} rotation={[0, -0.3, 0]}>

      {/* ── Tag line ── */}
      <Text
        font={FONT_MONO}
        fontSize={0.12}
        position={[0, 2.8, 0.4]}
        anchorX="left"
        anchorY="middle"
        color="#FF6B00"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.6}
        letterSpacing={0.18}
      >
        {'> PROBLEM_STATEMENT //'}
      </Text>

      {/* ── Headline — THE PROBLEM ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.50}
        position={[0, 2.1, 0.25]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.92}
        letterSpacing={-0.03}
        outlineWidth={0.005}
        outlineColor="#00E5FF"
        outlineOpacity={0.25}
      >
        THE PROBLEM
      </Text>
      {/* Ghost echo */}
      <Text
        font={FONT_HEADING}
        fontSize={0.50}
        position={[0.06, 2.08, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={0}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.06}
        letterSpacing={-0.03}
      >
        THE PROBLEM
      </Text>

      {/* ── Subhead ── */}
      <Text
        font={FONT_BODY}
        fontSize={0.14}
        position={[0, 1.5, 0.1]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.35}
        lineHeight={1.6}
        maxWidth={5}
      >
        {"AI isn't a luxury anymore — it's a necessity.\nBusinesses that don't adopt now will struggle to compete."}
      </Text>

      {/* ── Divider line ── */}
      <lineSegments position={[0, 1.05, 0.05]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.5, 0, 0]), 3]}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>

      {/* ── Card 1: Time Loss ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.13}
        position={[0, 0.7, -0.05]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {"⚡ You're Losing Time (and Money)"}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.10}
        position={[0, 0.4, -0.05]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={4.5}
        lineHeight={1.4}
      >
        {"Manual processes drain your team's productivity. While competitors automate, you're stuck in the old way."}
      </Text>

      {/* ── Card 2: Team Overwhelmed ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.13}
        position={[0, -0.0, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {"👥 Your Team is Overwhelmed"}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.10}
        position={[0, -0.3, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={4.5}
        lineHeight={1.4}
      >
        {"Without lean operations, you need more staff for the same workload. AI can do the heavy lifting."}
      </Text>

      {/* ── Card 3: Falling Behind ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.13}
        position={[0, -0.7, -0.25]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {"📉 You're Falling Behind"}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.10}
        position={[0, -1.0, -0.25]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={4.5}
        lineHeight={1.4}
      >
        {"The AI adoption gap is real. Large companies are already reaping the benefits. SMBs that wait will be at a serious disadvantage."}
      </Text>

      {/* ── Card 4: No Starting Point ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.13}
        position={[0, -1.4, -0.35]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {"🛡 You Don't Know Where to Start"}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.10}
        position={[0, -1.7, -0.35]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={4.5}
        lineHeight={1.4}
      >
        {"Too much hype, too many tools, too many consultants selling snake oil. You need someone who's actually done it."}
      </Text>

      {/* ── Reality Check Callout ── */}
      <lineSegments position={[0, -2.2, -0.45]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 0, -0.6, 0]), 3]}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.4} depthWrite={false} />
      </lineSegments>
      <Text
        font={FONT_MONO}
        fontSize={0.09}
        position={[0.15, -2.3, -0.45]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.45}
        letterSpacing={0.15}
      >
        {'> reality_check'}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.11}
        position={[0.15, -2.6, -0.45]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.30}
        maxWidth={4.5}
        lineHeight={1.5}
      >
        {'The question isn\'t "should we adopt AI?" — it\'s "how quickly can we get started?"'}
      </Text>

    </group>
  )
}

export default function ProblemSection3D() {
  const groupRef = useRef<THREE.Group>(null!)

  // C-rings — concentric circles each with one clean gap at staggered angles
  const primary = useMemo(() => {
    const gap = 0.7
    const pts: number[] = []
    const rings = [
      { r: 5.0, gapAngle: 0.4 },
      { r: 4.2, gapAngle: 2.8 },
      { r: 3.4, gapAngle: 5.2 },
      { r: 2.6, gapAngle: 1.6 },
      { r: 1.8, gapAngle: 4.0 },
    ]
    for (const { r, gapAngle } of rings) {
      pts.push(...arc(r, gapAngle + gap, gapAngle + Math.PI * 2 - 0.01, 0, 48))
    }
    return toBuffer(pts)
  }, [])

  // Orange highlight arcs sitting inside each gap
  const alerts = useMemo(() => toBuffer([
    ...arc(5.2, 0.1, 0.6, 0.15),
    ...arc(5.2, 0.1, 0.6, -0.15),
    ...arc(4.4, 2.5, 3.0, 0.1),
    ...arc(4.4, 2.5, 3.0, -0.1),
    ...arc(3.6, 4.9, 5.4, 0.1),
    ...arc(3.6, 4.9, 5.4, -0.1),
  ]), [])

  // Detail
  const detail = useMemo(() => toBuffer([
    ...ticks(5.0, 80, 0.10, 0, 8, 0.22),
    ...crosshair(1.0, 0.12),
    ...dashedRing(1.2, 10, 0.5),
    ...brackets(5.8, 0.45),
  ]), [])

  // Accent arcs
  const accents = useMemo(() => toBuffer([
    ...arc(4.8, 1.2, 1.8),
    ...arc(4.8, Math.PI + 1.2, Math.PI + 1.8),
    ...arc(3.0, 0.3, 0.9),
    ...arc(3.0, Math.PI + 0.3, Math.PI + 0.9),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y -= 0.003
  })

  return (
    <>
      {/* 3D Text — right side */}
      <ProblemText />

      {/* 3D Object — left side */}
      <group position={[OBJ_X, 0, Z]}>
        <group ref={groupRef} rotation={[-0.25, 0, -0.05]}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[primary, 3]} count={primary.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.16} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[alerts, 3]} count={alerts.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
          </lineSegments>

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
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.16} depthWrite={false} />
          </lineSegments>
        </group>
      </group>
    </>
  )
}
