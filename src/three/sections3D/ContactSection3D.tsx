import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ring, arc, ticks, dashedRing, crosshair, diagonalCross, brackets, radials, toBuffer } from '../holoGeometry'
import { useScroll } from '../../context/ScrollContext'
import { smoothstep } from '../../utils/mathUtils'

const Z = -298

export default function ContactSection3D() {
  const { progress } = useScroll()
  const groupRef = useRef<THREE.Group>(null!)
  const innerRef = useRef<THREE.Group>(null!)

  // Dense ring system — 7 concentric rings
  const primary = useMemo(() => toBuffer([
    ...ring(5.0),
    ...ring(4.2),
    ...ring(3.5),
    ...ring(2.8),
    ...ring(2.0),
    ...ring(1.3),
    ...ring(0.6),
  ]), [])

  // Structure: radials, dashed rings, crosshairs
  const secondary = useMemo(() => toBuffer([
    ...radials(5.0, 12, 0.3),
    ...dashedRing(4.6, 24, 0.55),
    ...dashedRing(3.85, 20, 0.55),
    ...dashedRing(3.15, 16, 0.55),
    ...dashedRing(2.4, 14, 0.55),
    ...dashedRing(1.65, 10, 0.55),
    ...ticks(5.0, 100, 0.10, 0, 10, 0.22),
    ...crosshair(1.0, 0.08),
    ...diagonalCross(1.0, 0.08),
    ...brackets(5.6, 0.45),
    ...brackets(3.2, 0.3),
  ]), [])

  // Orange + cyan accents (inverted scheme)
  const orangeAccents = useMemo(() => toBuffer([
    ...ring(4.8, 0, 64),
    ...ring(3.2, 0, 48),
    ...ring(1.8, 0, 32),
  ]), [])

  const cyanAccents = useMemo(() => toBuffer([
    ...arc(4.6, 0.3, 1.3),
    ...arc(4.6, Math.PI + 0.3, Math.PI + 1.3),
    ...arc(2.6, 1.5, 2.5),
    ...arc(2.6, Math.PI + 1.5, Math.PI + 2.5),
    ...arc(1.0, 0.5, 1.8),
    ...arc(1.0, Math.PI + 0.5, Math.PI + 1.8),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003
    // Converge rings toward center as user scrolls to end
    if (innerRef.current) {
      const local = smoothstep(0.90, 1.0, progress)
      const s = 1 - local * 0.85
      innerRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={[0, 0, Z]}>
      <group ref={groupRef} rotation={[0.3, 0, 0]}>
        <group ref={innerRef}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[primary, 3]} count={primary.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.14} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[secondary, 3]} count={secondary.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.05} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[orangeAccents, 3]} count={orangeAccents.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.08} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[cyanAccents, 3]} count={cyanAccents.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.18} depthWrite={false} />
          </lineSegments>
        </group>
      </group>
    </group>
  )
}
