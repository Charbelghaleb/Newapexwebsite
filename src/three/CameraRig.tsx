import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '../context/ScrollContext'
import { lerp, smootherstep } from '../utils/mathUtils'
import { useServiceSelection } from '../context/ServiceSelectionContext'

// Camera position spline — travels from z=+14 (hero approach) to z=-140 (contact)
// Curves in X/Y for cinematic feel as you scroll through the world
const CAM_CURVE = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,    0.2,  14),
  new THREE.Vector3(0.3,  0.5,   6),
  new THREE.Vector3(0,    0.5,   0),   // Hero zone (Z=-2)
  new THREE.Vector3(2,    0.5, -22),   // Problem approach — read text on right
  new THREE.Vector3(-4,   0.8, -39),   // Fly through C-ring center
  new THREE.Vector3(-2,   0.5, -55),
  new THREE.Vector3(-0.5,  0.8, -70),   // Offer approach — read text on left
  new THREE.Vector3(2.5,  0.8, -76),   // Fly through diamond center
  new THREE.Vector3(0,    0.5, -95),
  new THREE.Vector3(-0.5, 0.8, -107),  // Services approach — read text on left
  new THREE.Vector3(2.5,  0.8, -113),  // Fly through pyramid center
  new THREE.Vector3(0,    1.0, -122),  // Breathing room — Services → Industries gap
  new THREE.Vector3(0,    1.6, -135),  // Industries (Z=-150)
  new THREE.Vector3(2,    0.5, -165),  // Exit through last planet
  new THREE.Vector3(1,    0.8, -185),  // Breathing room — Industries → Social gap
  new THREE.Vector3(0,    0.6, -200),  // Breathing room continued
  new THREE.Vector3(2,    0.5, -210),  // Social approach (Z=-224)
  new THREE.Vector3(-1,   0.5, -247),  // About zone (Z=-261)
  new THREE.Vector3(0,    0.2, -287),  // Contact zone (Z=-298)
  new THREE.Vector3(0,    0,   -327),
])

const LERP = 0.07

