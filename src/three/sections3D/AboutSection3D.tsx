import { Suspense, useRef, useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FLAME_LOGO } from '../../context/ScrollContext'
import { ring, arc, ticks, dashedRing, crosshair, diagonalCross, brackets, radials, toBuffer } from '../holoGeometry'

const Z = -261

function FlamePlane() {
  const texture = useTexture(FLAME_LOGO)
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 2.4 + Math.sin(clock.elapsedTime * 0.6) * 0.06
  })
  return (
    <mesh ref={ref} position={[0, 2.4, 0]}>
      <planeGeometry args={[1.8, 1.8]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.05} depthWrite={false} />
    </mesh>
  )
}

export default function AboutSection3D() {
  const groupRef = useRef<THREE.Group>(null!)

  // Elaborate mandala — 6 concentric rings at precise spacings
  const primary = useMemo(() => toBuffer([
    ...ring(5.0),
    ...ring(4.2),
    ...ring(3.4),
    ...ring(2.4),
    ...ring(1.6),
    ...ring(0.8),
  ]), [])

  // Structural detail: radial spokes, dashed rings, crosshairs
  const secondary = useMemo(() => toBuffer([
    ...radials(5.0, 16, 0.3),
    ...dashedRing(4.6, 24, 0.55),
    ...dashedRing(3.8, 20, 0.55),
    ...dashedRing(2.9, 16, 0.55),
    ...dashedRing(2.0, 12, 0.55),
    ...dashedRing(1.2, 8, 0.55),
  ]), [])

  // Fine detail: ticks at multiple radii, crosshairs, brackets
  const detail = useMemo(() => toBuffer([
    ...ticks(5.0, 120, 0.10, 0, 10, 0.22),
    ...ticks(3.4, 80, 0.06, 0, 8, 0.14),
    ...ticks(1.6, 40, 0.05),
    ...crosshair(1.2, 0.08),
    ...diagonalCross(1.2, 0.08),
    ...brackets(5.6, 0.5),
    ...brackets(3.0, 0.3),
    ...brackets(1.0, 0.2),
  ]), [])

  // Orange accent arcs — symmetrical at three radii
  const accents = useMemo(() => toBuffer([
    ...arc(4.8, 0.3, 1.0),
    ...arc(4.8, Math.PI + 0.3, Math.PI + 1.0),
    ...arc(3.2, 1.2, 1.9),
    ...arc(3.2, Math.PI + 1.2, Math.PI + 1.9),
    ...arc(2.2, 0.6, 1.3),
    ...arc(2.2, Math.PI + 0.6, Math.PI + 1.3),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002
  })

  return (
    <group position={[0, 0, Z]}>
      <group ref={groupRef} rotation={[0.3, 0, 0]}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[primary, 3]} count={primary.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.16} depthWrite={false} />
        </lineSegments>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[secondary, 3]} count={secondary.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.06} depthWrite={false} />
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
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
        </lineSegments>
      </group>

      <Suspense fallback={null}>
        <FlamePlane />
      </Suspense>
    </group>
  )
}
