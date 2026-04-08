import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { remap, smoothstep, lerp } from '../../utils/mathUtils'
import { generateEllipsoidPositions, kNearestNeighbors } from '../../utils/mathUtils'
import GridFloor from '../GridFloor'
import WireframePanel from '../WireframePanel'

interface Props { progress: number; nodeBase?: number }

const GLOW_VERT = /* glsl */`
attribute float aSize;
void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPos.z);
  gl_Position = projectionMatrix * mvPos;
}
`
const GLOW_FRAG = /* glsl */`
uniform float uAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float alpha = uAlpha * (1.0 - d * 1.8);
  gl_FragColor = vec4(1.0, 0.42, 0.0, max(alpha, 0.0));
}
`

export default function Scene8_Contact({ progress, nodeBase = 80 }: Props) {
  if (progress < 0.86 || progress > 1.0) return null

  const local = remap(progress, 0.88, 1.0)
  const convP = smoothstep(0, 1, local)
  const nodeCount = Math.round((nodeBase ?? 80) * 0.4)

  const { basePositions, linePositions, pairs, lineCount } = useMemo(() => {
    const basePositions = generateEllipsoidPositions(nodeCount, [3, 2, 2.5], [0, 1, 0], 8)
    const { pairs, linePositions } = kNearestNeighbors(basePositions, 4)
    const lineCount = linePositions.length / 6
    return { basePositions, linePositions, pairs, lineCount }
  }, [nodeCount])

  const linesRef = useRef<THREE.LineSegments>(null!)
  const nodesRef = useRef<THREE.Points>(null!)
  const glowRef = useRef<THREE.Points>(null!)
  const currentPositions = useMemo(() => new Float32Array(basePositions), [basePositions])
  const lineGeoPos = useMemo(() => {
    const buf = new Float32Array(lineCount * 6)
    buf.set(linePositions)
    return buf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linePositions.buffer])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(1, 0.42, 0),
    transparent: true, opacity: 0.07, depthWrite: false,
  }), [])

  const glowMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uAlpha: { value: 0 } },
  }), [])

  const glowPositions = useMemo(() => {
    const arr = new Float32Array(3)
    arr[0] = 0; arr[1] = 1; arr[2] = 0
    return arr
  }, [])
  const glowSizes = useMemo(() => new Float32Array([8]), [])

  useFrame(() => {
    // Lerp nodes toward center
    for (let i = 0; i < nodeCount; i++) {
      currentPositions[i * 3]     = lerp(basePositions[i * 3],     0, convP)
      currentPositions[i * 3 + 1] = lerp(basePositions[i * 3 + 1], 1, convP)
      currentPositions[i * 3 + 2] = lerp(basePositions[i * 3 + 2], 0, convP)
    }

    if (nodesRef.current) {
      nodesRef.current.geometry.attributes.position.array.set(currentPositions)
      nodesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (linesRef.current) {
      const linePos = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2], b = pairs[i * 2 + 1]
        linePos.setXYZ(i * 2,     currentPositions[a * 3], currentPositions[a * 3 + 1], currentPositions[a * 3 + 2])
        linePos.setXYZ(i * 2 + 1, currentPositions[b * 3], currentPositions[b * 3 + 1], currentPositions[b * 3 + 2])
      }
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }

    glowMat.uniforms.uAlpha.value = Math.pow(convP, 2) * 0.9
  })

  return (
    <group>
      <GridFloor y={-2.5} />
      <WireframePanel position={[-2.5, 1, -2]} size={[2, 2.5]} color="fire" opacity={0.2} phaseOffset={0} />
      <WireframePanel position={[2.5, 1, -2]} size={[2, 2.5]} color="fire" opacity={0.2} phaseOffset={1.5} />

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineGeoPos, 3]} count={lineCount * 2} />
        </bufferGeometry>
        <primitive object={lineMat} attach="material" />
      </lineSegments>

      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array(basePositions), 3]} count={nodeCount} />
        </bufferGeometry>
        <pointsMaterial size={0.01} color={new THREE.Color(1, 0.42, 0)} transparent opacity={0.9} depthWrite={false} sizeAttenuation />
      </points>

      {/* Central glow beacon */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[glowPositions, 3]} count={1} />
          <bufferAttribute attach="attributes-aSize" args={[glowSizes, 1]} count={1} />
        </bufferGeometry>
        <primitive object={glowMat} attach="material" />
      </points>
    </group>
  )
}
