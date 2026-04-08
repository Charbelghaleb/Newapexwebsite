import { useEffect, useState } from 'react'

interface Props {
  ready: boolean
}

export default function LoadingScreen({ ready }: Props) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + (ready ? 15 : 3)
        if (next >= 100) { clearInterval(interval); return 100 }
        return next
      })
    }, 80)
    return () => clearInterval(interval)
  }, [ready])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 600)
      return () => clearTimeout(timer)
    }
  }, [progress])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: '#0A0A0F',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '32px',
        transition: 'opacity 0.6s ease',
        opacity: progress >= 100 ? 0 : 1,
        pointerEvents: progress >= 100 ? 'none' : 'all',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 'clamp(1.2rem, 3vw, 2rem)',
          fontWeight: 800,
          color: '#00E5FF',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          animation: 'loadPulse 2s ease-in-out infinite',
        }}>
          APEX PROMETHEUS
        </div>
        <div style={{
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          color: '#6A6A8A',
          textTransform: 'uppercase',
        }}>
          INITIALIZING_SYSTEMS
        </div>
      </div>

      <div style={{ width: 'clamp(200px, 40vw, 320px)', position: 'relative' }}>
        <div style={{
          height: '1px',
          background: '#252540',
          borderRadius: '1px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: '#00E5FF',
            transition: 'width 0.1s ease',
            boxShadow: '0 0 8px rgba(0,229,255,0.6)',
          }} />
        </div>
        <div style={{
          marginTop: '8px',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: '0.6rem',
          color: '#6A6A8A',
          textAlign: 'right',
        }}>
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  )
}
