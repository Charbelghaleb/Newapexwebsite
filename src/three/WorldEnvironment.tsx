import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeRng } from '../utils/mathUtils'

// World-spanning diagonal grid — extremely subtle, barely there
// Serves as a ground reference, not a visual centerpiece
const GRID_VERT = /* glsl */`
  varying vec2 vWXZ;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWXZ = wp.xz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const GRID_FRAG = /* glsl */`
  varying vec2 vWXZ;
  void main() {
    float c = 0.7071;
    vec2 r = vec2(vWXZ.x * c - vWXZ.y * c, vWXZ.x * c + vWXZ.y * c);
    float cs = 2.5;
    vec2 cell = fract(r / cs);
    float lw = 0.018;
    float lX = 1.0 - smoothstep(0.0, lw, cell.x) + smoothstep(1.0 - lw, 1.0, cell.x);
    float lY = 1.0 - smoothstep(0.0, lw, cell.y) + smoothstep(1.0 - lw, 1.0, cell.y);
    float grid = max(lX, lY);
    float dX = abs(vWXZ.x) / 28.0;
    float dZ = abs(vWXZ.y + 68.0) / 78.0;
    float fade = 1.0 - smoothstep(0.25, 0.85, sqrt(dX * dX + dZ * dZ));
    // Very subtle — just enough to imply a ground plane
    gl_FragColor = vec4(0.0, 0.80, 1.0, grid * 0.022 * fade);
  }
`

function WorldGrid() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, side: THREE.DoubleSide,
    vertexShader: GRID_VERT, fragmentShader: GRID_FRAG,
  }), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.1, -68]}>
      <planeGeometry args={[90, 180, 1, 1]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}

// Sparse ambient particles — precise white pinpricks filling the world volume
const PART_VERT = /* glsl */`
  attribute float aPhase;
  attribute float aBright;
  uniform float uTime;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.32 + aPhase) * 0.06;
    p.x += cos(uTime * 0.25 + aPhase * 1.4) * 0.04;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = clamp(aBright * (240.0 / -mv.z), 0.4, 2.0);
    gl_Position = projectionMatrix * mv;
  }
`
const PART_FRAG = /* glsl */`
  void main() {
    if (length(gl_PointCoord - vec2(0.5)) > 0.12) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.35);
  }
`

interface Props { particleCount?: number }

export default function WorldEnvironment({ particleCount = 180 }: Props) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const { positions, phases, brightness } = useMemo(() => {
    const rng = makeRng(999)
    const positions  = new Float32Array(particleCount * 3)
    const phases     = new Float32Array(particleCount)
    const brightness = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (rng() * 2 - 1) * 24
      positions[i * 3 + 1] = (rng() * 2 - 1) * 11
      positions[i * 3 + 2] = rng() * -165 + 15
      phases[i]     = rng() * Math.PI * 2
      brightness[i] = 0.40 + rng() * 0.50
    }
    return { positions, phases, brightness }
  }, [particleCount])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group>
      {/* WorldGrid removed — was too RetroWave/synthwave */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={particleCount} />
          <bufferAttribute attach="attributes-aPhase"   args={[phases,    1]} count={particleCount} />
          <bufferAttribute attach="attributes-aBright"  args={[brightness,1]} count={particleCount} />
        </bufferGeometry>
        <shaderMaterial
          ref={matRef}
          vertexShader={PART_VERT} fragmentShader={PART_FRAG}
          transparent depthWrite={false} blending={THREE.AdditiveBlending}
          uniforms={{ uTime: { value: 0 } }}
        />
      </points>
    </group>
  )
}
