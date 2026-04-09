import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollProvider, useScroll, SCROLL_PAGES } from './context/ScrollContext'
import { ServiceSelectionProvider } from './context/ServiceSelectionContext'
import { useGpuTier } from './hooks/useGpuTier'
import SceneManager from './three/SceneManager'
// Navigation removed
import LoadingScreen from './components/LoadingScreen'
// GrainScanlineOverlay removed for cleaner look
import SeoContent from './components/SeoContent'
import ContentOverlay from './components/ContentOverlay'

function AppInner() {
  const { progress, scrollY } = useScroll()
  const gpuConfig = useGpuTier()
  const [canvasReady, setCanvasReady] = useState(false)

  const handleCreated = useCallback(() => {
    setTimeout(() => setCanvasReady(true), 400)
  }, [])

  return (
    <>
      {/* Scroll space — creates the tall scrollable area */}
      <div style={{ height: `${SCROLL_PAGES * 100}vh`, position: 'relative', zIndex: -1 }} />

      {/* R3F Canvas — fixed full-screen background */}
      <Canvas
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
        dpr={gpuConfig.dpr}
        camera={{ fov: 55, near: 0.1, far: 400 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
        }}
        onCreated={handleCreated}
      >
        <Suspense fallback={null}>
          <SceneManager bloomEnabled={gpuConfig.bloomEnabled} nodeBase={gpuConfig.nodeBase} />
        </Suspense>
      </Canvas>

      {/* Grain + scanline overlays removed for cleaner look */}

      {/* Content overlay — minimal floating text, no cards */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 10,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <ContentOverlay progress={progress} />
      </div>

      {/* Navigation removed */}

      {/* Loading screen */}
      <LoadingScreen ready={canvasReady} />

      {/* SEO content — visually hidden but crawlable */}
      <SeoContent />
    </>
  )
}

export default function App() {
  return (
    <ScrollProvider>
      <ServiceSelectionProvider>
        <AppInner />
      </ServiceSelectionProvider>
    </ScrollProvider>
  )
}
