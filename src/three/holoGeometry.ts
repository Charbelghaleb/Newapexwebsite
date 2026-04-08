/**
 * Holographic geometry primitives — all produce line-segment vertex arrays in XZ plane.
 * Returns number[] so callers can merge before converting to Float32Array.
 */

/** Full circle ring at height y */
export function ring(r: number, y = 0, segments = 64): number[] {
  const pts: number[] = []
  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2
    const a2 = ((i + 1) / segments) * Math.PI * 2
    pts.push(
      Math.cos(a1) * r, y, Math.sin(a1) * r,
      Math.cos(a2) * r, y, Math.sin(a2) * r,
    )
  }
  return pts
}

/** Partial arc from startAngle to endAngle (radians) */
export function arc(r: number, start: number, end: number, y = 0, segments = 32): number[] {
  const pts: number[] = []
  const range = end - start
  for (let i = 0; i < segments; i++) {
    const a1 = start + (i / segments) * range
    const a2 = start + ((i + 1) / segments) * range
    pts.push(
      Math.cos(a1) * r, y, Math.sin(a1) * r,
      Math.cos(a2) * r, y, Math.sin(a2) * r,
    )
  }
  return pts
}

/** Radial tick marks around a circle */
export function ticks(r: number, count: number, len: number, y = 0, majorEvery = 0, majorLen = 0): number[] {
  const pts: number[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const c = Math.cos(a), s = Math.sin(a)
    const l = (majorEvery > 0 && i % majorEvery === 0) ? majorLen : len
    pts.push(c * r, y, s * r, c * (r + l), y, s * (r + l))
  }
  return pts
}

/** Ring with dashes (gaps between segments) */
export function dashedRing(r: number, dashes: number, ratio = 0.7, y = 0, segsPerDash = 6): number[] {
  const pts: number[] = []
  const dashAngle = (Math.PI * 2 / dashes) * ratio
  for (let d = 0; d < dashes; d++) {
    const base = (d / dashes) * Math.PI * 2
    for (let i = 0; i < segsPerDash; i++) {
      const a1 = base + (i / segsPerDash) * dashAngle
      const a2 = base + ((i + 1) / segsPerDash) * dashAngle
      pts.push(
        Math.cos(a1) * r, y, Math.sin(a1) * r,
        Math.cos(a2) * r, y, Math.sin(a2) * r,
      )
    }
  }
  return pts
}

/** Crosshair (+ shape) with optional center gap */
export function crosshair(size: number, gap = 0, y = 0): number[] {
  return [
    -size, y, 0, -gap, y, 0,
    gap, y, 0, size, y, 0,
    0, y, -size, 0, y, -gap,
    0, y, gap, 0, y, size,
  ]
}

/** Diagonal crosshair (X shape) */
export function diagonalCross(size: number, gap = 0, y = 0): number[] {
  const s = size * 0.707, g = gap * 0.707
  return [
    -s, y, -s, -g, y, -g,
    g, y, g, s, y, s,
    -s, y, s, -g, y, g,
    g, y, -g, s, y, -s,
  ]
}

/** Vertical ribs connecting two circular rims */
export function ribs(topR: number, topY: number, botR: number, botY: number, count: number): number[] {
  const pts: number[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const c = Math.cos(a), s = Math.sin(a)
    pts.push(c * topR, topY, s * topR, c * botR, botY, s * botR)
  }
  return pts
}

/** HUD-style corner brackets at cardinal points */
export function brackets(dist: number, size: number, y = 0): number[] {
  const pts: number[] = []
  const corners: [number, number, number, number][] = [
    [dist, dist, -1, -1],
    [-dist, dist, 1, -1],
    [dist, -dist, -1, 1],
    [-dist, -dist, 1, 1],
  ]
  for (const [x, z, dx, dz] of corners) {
    pts.push(x, y, z, x + dx * size, y, z)
    pts.push(x, y, z, x, y, z + dz * size)
  }
  return pts
}

/** Radial lines from center outward (grid spokes) */
export function radials(r: number, count: number, gap = 0, y = 0): number[] {
  const pts: number[] = []
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const c = Math.cos(a), s = Math.sin(a)
    pts.push(c * gap, y, s * gap, c * r, y, s * r)
  }
  return pts
}

/** Convert number[] to Float32Array */
export function toBuffer(pts: number[]): Float32Array {
  return new Float32Array(pts)
}
