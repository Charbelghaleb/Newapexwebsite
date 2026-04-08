import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import { ring, arc, ticks, dashedRing, ribs, crosshair, brackets, toBuffer } from '../holoGeometry'

const Z = -76

const FONT_HEADING = '/fonts/orbitron-900.woff'
const FONT_BODY    = '/fonts/rajdhani-500.woff'
const FONT_MONO    = '/fonts/share-tech-mono-400.woff'

// ── Wireframe gift icon (box + ribbon + bow) ──
function GiftIcon({ position, z }: { position: [number, number]; z: number }) {
  const s = 0.12 // box half-size
  const geo = useMemo(() => {
    // two teardrop ribbon loops on top
    const loopPts: number[] = []
    const segs = 12
    const rx = s * 0.5  // loop width
    const ry = s * 0.45 // loop height
    // left loop
    for (let i = 0; i < segs; i++) {
      const a0 = (2 * Math.PI * i) / segs
      const a1 = (2 * Math.PI * (i + 1)) / segs
      loopPts.push(
        -rx * 0.5 + Math.cos(a0) * rx * 0.5, s + ry * 0.5 + Math.sin(a0) * ry * 0.5, 0,
        -rx * 0.5 + Math.cos(a1) * rx * 0.5, s + ry * 0.5 + Math.sin(a1) * ry * 0.5, 0,
      )
    }
    // right loop
    for (let i = 0; i < segs; i++) {
      const a0 = (2 * Math.PI * i) / segs
      const a1 = (2 * Math.PI * (i + 1)) / segs
      loopPts.push(
        rx * 0.5 + Math.cos(a0) * rx * 0.5, s + ry * 0.5 + Math.sin(a0) * ry * 0.5, 0,
        rx * 0.5 + Math.cos(a1) * rx * 0.5, s + ry * 0.5 + Math.sin(a1) * ry * 0.5, 0,
      )
    }
    return toBuffer([
      // box outline
      -s, -s, 0, s, -s, 0,
      s, -s, 0, s, s, 0,
      s, s, 0, -s, s, 0,
      -s, s, 0, -s, -s, 0,
      // horizontal ribbon
      -s, 0, 0, s, 0, 0,
      // vertical ribbon
      0, -s, 0, 0, s, 0,
      // ribbon bow — two teardrop loops
      ...loopPts,
    ])
  }, [])

  return (
    <lineSegments position={[position[0], position[1], z]} renderOrder={1}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo, 3]} count={geo.length / 3} />
      </bufferGeometry>
      <lineBasicMaterial color="#FF6B00" transparent opacity={0.55} depthWrite={false} />
    </lineSegments>
  )
}

// ── Text ring — many words packed along a circular path forming the shape ──
function TextRing({ y, r, count, words, size, color, op }: {
  y: number; r: number; count: number; words: string[]
  size: number; color: string; op: number
}) {
  const items = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const angle = -(Math.PI * 2 * i) / count
      const word = words[i % words.length]
      arr.push({ angle, word, s: size })
    }
    return arr
  }, [count, words, size])

  return (
    <group>
      {items.map((item, i) => (
        <Text
          key={i}
          font={FONT_HEADING}
          fontSize={item.s}
          position={[
            Math.cos(item.angle) * r,
            y,
            Math.sin(item.angle) * r,
          ]}
          rotation={[0, -item.angle + Math.PI / 2, 0]}
          anchorX="center"
          anchorY="middle"
          color={color}
          renderOrder={10}
          material-fog={true}
          material-transparent={true}
          material-opacity={op}
          material-depthWrite={false}
          letterSpacing={0.06}
        >
          {item.word}
        </Text>
      ))}
    </group>
  )
}

// ── Offer text positioned in 3D space alongside diamond ──

