import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import NodeNetwork from '../NodeNetwork'
import WireframePanel from '../WireframePanel'

interface Props { progress: number }

// Isometric platform: thin wireframe rectangle lying flat
function IsoPlatform({
  x, y, z, w, d, color
}: { x: number; y: number; z: number; w: number; d: number; color: 'plasma' | 'fire' }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const VERT = /* glsl */`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
  const FRAG = /* glsl */`
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  float dx = min(vUv.x, 1.0 - vUv.x);
  float dy = min(vUv.y, 1.0 - vUv.y);
  if (min(dx, dy) > 0.015) discard;
  gl_FragColor = vec4(uColor, uOpacity);
}`

  const colorVec = color === 'plasma' ? new THREE.Color(0x00e5ff) : new THREE.Color(0xff6b00)

  return (
    <mesh position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, d, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{ uColor: { value: colorVec }, uOpacity: { value: 0.3 } }}
      />
    </mesh>
  )
}

// Vertical connector line from platform down to baseline
function VerticalConnector({ x, fromY, toY, z }: { x: number; fromY: number; toY: number; z: number }) {
  const points = useMemo(() => {
    const arr = new Float32Array(6)
    arr[0] = x; arr[1] = fromY; arr[2] = z
    arr[3] = x; arr[4] = toY; arr[5] = z
    return arr
  }, [x, fromY, toY, z])

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} count={2} />
      </bufferGeometry>
      <lineBasicMaterial color={0x00e5ff} transparent opacity={0.08} depthWrite={false} />
    </lineSegments>
  )
}

export default function Scene4_Services({ progress }: Props) {
  if (progress < 0.33 || progress > 0.52) return null

  return (
    <group>
      {/* Left cluster */}
      <IsoPlatform x={-3} y={-1} z={-2} w={3} d={2.5} color="plasma" />
      <VerticalConnector x={-3} fromY={-1} toY={-3} z={-2} />
      <NodeNetwork nodeCount={8} spread={[1.2, 0.6, 1]} center={[-3, -0.5, -2]} kNeighbors={3} lineOpacity={0.08} seed={41} animMode="static" />

      {/* Center cluster — featured, fire-orange */}
      <IsoPlatform x={0} y={0.5} z={-2} w={3.5} d={2.8} color="fire" />
      <VerticalConnector x={0} fromY={0.5} toY={-3} z={-2} />
      <NodeNetwork nodeCount={15} spread={[1.5, 0.8, 1.2]} center={[0, 1, -2]} kNeighbors={4} lineOpacity={0.09} lineTint={[1, 0.75, 0.3]} seed={42} animMode="static" />

      {/* Right cluster */}
      <IsoPlatform x={3} y={-0.3} z={-2} w={3} d={2.5} color="plasma" />
      <VerticalConnector x={3} fromY={-0.3} toY={-3} z={-2} />
      <NodeNetwork nodeCount={10} spread={[1.2, 0.7, 1]} center={[3, 0.2, -2]} kNeighbors={3} lineOpacity={0.08} seed={43} animMode="static" />
    </group>
  )
}
