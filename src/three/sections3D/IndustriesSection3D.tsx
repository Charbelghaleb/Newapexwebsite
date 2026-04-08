import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ring, arc, ticks, dashedRing, brackets, crosshair, toBuffer } from '../holoGeometry'

const Z = -150
const R = 4.0

export default function IndustriesSection3D() {
  const groupRef = useRef<THREE.Group>(null!)

  // Latitude rings (horizontal circles at different heights on sphere)
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

  // Longitude rings (great circles rotated around Y)
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

  // Orbital ring tilted at different angle from globe
  const orbital = useMemo(() => toBuffer([
    ...ring(5.2, 0, 64),
    ...dashedRing(5.5, 24, 0.5),
    ...ticks(5.2, 80, 0.08),
  ]), [])

  // Detail: equator ticks, crosshair, brackets, polar caps
  const detail = useMemo(() => toBuffer([
    ...ticks(R, 80, 0.14, 0, 8, 0.28),
    ...crosshair(0.8, 0.1),
    ...brackets(R + 1.5, 0.45),
    ...brackets(R + 2.5, 0.35),
    // Polar cap rings
    ...ring(1.2, R * 0.85, 24),
    ...ring(1.2, -R * 0.85, 24),
    ...dashedRing(0.8, 8, 0.5, R * 0.92),
    ...dashedRing(0.8, 8, 0.5, -R * 0.92),
  ]), [])

  // Orange accent arcs on equator + tropics
  const accents = useMemo(() => toBuffer([
    ...arc(R + 0.1, 0.3, 1.2),
    ...arc(R + 0.1, Math.PI + 0.3, Math.PI + 1.2),
    ...arc(R * 0.75, 0.5, 1.5, R * 0.66),
    ...arc(R * 0.75, Math.PI + 0.5, Math.PI + 1.5, -R * 0.66),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.005
  })

  return (
    <group position={[0, 0, Z]}>
      <group ref={groupRef} rotation={[0.15, 0, 0.1]}>
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

        {/* Orbital ring at different tilt */}
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