function OfferText() {
  const textGroup = useRef<THREE.Group>(null!)
  const X = -5.0
  const baseY = 0.8
  const TEXT_Z = -72

  return (
    <group ref={textGroup} position={[X, baseY, TEXT_Z]} rotation={[0, 0.35, 0]}>

      {/* ── Tag line — front layer ── */}
      <Text
        font={FONT_MONO}
        fontSize={0.12}
        position={[0, 2.8, 0.4]}
        anchorX="left"
        anchorY="middle"
        color="#FF6B00"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.6}
        letterSpacing={0.18}
      >
        {'> FREE_PACKAGE //'}
      </Text>

      {/* ── Main heading line 1 — forward layer ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.52}
        position={[0, 2.1, 0.25]}
        anchorX="left"
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
        BEFORE YOU PAY
      </Text>
      {/* Holographic echo — ghost duplicate behind */}
      <Text
        font={FONT_HEADING}
        fontSize={0.52}
        position={[0.06, 2.08, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={0}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.06}
        letterSpacing={-0.03}
      >
        BEFORE YOU PAY
      </Text>

      {/* ── Main heading line 2 — forward layer ── */}
      <Text
        font={FONT_HEADING}
        fontSize={0.52}
        position={[0, 1.45, 0.25]}
        anchorX="left"
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
        US A DIME
      </Text>
      {/* Holographic echo */}
      <Text
        font={FONT_HEADING}
        fontSize={0.52}
        position={[0.06, 1.43, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={0}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.06}
        letterSpacing={-0.03}
      >
        US A DIME
      </Text>

      {/* ── Subhead ── */}
      <Text
        font={FONT_BODY}
        fontSize={0.18}
        position={[0, 0.85, 0.1]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.35}
        lineHeight={1.6}
        maxWidth={6}
      >
        {'Most AI consultants show up with a slideshow.\nWe show up with finished work.'}
      </Text>

      {/* ── Divider line (geometry) ── */}
      <lineSegments position={[0, 0.4, 0.05]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, 4, 0, 0]), 3]}
            count={2}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FF6B00" transparent opacity={0.18} depthWrite={false} />
      </lineSegments>

      {/* ── Deliverable 01 — Z=-0.05 ── */}
      <GiftIcon position={[0.0, -0.13]} z={-0.05} />
      <Text
        font={FONT_HEADING}
        fontSize={0.14}
        position={[0.2, 0.0, -0.05]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {'1. Scan Your Business (Free)'}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.11}
        position={[0.2, -0.26, -0.05]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={3.8}
        lineHeight={1.4}
      >
        {'We run your website through our Brand DNA system. In 3 minutes, we extract your colors, voice, imagery, and market positioning.'}
      </Text>

      {/* ── Deliverable 02 ── */}
      <GiftIcon position={[0.0, -0.83]} z={-0.15} />
      <Text
        font={FONT_HEADING}
        fontSize={0.14}
        position={[0.2, -0.7, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {'2. Build You 2 Weeks of Content (Free)'}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.11}
        position={[0.2, -0.96, -0.15]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={3.8}
        lineHeight={1.4}
      >
        {'Using your Brand DNA, we generate 14 days of ready-to-post social media content \u2014 branded graphics, captions in your voice, hashtags targeting your local market.'}
      </Text>

      {/* ── Deliverable 03 ── */}
      <GiftIcon position={[0.0, -1.53]} z={-0.25} />
      <Text
        font={FONT_HEADING}
        fontSize={0.14}
        position={[0.2, -1.4, -0.25]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {'3. Show You What AI Says About You (Free)'}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.11}
        position={[0.2, -1.66, -0.25]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={3.8}
        lineHeight={1.4}
      >
        {'We run your business through ChatGPT, Perplexity, Google AI Overviews, and Claude. See exactly what AI recommends about businesses like yours.'}
      </Text>

      {/* ── Deliverable 04 ── */}
      <GiftIcon position={[0.0, -2.23]} z={-0.35} />
      <Text
        font={FONT_HEADING}
        fontSize={0.14}
        position={[0.2, -2.1, -0.35]}
        anchorX="left"
        anchorY="middle"
        color="#00E5FF"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.18}
        letterSpacing={0.01}
      >
        {'4. Give You Your AI Visibility Score (Free)'}
      </Text>
      <Text
        font={FONT_BODY}
        fontSize={0.11}
        position={[0.2, -2.36, -0.35]}
        anchorX="left"
        anchorY="middle"
        color="#E0E0EC"
        renderOrder={1}
        material-fog={true}
        material-transparent={true}
        material-opacity={0.25}
        maxWidth={3.8}
        lineHeight={1.4}
      >
        {'A detailed report showing where you rank in AI search, what\'s helping you, what\'s hurting you, and the steps to become #1.'}
      </Text>

      {/* ══════════════════════════════════════════════════
          Value box — wireframe border with pricing inside
          ══════════════════════════════════════════════════ */}
      {(() => {
        const bx = 0
        const by = -2.85
        const bw = 5.0
        const bh = 0.45
        const bz = -0.45
        return (
          <>
            {/* Border rectangle */}
            <lineSegments position={[bx, by, bz]} renderOrder={1}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([
                    0, 0, 0,  bw, 0, 0,
                    bw, 0, 0,  bw, -bh, 0,
                    bw, -bh, 0,  0, -bh, 0,
                    0, -bh, 0,  0, 0, 0,
                  ]), 3]}
                  count={8}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#252540" transparent opacity={0.4} depthWrite={false} />
            </lineSegments>

            {/* Vertical divider in the middle */}
            <lineSegments position={[bx + bw / 2, by - 0.06, bz]} renderOrder={1}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, 0, -(bh - 0.12), 0]), 3]}
                  count={2}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#252540" transparent opacity={0.3} depthWrite={false} />
            </lineSegments>

            {/* Left side — Total value */}
            <Text
              font={FONT_BODY}
              fontSize={0.07}
              position={[bx + bw / 4, by - 0.13, bz + 0.01]}
              anchorX="center"
              anchorY="middle"
              color="#6A6A8A"
              renderOrder={2}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.35}
            >
              Total value of this package:
            </Text>
            <Text
              font={FONT_HEADING}
              fontSize={0.15}
              position={[bx + bw / 4, by - 0.3, bz + 0.01]}
              anchorX="center"
              anchorY="middle"
              color="#FF6B00"
              renderOrder={2}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.55}
              letterSpacing={-0.02}
            >
              $2,500+
            </Text>
            {/* Strikethrough over $2,500+ */}
            <lineSegments position={[bx + bw / 4 - 0.45, by - 0.3, bz + 0.02]} renderOrder={3}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, 0.9, 0, 0]), 3]}
                  count={2}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#FF6B00" transparent opacity={0.3} depthWrite={false} />
            </lineSegments>

            {/* Right side — Your cost */}
            <Text
              font={FONT_BODY}
              fontSize={0.07}
              position={[bx + bw * 3 / 4, by - 0.13, bz + 0.01]}
              anchorX="center"
              anchorY="middle"
              color="#6A6A8A"
              renderOrder={2}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.35}
            >
              Your cost:
            </Text>
            <Text
              font={FONT_HEADING}
              fontSize={0.2}
              position={[bx + bw * 3 / 4, by - 0.3, bz + 0.01]}
              anchorX="center"
              anchorY="middle"
              color="#00E5FF"
              renderOrder={2}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.85}
              letterSpacing={-0.02}
              outlineWidth={0.005}
              outlineColor="#00E5FF"
              outlineOpacity={0.2}
            >
              $0
            </Text>
          </>
        )
      })()}

      {/* ══════════════════════════════════════════════════
          CTA buttons — side by side, matching value box width
          ══════════════════════════════════════════════════ */}
      {(() => {
        const bx = 0
        const btnH = 0.32
        const bz = -0.5
        const btnY = -3.5
        const gap = 0.12
        const b1w = 2.44
        const b2w = 2.44
        const b2x = bx + b1w + gap
        return (
          <>
            {/* Button 1 — GET MY FREE PACKAGE → */}
            <mesh position={[bx + b1w / 2, btnY - btnH / 2, bz]} renderOrder={1}>
              <planeGeometry args={[b1w, btnH]} />
              <meshBasicMaterial color="#FF6B00" transparent opacity={0.15} depthWrite={false} />
            </mesh>
            <lineSegments position={[bx, btnY, bz + 0.01]} renderOrder={2}>
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
              position={[bx + b1w / 2, btnY - btnH / 2, bz + 0.02]}
              anchorX="center"
              anchorY="middle"
              color="#FF6B00"
              renderOrder={3}
              material-fog={true}
              material-transparent={true}
              material-opacity={0.85}
              letterSpacing={0.04}
            >
              {'GET MY FREE PACKAGE \u2192'}
            </Text>

            {/* Button 2 — BOOK A 15-MIN CALL */}
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
              BOOK A 15-MIN CALL
            </Text>
          </>
        )
      })()}

    </group>
  )
}


