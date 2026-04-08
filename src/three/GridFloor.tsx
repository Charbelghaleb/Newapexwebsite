import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const VERT = /* glsl */`
varying vec2 vUv;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = /* glsl */`
varying vec2 vUv;
varying vec3 vWorldPos;
uniform float uTime;
uniform float uDistortion;

float lineGrid(vec2 uv, float lineWidth) {
  vec2 grid = fract(uv);
  return step(grid.x, lineWidth) + step(1.0 - grid.x, lineWidth)
       + step(grid.y, lineWidth) + step(1.0 - grid.y, lineWidth);
}

void main() {
  // Scale UV to world-like coordinates
  vec2 scaledUv = vUv * 30.0;

  // Apply sinusoidal distortion (for Scene2)
  scaledUv.x += sin(scaledUv.y * 0.3 + uTime * 0.5) * uDistortion;

  // Rotate 45 degrees for diagonal crosshatch
  float s = sin(radians(45.0));
  float c = cos(radians(45.0));
  vec2 rotUv1 = vec2(scaledUv.x * c - scaledUv.y * s, scaledUv.x * s + scaledUv.y * c);
  vec2 rotUv2 = vec2(scaledUv.x * c + scaledUv.y * s, -scaledUv.x * s + scaledUv.y * c);

  float lineWidth = 0.025;
  float lines1 = lineGrid(rotUv1, lineWidth);
  float lines2 = lineGrid(rotUv2, lineWidth);
  float lineAlpha = min(lines1 + lines2, 1.0);

  // Intersection dots: both grids near a grid line
  float intersect = min(lines1, lines2);

  // Radial fade from center
  float dist = length(vWorldPos.xz);
  float fade = 1.0 - smoothstep(10.0, 25.0, dist);

  vec3 lineColor = vec3(0.0, 0.898, 1.0);
  float lineOpacity = lineAlpha * 0.02 * fade;
  float dotOpacity = intersect * 0.04 * fade;
  float totalOpacity = lineOpacity + dotOpacity;

  if (totalOpacity < 0.001) discard;
  gl_FragColor = vec4(lineColor, totalOpacity);
}
`

interface GridFloorProps {
  y?: number
  distortion?: number
}

export default function GridFloor({ y = -2.5, distortion = 0 }: GridFloorProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
      matRef.current.uniforms.uDistortion.value = distortion
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <planeGeometry args={[60, 60, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uDistortion: { value: 0 },
        }}
      />
    </mesh>
  )
}
