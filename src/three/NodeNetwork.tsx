import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { generateEllipsoidPositions, kNearestNeighbors, lerp, smoothstep } from '../utils/mathUtils'

const NODE_VERT = /* glsl */`
uniform float uTime;
uniform float uScale;
attribute float aPhase;
void main() {
  // Gentle float
  vec3 pos = position;
  pos.y += sin(uTime * 0.8 + aPhase) * 0.04;
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uScale * (280.0 / -mvPosition.z);
  gl_PointSize = min(gl_PointSize, 2.0);
  gl_Position = projectionMatrix * mvPosition;
}
`

const NODE_FRAG = /* glsl */`
uniform vec3 uColor;
uniform float uAlpha;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.12) discard;
  gl_FragColor = vec4(uColor, uAlpha);
}
`

export type AnimMode = 'static' | 'draw-in' | 'fragment' | 'converge' | 'pulse-bright'

interface NodeNetworkProps {
  nodeCount: number
  spread: [number, number, number]
  center?: [number, number, number]
  kNeighbors?: number
  lineOpacity?: number
  lineTint?: [number, number, number]
  nodeColor?: [number, number, number]
  progress?: number
  animMode?: AnimMode
  seed?: number
  rotation?: number
  nodeScale?: number
  lineBrightness?: number[]
}

