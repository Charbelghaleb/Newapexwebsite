import { Suspense, useRef, useMemo, useEffect } from 'react'
import { useTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ring, arc, ticks, dashedRing, ribs, brackets, toBuffer } from '../holoGeometry'

const Z = -2
const RING_X = 3.0

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

// ── Hero 3D text — positioned left of the ring structure ──
function HeroText() {
  return (
    <group position={[0, 4.5, -2]} scale={[1.4, 1.4, 1.4]}>

      {/* ── Tag line ── */}
      <Text
        font={FONT_MONO}
        fontSize={0.12}
        position={[0, 1.6, 0]}
        anchorX="center"
        anchorY="middle"
        color="#FF6B00"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.6}
        letterSpacing={0.18}
      >
        {'> APEX_PROMETHEUS //'}
      </Text>

      {/* ── Headline L1 — SURVIVE & THRIVE ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.50}
        position={[0, 1.0, 0]}
        anchorX="center"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.92}
        letterSpacing={-0.03}
        outlineWidth={0.005}
        outlineColor="#00E5FF"
        outlineOpacity={0.25}
      >
        SURVIVE & THRIVE
      </Text>
      {/* Ghost echo */}
      <Text
        font={FONT_HEADING}
        fontSize={0.50}
        position={[0.04, 0.98, -0.15]}
        anchorX="center"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={0}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.06}
        letterSpacing={-0.03}
      >
        SURVIVE & THRIVE
      </Text>

      {/* ── Headline L2 — WITH AI ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.48}
        position={[0, 0.3, 0]}
        anchorX="center"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.92}
        letterSpacing={-0.03}
        outlineWidth={0.006}
        outlineColor="#00E5FF"
        outlineOpacity={0.3}
      >
        WITH AI
      </Text>
      {/* Ghost echo */}
      <Text
        font={FONT_HEADING}
        fontSize={0.48}
        position={[0.04, 0.28, -0.15]}
        anchorX="center"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={0}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.06}
        letterSpacing={-0.03}
      >
        WITH AI
      </Text>

      {/* ── Subhead ── */}
      <Text
        font={FONT_BODY}
        fontSize={0.16}
        position={[0, -0.35, 0]}
        anchorX="center"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.35}
        lineHeight={1.6}
        maxWidth={5.5}
        textAlign="center"
      >
{'We help small and mid-size businesses adopt AI tools and build lean operations.\nFrom basic implementations to full agentic workflows.'}
      </Text>

      {/* ── Divider line — centered ── */}
      <lineSegments position={[-2.25, -0.85, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4.5, 0, 0]), 3]}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>

      {/* ══════════════════════════════════════════
          CTA Buttons
          ══════════════════════════════════════════ */}
      {(() => {
        const btnH = 0.35
        const bz = 0
        const btnY = -1.1
        const gap = 0.12
        const b1w = 2.7
        const b2w = 2.7
        const totalW = b1w + gap + b2w
        const startX = -totalW / 2
        const b2x = startX + b1w + gap
        return (
          <>
            {/* Button 1 — BOOK CONSULTATION → */}
            <mesh position={[startX + b1w / 2, btnY - btnH / 2, bz]} renderOrder={1}>
              <planeGeometry args={[b1w, btnH]} />
              <meshBasicMaterial color="#FF6B00" transparent opacity={0.15} depthWrite={false} />
            </mesh>
            <lineSegments position={[startX, btnY, bz + 0.01]} renderOrder={2}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    0, 0, 0,  b1w, 0, 0,
                    b1w, 0, 0,  b1w, -btnH, 0,
                    b1w, -btnH, 0,  0, -btnH, 0,
                    0, -btnH, 0,  0, 0, 0,
                  ]), 3]}
                  count={8}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#FF6B00" transparent opacity={0.6} depthWrite={false} />
            </lineSegments>
            <Text
              font={FONT_HEADING}
              fontSize={0.09}
              position={[startX + b1w / 2, btnY - btnH / 2, bz + 0.02]}
              anchorX="center"
              anchorY="middle"
              color="#FF6B00"
              renderOrder={3}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.85}
              letterSpacing={0.04}
            >
              {'BOOK CONSULTATION \u2192'}
            </Text>

            {/* Button 2 — EXPLORE SERVICES */}
            <lineSegments position={[b2x, btnY, bz + 0.01]} renderOrder={2}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    0, 0, 0,  b2w, 0, 0,
                    b2w, 0, 0,  b2w, -btnH, 0,
                    b2w, -btnH, 0,  0, -btnH, 0,
                    0, -btnH, 0,  0, 0, 0,
                  ]), 3]}
                  count={8}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#252540" transparent opacity={0.5} depthWrite={false} />
            </lineSegments>
            <Text
              font={FONT_HEADING}
              fontSize={0.09}
              position={[b2x + b2w / 2, btnY - btnH / 2, bz + 0.02]}
              anchorX="center"
              anchorY="middle"
              color="#E0E0EC"
              renderOrder={3}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.4}
              letterSpacing={0.04}
            >
              EXPLORE SERVICES
            </Text>
          </>
        )
      })()}

    </group>
  )
}

