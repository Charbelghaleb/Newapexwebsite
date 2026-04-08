import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ring, arc, ticks, dashedRing, crosshair, brackets, radials, toBuffer } from '../holoGeometry'

const Z = -187
const ORBIT_COUNT = 4

const ORBITS: [number, number, number, number][] = [
  [4.8, 0,    0,    0.3],
  [4.0, 0.5,  0.2, -0.4],
  [3.3, -0.3, 0.6,  0.35],
  [2.6, 0.7, -0.3, -0.25],
]

export default function SocialSection3D() {
  const groupRef = useRef<THREE.Group>(null!)
  const dotRefs = useRef<(THREE.Points | null)[]>([])
  const dotPositions = useMemo(
    () => ORBITS.map(([r]) => new Float32Array([r, 0, 0])),
    [],
  )

  // Rich center hub
  const hub = useMemo(() => toBuffer([
    ...ring(1.4),
    ...ring(1.0),
    ...ring(0.6),
    ...dashedRing(1.2, 14, 0.5),
    ...dashedRing(0.8, 10, 0.5),
    ...crosshair(0.4, 0.06),
    ...radials(1.4, 12, 0.2),
    ...ticks(1.4, 36, 0.06),
  ]), [])

  // Outer boundary ring
  const boundary = useMemo(() => toBuffer([
    ...ring(5.8, 0, 80),
    ...dashedRing(6.1, 30, 0.4),
    ...ticks(5.8, 100, 0.08, 0, 10, 0.18),
    ...brackets(6.6, 0.5),
    ...brackets(2.0, 0.25),
  ]), [])

  // Orbit ring geometries
  const orbitGeos = useMemo(
    () => ORBITS.map(([r]) => toBuffer(ring(r, 0, 64))),
    [],
  )

  // Dashed orbit detail
  const orbitDetail = useMemo(
    () => ORBITS.map(([r]) => toBuffer([
      ...dashedRing(r + 0.12, 18, 0.4),
      ...dashedRing(r - 0.12, 16, 0.35),
    ])),
    [],
  )

  // Orange accent arcs
  const accents = useMemo(() => toBuffer([
    ...arc(5.6, 0.3, 1.1),
    ...arc(5.6, Math.PI + 0.3, Math.PI + 1.1),
    ...arc(1.3, 0.8, 1.8),
    ...arc(1.3, Math.PI + 0.8, Math.PI + 1.8),
  ]), [])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002

    ORBITS.forEach(([r, , , speed], i) => {
      const a = clock.elapsedTime * speed
      dotPositions[i][0] = Math.cos(a) * r
      dotPositions[i][2] = Math.sin(a) * r
      const pts = dotRefs.current[i]
      if (pts) pts.geometry.attributes.position.needsUpdate = true
    })
  })

  return (
    <group position={[0, 0, Z]}>
      <group ref={groupRef}>
        {/* Center hub */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[hub, 3]} count={hub.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.15} depthWrite={false} />
        </lineSegments>

        {/* Outer boundary */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[boundary, 3]} count={boundary.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.05} depthWrite={false} />
        </lineSegments>

        {/* Orange accents */}
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} />
          </bufferGeometry>
          <lineBasicMaterial color="#FF6B00" transparent opacity={0.20} depthWrite={false} />
        </lineSegments>

        {/* Orbit rings + dots */}
        {ORBITS.map(([, rx, rz], i) => (
          <group key={i} rotation={[rx, 0, rz]}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[orbitGeos[i], 3]} count={orbitGeos[i].length / 3} />
              </bufferGeometry>
              <lineBasicMaterial color="#00E5FF" transparent opacity={0.12} depthWrite={false} />
            </lineSegments>

            <lineSegments>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[orbitDetail[i], 3]} count={orbitDetail[i].length / 3} />
              </bufferGeometry>
              <lineBasicMaterial color="#00E5FF" transparent opacity={0.03} depthWrite={false} />
            </lineSegments>

            <points ref={el => { dotRefs.current[i] = el }}>
              <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[dotPositions[i], 3]} count={1} />
              </bufferGeometry>
              <pointsMaterial
                size={3} color={i % 2 === 0 ? '#00E5FF' : '#FF6B00'}
                transparent opacity={0.9} depthWrite={false} sizeAttenuation={false}
              />
            </points>
          </group>
        ))}
      </group>
    </group>
  )
}