export default function NodeNetwork({
  nodeCount,
  spread,
  center = [0, 0, 0],
  kNeighbors = 4,
  lineOpacity = 0.07,
  lineTint = [1, 1, 1],
  nodeColor = [1, 1, 1],
  progress = 1,
  animMode = 'static',
  seed = 42,
  rotation = 0,
  nodeScale = 1.0,
  lineBrightness,
}: NodeNetworkProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)
  const pointsRef = useRef<THREE.Points>(null!)

  const { basePositions, phases, linePositions, pairs } = useMemo(() => {
    const basePositions = generateEllipsoidPositions(nodeCount, spread, center, seed)
    const phases = new Float32Array(nodeCount)
    for (let i = 0; i < nodeCount; i++) {
      phases[i] = (Math.sin(i * 1.618) * 0.5 + 0.5) * Math.PI * 2
    }
    const { pairs, linePositions } = kNearestNeighbors(basePositions, kNeighbors)
    return { basePositions, phases, linePositions, pairs }
  }, [nodeCount, spread[0], spread[1], spread[2], center[0], center[1], center[2], kNeighbors, seed])

  const lineCount = linePositions.length / 6

  // Mutable position buffers
  const currentPositions = useMemo(() => new Float32Array(basePositions), [basePositions])
  const velocities = useMemo(() => {
    const v = new Float32Array(nodeCount * 3)
    for (let i = 0; i < nodeCount; i++) {
      v[i * 3]     = (Math.sin(i * 2.3) * 0.5 - 0.25) * 0.02
      v[i * 3 + 1] = (Math.cos(i * 1.7) * 0.5 - 0.25) * 0.015
      v[i * 3 + 2] = (Math.sin(i * 3.1) * 0.5 - 0.25) * 0.018
    }
    return v
  }, [nodeCount])

  const lineMat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color(lineTint[0], lineTint[1], lineTint[2]),
    transparent: true,
    opacity: lineOpacity,
    depthWrite: false,
  }), [])

  const nodeMat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: NODE_VERT,
    fragmentShader: NODE_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(nodeColor[0], nodeColor[1], nodeColor[2]) },
      uAlpha: { value: 1.0 },
      uScale: { value: nodeScale },
    },
  }), [])

  useEffect(() => {
    lineMat.color.setRGB(lineTint[0], lineTint[1], lineTint[2])
    nodeMat.uniforms.uColor.value.setRGB(nodeColor[0], nodeColor[1], nodeColor[2])
    nodeMat.uniforms.uScale.value = nodeScale
  }, [lineTint[0], lineTint[1], lineTint[2], nodeColor[0], nodeColor[1], nodeColor[2], nodeScale])

  useFrame(({ clock }, delta) => {
    if (!linesRef.current || !pointsRef.current) return

    const t = clock.elapsedTime
    nodeMat.uniforms.uTime.value = t

    const lineGeo = linesRef.current.geometry
    const linePos = lineGeo.attributes.position as THREE.BufferAttribute

    if (animMode === 'static') {
      // Update line positions from base (with gentle node float)
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2]
        const b = pairs[i * 2 + 1]
        const ay = basePositions[a * 3 + 1] + Math.sin(t * 0.8 + phases[a]) * 0.04
        const by = basePositions[b * 3 + 1] + Math.sin(t * 0.8 + phases[b]) * 0.04
        linePos.setXYZ(i * 2,     basePositions[a * 3], ay, basePositions[a * 3 + 2])
        linePos.setXYZ(i * 2 + 1, basePositions[b * 3], by, basePositions[b * 3 + 2])
      }
      if (lineBrightness) {
        lineMat.opacity = lineOpacity
      }
      lineGeo.attributes.position.needsUpdate = true

    } else if (animMode === 'draw-in') {
      const visible = Math.floor(progress * lineCount)
      lineMat.opacity = lineOpacity
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2]
        const b = pairs[i * 2 + 1]
        if (i < visible) {
          linePos.setXYZ(i * 2,     basePositions[a * 3], basePositions[a * 3 + 1], basePositions[a * 3 + 2])
          linePos.setXYZ(i * 2 + 1, basePositions[b * 3], basePositions[b * 3 + 1], basePositions[b * 3 + 2])
        } else {
          // Collapse invisible lines to origin
          linePos.setXYZ(i * 2, 0, 0, 0)
          linePos.setXYZ(i * 2 + 1, 0, 0, 0)
        }
      }
      lineGeo.attributes.position.needsUpdate = true

    } else if (animMode === 'fragment') {
      // Nodes drift apart, lines fade when stretched
      const fragP = Math.min(progress * 1.5, 1.0)
      for (let i = 0; i < nodeCount; i++) {
        currentPositions[i * 3]     = basePositions[i * 3]     + velocities[i * 3]     * fragP * 60
        currentPositions[i * 3 + 1] = basePositions[i * 3 + 1] + velocities[i * 3 + 1] * fragP * 60
        currentPositions[i * 3 + 2] = basePositions[i * 3 + 2] + velocities[i * 3 + 2] * fragP * 60
      }
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2]
        const b = pairs[i * 2 + 1]
        linePos.setXYZ(i * 2,     currentPositions[a * 3], currentPositions[a * 3 + 1], currentPositions[a * 3 + 2])
        linePos.setXYZ(i * 2 + 1, currentPositions[b * 3], currentPositions[b * 3 + 1], currentPositions[b * 3 + 2])
      }
      lineGeo.attributes.position.needsUpdate = true
      lineMat.opacity = lineOpacity * (1 - fragP * 0.8)

      // Update node positions too
      const nodeGeo = pointsRef.current.geometry
      nodeGeo.attributes.position.array.set(currentPositions)
      nodeGeo.attributes.position.needsUpdate = true

    } else if (animMode === 'converge') {
      // Nodes move toward origin
      const convP = smoothstep(0, 1, progress)
      for (let i = 0; i < nodeCount; i++) {
        currentPositions[i * 3]     = lerp(basePositions[i * 3],     center[0], convP)
        currentPositions[i * 3 + 1] = lerp(basePositions[i * 3 + 1], center[1], convP)
        currentPositions[i * 3 + 2] = lerp(basePositions[i * 3 + 2], center[2], convP)
      }
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2]
        const b = pairs[i * 2 + 1]
        linePos.setXYZ(i * 2,     currentPositions[a * 3], currentPositions[a * 3 + 1], currentPositions[a * 3 + 2])
        linePos.setXYZ(i * 2 + 1, currentPositions[b * 3], currentPositions[b * 3 + 1], currentPositions[b * 3 + 2])
      }
      lineGeo.attributes.position.needsUpdate = true
      const nodeGeo = pointsRef.current.geometry
      nodeGeo.attributes.position.array.set(currentPositions)
      nodeGeo.attributes.position.needsUpdate = true

    } else if (animMode === 'pulse-bright') {
      // Lines brighten with sin wave
      lineMat.opacity = lineOpacity * (0.7 + 0.3 * Math.sin(t * 1.5))
      for (let i = 0; i < lineCount; i++) {
        const a = pairs[i * 2]
        const b = pairs[i * 2 + 1]
        linePos.setXYZ(i * 2,     basePositions[a * 3], basePositions[a * 3 + 1], basePositions[a * 3 + 2])
        linePos.setXYZ(i * 2 + 1, basePositions[b * 3], basePositions[b * 3 + 1], basePositions[b * 3 + 2])
      }
      lineGeo.attributes.position.needsUpdate = true
    }

    // Group rotation
    if (groupRef.current && rotation !== 0) {
      groupRef.current.rotation.y += rotation * delta
    }
  })

  const lineGeoPositions = useMemo(() => {
    const buf = new Float32Array(lineCount * 6)
    buf.set(linePositions)
    return buf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linePositions.buffer])

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[lineGeoPositions, 3]}
            count={lineCount * 2}
          />
        </bufferGeometry>
        <primitive object={lineMat} attach="material" />
      </lineSegments>

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(basePositions), 3]}
            count={nodeCount}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[phases, 1]}
            count={nodeCount}
          />
        </bufferGeometry>
        <primitive object={nodeMat} attach="material" />
      </points>
    </group>
  )
}
