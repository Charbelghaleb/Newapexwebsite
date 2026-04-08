export default function DiamondDivider() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0',
      margin: '16px 0', width: '100%', maxWidth: '360px',
    }}>
      {/* Left line — plasma gradient */}
      <div style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #00E5FF)',
      }} />

      {/* Diamond */}
      <div style={{
        width: '26px', height: '26px',
        position: 'relative',
        flexShrink: 0, margin: '0 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '16px', height: '16px',
          border: '1px solid #252540',
          transform: 'rotate(45deg)',
          position: 'absolute',
        }} />
        <div style={{
          width: '7px', height: '7px',
          background: '#FF6B00',
          borderRadius: '50%',
          position: 'relative', zIndex: 1,
          boxShadow: '0 0 6px rgba(255,107,0,0.5)',
        }} />
      </div>

      {/* Right line — fire gradient */}
      <div style={{
        flex: 1,
        height: '1px',
        background: 'linear-gradient(90deg, #FF6B00, transparent)',
      }} />
    </div>
  )
}
