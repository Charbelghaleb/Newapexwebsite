import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '../context/ScrollContext'
import { lerp } from '../utils/mathUtils'

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
  new THREE.Vector3(-1,   0.5, -110),  // Services zone (Z=-113)
  new THREE.Vector3(0,    1.6, -135),  // Industries (Z=-150)
  new THREE.Vector3(2,    0.5, -172),  // Social zone (Z=-187)
  new THREE.Vector3(-1,   0.5, -210),  // About zone (Z=-224)
  new THREE.Vector3(0,    0.2, -250),  // Contact zone (Z=-261)
  new THREE.Vector3(0,    0,   -290),
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

  useFrame((_, delta) => {
    const p = progressRef.current
    const pAhead = Math.min(p + 0.05, 1.0)

    const targetPos = CAM_CURVE.getPoint(p)
    const targetLook = CAM_CURVE.getPoint(pAhead)

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