export default function CameraRig() {
  const { camera, gl } = useThree()
  const { progress } = useScroll()
  const progressRef = useRef(progress)
  const currentPos = useRef(new THREE.Vector3(0, 0.2, 14))
  const currentLook = useRef(new THREE.Vector3(0, 0.5, 4))

  // Drag state with velocity/inertia
  const isDragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const lastMove = useRef({ x: 0, y: 0 })

  progressRef.current = progress

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      velocity.current = { x: 0, y: 0 }
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const mx = e.movementX * 0.006
      const my = -e.movementY * 0.006
      offset.current.x += mx
      offset.current.y += my
      // Track velocity for inertia
      lastMove.current = { x: mx, y: my }
    }

    const onPointerUp = () => {
      isDragging.current = false
      // Kick off inertia from last movement
      velocity.current = { x: lastMove.current.x * 0.8, y: lastMove.current.y * 0.8 }
      lastMove.current = { x: 0, y: 0 }
      canvas.style.cursor = ''
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl])

  const { selectedTier } = useServiceSelection()
  const selectedTierRef = useRef(selectedTier)
  selectedTierRef.current = selectedTier

  useFrame((_, delta) => {
    const p = progressRef.current
    const pAhead = Math.min(p + 0.05, 1.0)

    const targetPos = CAM_CURVE.getPoint(p)
    const targetLook = CAM_CURVE.getPoint(pAhead)

    // Override: Industries — hold on each planet, then pan to next
    // With blend zones for smooth entry/exit and subtle Z drift during holds
    const blendInStart = 0.62, blendInEnd = 0.66
    const blendOutStart = 0.83, blendOutEnd = 0.87
    const indStart = 0.62, indEnd = 0.87

    if (p > indStart && p < indEnd && !selectedTierRef.current) {
      // Save spline position before override
      const splinePos = targetPos.clone()
      const splineLook = targetLook.clone()

      // Compute override position
      let panX = -19
      let camZ = -134
      let camY = 1.6
      const lookZ = -150

      if (p < 0.68) {
        // Hold at planet 1 — Z drifts -134 → -135.5
        panX = -19
        const ht = Math.min(Math.max((p - 0.64) / 0.04, 0), 1)
        camZ = lerp(-134, -135.5, ht)
      } else if (p < 0.71) {
        // Pan planet 1 → planet 2 (smootherstep)
        const s = smootherstep(0.68, 0.71, p)
        panX = lerp(-19, -1, s)
        camZ = lerp(-135.5, -136, s)
      } else if (p < 0.74) {
        // Hold at planet 2 — Z drifts -136 → -136.5
        panX = -1
        const ht = (p - 0.71) / 0.03
        camZ = lerp(-136, -136.5, ht)
      } else if (p < 0.77) {
        // Pan planet 2 → planet 3 (smootherstep)
        const s = smootherstep(0.74, 0.77, p)
        panX = lerp(-1, 17, s)
        camZ = lerp(-136.5, -137, s)
      } else if (p < 0.80) {
        // Hold at planet 3 — Z drifts -137 → -137.5
        panX = 17
        const ht = (p - 0.77) / 0.03
        camZ = lerp(-137, -137.5, ht)
      } else {
        // Exit: fly directly through RingedPlanet center (18, 0, -150)
        const s = smootherstep(0.80, 0.85, p)
        let exitX: number, exitY: number, exitZ: number
        if (s < 0.5) {
          const h = s * 2
          exitX = lerp(17, 18, h)
          exitY = lerp(1.6, 0, h)
          exitZ = lerp(-137.5, -150, h)
        } else {
          const h = (s - 0.5) * 2
          exitX = lerp(18, 2, h)
          exitY = lerp(0, 0.5, h)
          exitZ = lerp(-150, -168, h)
        }
        targetPos.set(exitX, exitY, exitZ)
        targetLook.set(exitX, exitY * 0.3, exitZ - 15)
        panX = -999
      }

      if (panX > -999) {
        targetPos.set(panX, camY, camZ)
        targetLook.set(panX, 0.5, lookZ)
      }

      // Blend-in: smoothly transition from spline to override
      if (p < blendInEnd) {
        const blend = smootherstep(blendInStart, blendInEnd, p)
        targetPos.lerpVectors(splinePos, targetPos, blend)
        targetLook.lerpVectors(splineLook, targetLook, blend)
      }
      // Blend-out: smoothly transition from override back to spline
      else if (p > blendOutStart) {
        const blend = smootherstep(blendOutStart, blendOutEnd, p)
        const overridePos = targetPos.clone()
        const overrideLook = targetLook.clone()
        targetPos.lerpVectors(overridePos, splinePos, blend)
        targetLook.lerpVectors(overrideLook, splineLook, blend)
      }
    }

    // Override: Social section — pan left → right → center
    const socBlendInStart = 0.870, socBlendInEnd = 0.885
    const socBlendOutStart = 0.920, socBlendOutEnd = 0.935
    const socStart = 0.870, socEnd = 0.935

    if (p > socStart && p < socEnd && !selectedTierRef.current) {
      const splinePos = targetPos.clone()
      const splineLook = targetLook.clone()

      let camX: number, camY: number, camZ: number
      let lookX: number, lookY: number, lookZ: number

      if (p < 0.893) {
        // Hold: look at LEFT text
        camX = -1.0; camY = 1.0; camZ = -208
        lookX = -3.6; lookY = 1.0; lookZ = -220
      } else if (p < 0.903) {
        // Pan LEFT → RIGHT
        const s = smootherstep(0.893, 0.903, p)
        camX = lerp(-1.0, 1.0, s); camY = 1.0; camZ = lerp(-208, -209, s)
        lookX = lerp(-3.6, 3.6, s); lookY = 1.0; lookZ = -220
      } else if (p < 0.913) {
        // Pan RIGHT → CENTER (hologram)
        const s = smootherstep(0.903, 0.913, p)
        camX = lerp(1.0, 0, s); camY = lerp(1.0, 1.2, s); camZ = lerp(-209, -210, s)
        lookX = lerp(3.6, 0, s); lookY = lerp(1.0, 1.2, s); lookZ = lerp(-220, -224, s)
      } else {
        // Hold center, blend-out handles exit
        camX = 0; camY = 1.2; camZ = -210
        lookX = 0; lookY = 1.2; lookZ = -224
      }

      targetPos.set(camX, camY, camZ)
      targetLook.set(lookX, lookY, lookZ)

      // Blend-in from spline
      if (p < socBlendInEnd) {
        const blend = smootherstep(socBlendInStart, socBlendInEnd, p)
        targetPos.lerpVectors(splinePos, targetPos, blend)
        targetLook.lerpVectors(splineLook, targetLook, blend)
      }
      // Blend-out to spline
      else if (p > socBlendOutStart) {
        const blend = smootherstep(socBlendOutStart, socBlendOutEnd, p)
        const overridePos = targetPos.clone()
        const overrideLook = targetLook.clone()
        targetPos.lerpVectors(overridePos, splinePos, blend)
        targetLook.lerpVectors(overrideLook, splineLook, blend)
      }
    }

    // Override: pan to tier-specific detail zone
    // Camera shifted left (-4) so pyramid+text feel centered, not right-heavy
    if (selectedTierRef.current) {
      const id = selectedTierRef.current.id
      if (id === 'tier1') {
        targetPos.set(46, 0.5, -100)
        targetLook.set(46, 0.5, -113)
      } else if (id === 'tier2') {
        targetPos.set(86, 0.5, -100)
        targetLook.set(86, 0.5, -113)
      } else if (id === 'tier3') {
        targetPos.set(126, 0.5, -100)
        targetLook.set(126, 0.5, -113)
      }
    }

    const f = 1 - Math.pow(1 - LERP, delta * 60)
    const dt60 = delta * 60

    if (!isDragging.current) {
      // Apply inertia then friction
      offset.current.x += velocity.current.x * dt60
      offset.current.y += velocity.current.y * dt60
      velocity.current.x *= 0.88
      velocity.current.y *= 0.88

      // Spring back to center
      offset.current.x *= 0.97
      offset.current.y *= 0.97

      // Kill tiny values
      if (Math.abs(offset.current.x) < 0.001) offset.current.x = 0
      if (Math.abs(offset.current.y) < 0.001) offset.current.y = 0
      if (Math.abs(velocity.current.x) < 0.0005) velocity.current.x = 0
      if (Math.abs(velocity.current.y) < 0.0005) velocity.current.y = 0
    }

    // Soft clamp
    const maxX = 2.5, maxY = 1.5
    offset.current.x = Math.max(-maxX, Math.min(maxX, offset.current.x))
    offset.current.y = Math.max(-maxY, Math.min(maxY, offset.current.y))

    currentPos.current.lerp(targetPos, f)
    currentLook.current.lerp(targetLook, f)

    const ox = offset.current.x
    const oy = offset.current.y

    camera.position.set(
      currentPos.current.x + ox,
      currentPos.current.y + oy,
      currentPos.current.z,
    )
    camera.lookAt(
      currentLook.current.x + ox * 0.3,
      currentLook.current.y + oy * 0.3,
      currentLook.current.z,
    )
  })

  return null
}
