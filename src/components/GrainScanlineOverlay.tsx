export default function GrainScanlineOverlay() {
  return (
    <>
      {/* Grain overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 2,
          pointerEvents: 'none',
          opacity: 0.025,
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0 }}>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Scanline overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 3,
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
          backgroundSize: '100% 4px',
        }}
      />
    </>
  )
}
