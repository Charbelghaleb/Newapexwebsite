import { useMemo } from 'react'
import * as THREE from 'three'

// Stacked architectural floor plates with cross-bracing tension wires
// Inspired by Cloud City (Image 1) and Machine Behavior (Image 3)

interface Props {
  floors?: number
  width?: number
  depth?: number
  spacing?: number
  alternateX?: number
  color?: string
  opacity?: number
  position?: [number, number, number]
  plateHeight?: number
}

export default function StackedFloors({
  floors = 5,
  width = 6,
  depth = 3,
  spacing = 1.4,
  alternateX = 0.35,
  color = '#00E5FF',
  opacity = 0.38,
  position = [0, 0, 0] as [number, number, number],
  plateHeight = 0.35,
}: Props) {

  const offsets = useMemo(() =>
    Array.from({ length: floors }, (_, i) => ({
      x: (i % 2 === 0 ? -1 : 1) * alternateX,
      y: i * spacing,
    })),
  [floors, spacing, alternateX])

  // Floor plate edge geometry (visible thickness via plateHeight)
  const plateEdges = useMemo(() => {
    const box = new THREE.BoxGeometry(width, plateHeight, depth)
    return new THREE.EdgesGeometry(box)
  }, [width, depth, plateHeight])

  // Corner connectors + diagonal cross-bracing between consecutive floors
  const connectorGeo = useMemo(() => {
    const hw = width / 2
    const hd = depth / 2
    const verts: number[] = []

    for (let i = 0; i < offsets.length - 1; i++) {
      const a = offsets[i]
      const b = offsets[i + 1]
      const y1 = a.y + plateHeight / 2
      const y2 = b.y - plateHeight / 2

      // 4 vertical corner pillars
      const corners: [number, number][] = [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]]
      for (const [cx, cz] of corners) {
        verts.push(a.x + cx, y1, cz,  b.x + cx, y2, cz)
      }

      // Cross-bracing diagonals on front and back faces
      // Front face (z = +hd)
      verts.push(a.x - hw, y1, hd,   b.x + hw, y2, hd)
      verts.push(a.x + hw, y1, hd,   b.x - hw, y2, hd)
      // Back face (z = -hd)
      verts.push(a.x - hw, y1, -hd,  b.x + hw, y2, -hd)
      verts.push(a.x + hw, y1, -hd,  b.x - hw, y2, -hd)
      // Left face (x = -hw), right face (x = +hw)
      verts.push(a.x - hw, y1, -hd,  b.x - hw, y2, hd)
      verts.push(a.x + hw, y1, -hd,  b.x + hw, y2, hd)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
    return geo
  }, [offsets, width, depth, plateHeight])

  // Surface grid on each floor plate (faint structural detail)
  const surfaceGridGeo = useMemo(() => {
    const verts: number[] = []
    const gridSteps = 3
    const hw = width / 2
    const hd = depth / 2
    const yTop = plateHeight / 2

    for (const off of offsets) {
      for (let s = 1; s < gridSteps; s++) {
        const t = s / gridSteps
        // Lines parallel to depth axis
        const x = -hw + t * width
        verts.push(off.x + x, off.y + yTop, -hd,  off.x + x, off.y + yTop, hd)
        // Lines parallel to width axis
        const z = -hd + t * depth
        verts.push(off.x - hw, off.y + yTop, z,  off.x + hw, off.y + yTop, z)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
    return geo
  }, [offsets, width, depth, plateHeight])

  return (
    <group position={position}>
      {/* Floor plates */}
      {offsets.map((off, i) => (
        <lineSegments key={i} geometry={plateEdges} position={[off.x, off.y, 0]}>
          <lineBasicMaterial
            color={color} transparent
            opacity={opacity * (0.5 + (i / Math.max(floors - 1, 1)) * 0.55)}
            depthWrite={false}
          />
        </lineSegments>
      ))}

      {/* Corner pillars + cross-bracing */}
      <lineSegments geometry={connectorGeo}>
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.28} depthWrite={false} />
      </lineSegments>

      {/* Surface grid detail */}
      <lineSegments geometry={surfaceGridGeo}>
        <lineBasicMaterial color={color} transparent opacity={opacity * 0.12} depthWrite={false} />
      </lineSegments>
    </group>
  )
}
