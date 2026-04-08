import * as THREE from 'three'

/** Clamp value between min and max */
export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

/** Remap v from [inLo, inHi] to [outLo, outHi], clamped */
export function remap(v: number, inLo: number, inHi: number, outLo = 0, outHi = 1): number {
  return clamp(outLo + ((v - inLo) / (inHi - inLo)) * (outHi - outLo), outLo, outHi)
}

/** GLSL-style smoothstep */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Seeded pseudo-random (mulberry32) */
export function makeRng(seed: number) {
  let s = seed
  return () => {
    s |= 0
    s = s + 0x6d2b79f5 | 0
    let t = Math.imul(s ^ s >>> 15, 1 | s)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/** Generate positions in an ellipsoid using seeded RNG */
export function generateEllipsoidPositions(
  count: number,
  spread: [number, number, number],
  center: [number, number, number] = [0, 0, 0],
  seed = 42
): Float32Array {
  const rng = makeRng(seed)
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Use rejection sampling for uniform ellipsoid distribution
    let x, y, z
    do {
      x = (rng() * 2 - 1)
      y = (rng() * 2 - 1)
      z = (rng() * 2 - 1)
    } while (x * x + y * y + z * z > 1)
    positions[i * 3]     = x * spread[0] + center[0]
    positions[i * 3 + 1] = y * spread[1] + center[1]
    positions[i * 3 + 2] = z * spread[2] + center[2]
  }
  return positions
}

/** Find K nearest neighbors for each node, return pairs of indices for LineSegments */
export function kNearestNeighbors(
  positions: Float32Array,
  k: number
): { pairs: Uint32Array; linePositions: Float32Array } {
  const count = positions.length / 3
  const pairSet = new Set<string>()
  const pairList: [number, number][] = []

  for (let i = 0; i < count; i++) {
    const ix = positions[i * 3]
    const iy = positions[i * 3 + 1]
    const iz = positions[i * 3 + 2]

    // Compute distances to all others
    const dists: [number, number][] = []
    for (let j = 0; j < count; j++) {
      if (j === i) continue
      const dx = positions[j * 3] - ix
      const dy = positions[j * 3 + 1] - iy
      const dz = positions[j * 3 + 2] - iz
      dists.push([dx * dx + dy * dy + dz * dz, j])
    }
    dists.sort((a, b) => a[0] - b[0])

    for (let n = 0; n < Math.min(k, dists.length); n++) {
      const j = dists[n][1]
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (!pairSet.has(key)) {
        pairSet.add(key)
        pairList.push([i, j])
      }
    }
  }

  const pairs = new Uint32Array(pairList.length * 2)
  const linePositions = new Float32Array(pairList.length * 6)

  for (let i = 0; i < pairList.length; i++) {
    const [a, b] = pairList[i]
    pairs[i * 2] = a
    pairs[i * 2 + 1] = b
    linePositions[i * 6]     = positions[a * 3]
    linePositions[i * 6 + 1] = positions[a * 3 + 1]
    linePositions[i * 6 + 2] = positions[a * 3 + 2]
    linePositions[i * 6 + 3] = positions[b * 3]
    linePositions[i * 6 + 4] = positions[b * 3 + 1]
    linePositions[i * 6 + 5] = positions[b * 3 + 2]
  }

  return { pairs, linePositions }
}

/** Interpolate between camera keyframes */
export interface CameraKeyframe {
  p: number
  pos: [number, number, number]
  look: [number, number, number]
  fov?: number
}

export function interpolateCameraKeyframes(
  keyframes: CameraKeyframe[],
  progress: number
): { pos: THREE.Vector3; look: THREE.Vector3; fov: number } {
  if (progress <= keyframes[0].p) {
    return {
      pos: new THREE.Vector3(...keyframes[0].pos),
      look: new THREE.Vector3(...keyframes[0].look),
      fov: keyframes[0].fov ?? 55,
    }
  }
  if (progress >= keyframes[keyframes.length - 1].p) {
    const last = keyframes[keyframes.length - 1]
    return {
      pos: new THREE.Vector3(...last.pos),
      look: new THREE.Vector3(...last.look),
      fov: last.fov ?? 55,
    }
  }

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i]
    const b = keyframes[i + 1]
    if (progress >= a.p && progress <= b.p) {
      const t = smoothstep(a.p, b.p, progress)
      return {
        pos: new THREE.Vector3(
          lerp(a.pos[0], b.pos[0], t),
          lerp(a.pos[1], b.pos[1], t),
          lerp(a.pos[2], b.pos[2], t)
        ),
        look: new THREE.Vector3(
          lerp(a.look[0], b.look[0], t),
          lerp(a.look[1], b.look[1], t),
          lerp(a.look[2], b.look[2], t)
        ),
        fov: lerp(a.fov ?? 55, b.fov ?? 55, t),
      }
    }
  }

  const last = keyframes[keyframes.length - 1]
  return {
    pos: new THREE.Vector3(...last.pos),
    look: new THREE.Vector3(...last.look),
    fov: last.fov ?? 55,
  }
}
