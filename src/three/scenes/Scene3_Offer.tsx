import { remap } from '../../utils/mathUtils'
import NodeNetwork from '../NodeNetwork'
import WireframePanel from '../WireframePanel'
import * as THREE from 'three'
import { useMemo } from 'react'

interface Props { progress: number }

// Faint code texture: grid of tiny dots at z=-9
const CODE_FRAG = /* glsl */`
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.3) discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.03);
}
`
const CODE_VERT = /* glsl */`
void main() {
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = 1.5;
  gl_Position = projectionMatrix * mvPos;
}
`

function CodeTexture() {
  const { positions } = useMemo(() => {
    const cols = 24, rows = 14
    const positions = new Float32Array(cols * rows * 3)
    let idx = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[idx++] = (c - cols / 2) * 0.55
        positions[idx++] = (r - rows / 2) * 0.55 + 1
        positions[idx++] = -9
      }
    }
    return { positions }
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={CODE_VERT}
        fragmentShader={CODE_FRAG}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Scene3_Offer({ progress }: Props) {
  if (progress < 0.18 || progress > 0.37) return null

  return (
    <group>
      <CodeTexture />
      {/* Three wireframe rectangles stacked vertically */}
      <WireframePanel position={[0, 2.5, -3.5]} size={[5, 1.8]} color="plasma" opacity={0.20} phaseOffset={0} />
      <WireframePanel position={[0, 1.0, -2.5]} size={[5.5, 2.2]} color="fire" opacity={0.28} phaseOffset={1.2} />
      <WireframePanel position={[0, -0.6, -4.0]} size={[4.5, 1.6]} color="plasma" opacity={0.18} phaseOffset={2.5} />
      <NodeNetwork
        nodeCount={52}
        spread={[4, 2.5, 3]}
        center={[0, 1, 0]}
        kNeighbors={5}
        lineOpacity={0.065}
        lineTint={[1, 0.97, 0.9]}
        progress={1}
        animMode="static"
        seed={3}
        rotation={0.01}
      />
    </group>
  )
}