// ── Embedded flame logo ──
function EmbeddedFlameLogo() {
  const texture = useTexture('/flame-logo-smooth-4k.png')
  useEffect(() => {
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 16
    texture.needsUpdate = true
  }, [texture])

  return (
    <mesh position={[0, 0.30, 2.0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={20}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        map={texture} transparent opacity={0.75}
        alphaTest={0.05} depthWrite
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ── Main Hero 3D Scene ──
export default function HeroSection3D() {
  const groupRef = useRef<THREE.Group>(null!)
  const scanRef = useRef<THREE.Points>(null!)
  const scanPos = useMemo(() => new Float32Array([5.0, 0, 0]), [])

  const primary = useMemo(() => toBuffer([
    ...ring(5.0),
  ]), [])

  const secondary = useMemo(() => toBuffer([
    ...ring(4.9, -0.25),
    ...ring(4.7, -0.55),
    ...ring(4.5, -0.85),
    ...ribs(5.0, 0, 4.5, -0.85, 24),
  ]), [])

  const detail = useMemo(() => toBuffer([
    ...ticks(5.0, 120, 0.12, 0, 10, 0.28),
    ...brackets(5.8, 0.5),
  ]), [])

  const accents = useMemo(() => toBuffer([
    ...arc(4.5, 0.2, 1.1),
    ...arc(4.5, Math.PI + 0.2, Math.PI + 1.1),
    ...arc(4.8, 1.8, 2.6),
    ...arc(4.8, Math.PI + 1.8, Math.PI + 2.6),
  ]), [])

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003
    if (scanRef.current) {
      const a = clock.elapsedTime * 0.5
      scanPos[0] = Math.cos(a) * 5.0
      scanPos[2] = Math.sin(a) * 5.0
      scanRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      {/* 3D Text — left side, fixed in space */}
      <Suspense fallback={null}>
        <HeroText />
      </Suspense>

      <group position={[0, -1.0, Z]} scale={[0.9, 0.9, 0.9]}>
        {/* Logo — same tilt, doesn't spin */}
        <group rotation={[0.65, 0, 0]}>
          <Suspense fallback={null}>
            <EmbeddedFlameLogo />
          </Suspense>
        </group>

        {/* Spinning ring structure */}
        <group ref={groupRef} rotation={[0.65, 0, 0]}>
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[primary, 3]} count={primary.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.18} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[secondary, 3]} count={secondary.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.07} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[detail, 3]} count={detail.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.05} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.22} depthWrite={false} />
          </lineSegments>

          <points ref={scanRef}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[scanPos, 3]} count={1} />
            </bufferGeometry>
            <pointsMaterial size={3} color="#00E5FF" transparent opacity={0.9} depthWrite={false} sizeAttenuation={false} />
          </points>
        </group>
      </group>
    </>
  )
}
