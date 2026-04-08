import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = /* glsl */`
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uEdgeWidth;

void main() {
  // Only draw near edges
  float dx = min(vUv.x, 1.0 - vUv.x);
  float dy = min(vUv.y, 1.0 - vUv.y);
  float edgeDist = min(dx, dy);

  if (edgeDist > uEdgeWidth) discard;

  // Fade corners slightly
  float alpha = smoothstep(uEdgeWidth, 0.0, edgeDist) * uOpacity;
  if (alpha < 0.001) discard;

  gl_FragColor = vec4(uColor, alpha);
}
`

interface WireframePanelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  size?: [number, number]
  color?: 'plasma' | 'fire'
  opacity?: number
  floatAmplitude?: number
  floatSpeed?: number
  phaseOffset?: number
}

const PLASMA_COLOR = new THREE.Color(0x00e5ff)
const FIRE_COLOR = new THREE.Color(0xff6b00)

export default function WireframePanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  size = [3, 2],
  color = 'plasma',
  opacity = 0.25,
  floatAmplitude = 0.05,
  floatSpeed = 0.5,
  phaseOffset = 0,
}: WireframePanelProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const baseY = position[1]
  const colorVec = color === 'plasma' ? PLASMA_COLOR : FIRE_COLOR

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = baseY + Math.sin(clock.elapsedTime * floatSpeed + phaseOffset) * floatAmplitude
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
    >
      <planeGeometry args={[size[0], size[1], 1, 1]} />
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{
          uColor: { value: colorVec },
          uOpacity: { value: opacity },
          uEdgeWidth: { value: 0.012 },
        }}
      />
    </mesh>
  )
}
