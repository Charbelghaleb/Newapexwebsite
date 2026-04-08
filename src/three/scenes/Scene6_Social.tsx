import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { generateEllipsoidPositions, kNearestNeighbors } from '../../utils/mathUtils'

interface Props { progress: number; nodeBase?: number }

const PULSE_COUNT = 18
const PULSE_SPEED_BASE = 0.4

interface Pulse {
  lineIndex: number
  t: number
  speed: number
}

const PULSE_VERT = /* glsl */`
void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 2.5;
  gl_Position = projectionMatrix * mvPos;
}
`
const PULSE_FRAG = /* glsl */`
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.4) discard;
  gl_FragColor = vec4(0.0, 0.898, 1.0, 1.0);
}
`

export default function Scene6_Social({ progress, nodeBase = 80 }: Props) {
  if (progress < 0.63 || progress > 0.77) return null

  const nodeCount = Math.round(nodeBase * 1.2)

  const { positions, linePositions, pairs, lineCount } = useMemo(() => {
    const positions = generateEllipsoidPositions(nodeCount, [5, 3, 4], [0, 1, 0], 6)
    const { pairs, linePositions } = kNearestNeighbors(positions, 6)
    const lineCount = linePositions.length / 6
    return { positions, linePositions, pairs, lineCount }
  }, [nodeCount])

  const pulses = useRef<Pulse[]>([])
  const pulseGeoPos = useRef(new Float32Array(PULSE_COUNT * 3))
  const linesRef = useRef<THREE.LineSegments>(null!)
  const pulsesRef = useRef<THREE.Points>(null!)
  const lineOpacities = useRef(new Float32Array(lineCount).fill(0.065))

  // Init pulses
  useEffect(() => {
    pulses.current = Array.from({ length: PULSE_COUNT }, (_, i) => ({
      lineIndex: Math.floor((i / PULSE_COUNT) * lineCount),
      t: i / PULSE_COUNT,
      speed: PULSE_SPEED_BASE + Math.random() * 0.2,
    }))
  }, [lineCount])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.065,
    depthWrite: false,
  }), [])

  const pulseMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: PULSE_VERT,
    fragmentShader: PULSE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), [])

  const lineGeoPositions = useMemo(() => new Float32Array(linePositions), [linePositions])

  useFrame((_, delta) => {
    if (!linesRef.current || !pulsesRef.current) return

    const linePos = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    // Reset opacities
    lineOpacities.current.fill(0.065)

    for (let i = 0; i < pulses.current.length; i++) {
      const p = pulses.current[i]
      p.t += delta * p.speed
      if (p.t > 1) {
        p.t -= 1
        p.lineIndex = Math.floor(Math.random() * lineCount)
      }

      // Brighten the line the pulse is on
      lineOpacities.current[p.lineIndex] = 0.065 + 0.085 * Math.sin(p.t * Math.PI)

      // Compute pulse world position
      const li = p.lineIndex
      const ax = linePositions[li * 6]
      const ay = linePositions[li * 6 + 1]
      const az = linePositions[li * 6 + 2]
      const bx = linePositions[li * 6 + 3]
      const by = linePositions[li * 6 + 4]
      const bz = linePositions[li * 6 + 5]
      pulseGeoPos.current[i * 3]     = ax + (bx - ax) * p.t
      pulseGeoPos.current[i * 3 + 1] = ay + (by - ay) * p.t
      pulseGeoPos.current[i * 3 + 2] = az + (bz - az) * p.t
    }

    // Update line colors based on opacities (LineBasicMaterial can't vary per-segment, use global)
    lineMat.opacity = 0.065 + 0.02 * Math.sin(Date.now() * 0.001)

    const pulseGeo = pulsesRef.current.geometry
    pulseGeo.attributes.position.array.set(pulseGeoPos.current)
    pulseGeo.attributes.position.needsUpdate = true
  })

  return (
    <group>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineGeoPositions, 3]} count={lineCount * 2} />
        </bufferGeometry>
        <primitive object={lineMat} attach="material" />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(positions), 3]} count={nodeCount} />
        </bufferGeometry>
        <pointsMaterial size={0.012} color={0xffffff} transparent opacity={0.9} depthWrite={false} sizeAttenuation />
      </points>

      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulseGeoPos.current, 3]} count={PULSE_COUNT} />
        </bufferGeometry>
        <primitive object={pulseMat} attach="material" />
      </points>
    </group>
  )
}