// ── Diamond/Hourglass 3D shape ──

export default function OfferSection3D() {
  const groupRef = useRef<THREE.Group>(null!)

  const primary = useMemo(() => toBuffer([
    ...ring(4.5),
    ...ring(4.2),
    ...ring(3.0, 1.5),
    ...ring(1.2, 3.0),
    ...ring(3.0, -1.5),
    ...ring(1.2, -3.0),
  ]), [])

  const secondary = useMemo(() => toBuffer([
    ...ribs(4.5, 0, 3.0, 1.5, 12),
    ...ribs(3.0, 1.5, 1.2, 3.0, 8),
    ...ribs(4.5, 0, 3.0, -1.5, 12),
    ...ribs(3.0, -1.5, 1.2, -3.0, 8),
    ...dashedRing(3.8, 20, 0.55, 0.75),
    ...dashedRing(3.8, 20, 0.55, -0.75),
    ...dashedRing(2.0, 14, 0.55, 2.25),
    ...dashedRing(2.0, 14, 0.55, -2.25),
  ]), [])

  const detail = useMemo(() => toBuffer([
    ...ticks(4.5, 120, 0.10, 0, 10, 0.22),
    ...ticks(3.0, 60, 0.08, 1.5),
    ...ticks(3.0, 60, 0.08, -1.5),
    ...crosshair(0.8, 0.1, 3.0),
    ...crosshair(0.8, 0.1, -3.0),
    ...brackets(5.2, 0.45),
    ...brackets(1.8, 0.3, 3.0),
    ...brackets(1.8, 0.3, -3.0),
  ]), [])

  const accents = useMemo(() => toBuffer([
    ...arc(4.4, 0.3, 1.1),
    ...arc(4.4, Math.PI + 0.3, Math.PI + 1.1),
    ...arc(2.8, 0.6, 1.4, 1.5),
    ...arc(2.8, Math.PI + 0.6, Math.PI + 1.4, 1.5),
    ...arc(2.8, 0.6, 1.4, -1.5),
    ...arc(2.8, Math.PI + 0.6, Math.PI + 1.4, -1.5),
  ]), [])

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y -= 0.002
  })

  return (
    <>
      {/* Text block — left side, fixed in 3D space */}
      <OfferText />

      {/* Diamond shape — camera sweeps right and flies through it */}
      <group position={[3.5, 0.8, Z]}>
        <group ref={groupRef} rotation={[0.2, 0, 0]}>
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
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.04} depthWrite={false} />
          </lineSegments>

          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[accents, 3]} count={accents.length / 3} />
            </bufferGeometry>
            <lineBasicMaterial color="#FF6B00" transparent opacity={0.20} depthWrite={false} />
          </lineSegments>

          {/* Vertical center line — blue */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[new Float32Array([0, -3.0, 0, 0, 3.0, 0]), 3]} count={2} />
            </bufferGeometry>
            <lineBasicMaterial color="#00E5FF" transparent opacity={0.20} depthWrite={false} />
          </lineSegments>

          {/* Typographic fill — dense lines, alternating blue/orange, varied size per ring */}
          <TextRing y={2.5} r={0.3} count={4} size={0.055} color="#FF6B00" op={0.22}
            words={['FREE', 'PACKAGE.', 'FREE', 'PACKAGE.']} />
          <TextRing y={2.0} r={0.7} count={8} size={0.06} color="#FF6B00" op={0.22}
            words={['BEFORE', 'YOU', 'PAY', 'US', 'A', 'DIME.', 'BEFORE', 'YOU']} />
          <TextRing y={1.4} r={1.2} count={8} size={0.07} color="#FF6B00" op={0.2}
            words={['SCAN', 'YOUR', 'BUSINESS', '(FREE).', 'SCAN', 'YOUR', 'BUSINESS', '(FREE).']} />
          <TextRing y={0.7} r={1.8} count={12} size={0.08} color="#FF6B00" op={0.2}
            words={['BUILD', 'YOU', '2', 'WEEKS', 'OF', 'CONTENT', '(FREE).', 'BUILD', 'YOU', '2', 'WEEKS', 'OF']} />
          <TextRing y={0} r={2.3} count={16} size={0.12} color="#FF6B00" op={0.22}
            words={['FREE.', 'GET', 'MY', 'FREE', 'PACKAGE.', 'BOOK', 'A', '15', 'MIN', 'CALL.', 'FREE.', 'GET', 'MY', 'FREE', 'PACKAGE.', 'BOOK']} />
          <TextRing y={-0.7} r={1.8} count={12} size={0.08} color="#FF6B00" op={0.2}
            words={['SHOW', 'YOU', 'WHAT', 'AI', 'SAYS', 'ABOUT', 'YOU.', 'SHOW', 'YOU', 'WHAT', 'AI']} />
          <TextRing y={-1.4} r={1.2} count={10} size={0.07} color="#FF6B00" op={0.2}
            words={['GIVE', 'YOU', 'YOUR', 'FREE', 'AI', 'VISIBILITY', 'SCORE.', 'GIVE', 'YOU', 'YOUR']} />
          <TextRing y={-2.0} r={0.7} count={8} size={0.06} color="#FF6B00" op={0.22}
            words={['BEFORE', 'YOU', 'PAY', 'US', 'A', 'DIME.', 'BEFORE', 'YOU']} />
          <TextRing y={-2.5} r={0.3} count={6} size={0.055} color="#FF6B00" op={0.22}
            words={['FREE', 'PACKAGE.', 'FREE', 'PACKAGE.', 'FREE', 'PACKAGE.']} />
        </group>
      </group>
    </>
  )
}
