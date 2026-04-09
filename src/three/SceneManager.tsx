import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import CameraRig from './CameraRig'
import WorldEnvironment from './WorldEnvironment'
import HeroSection3D from './sections3D/HeroSection3D'
import ProblemSection3D from './sections3D/ProblemSection3D'
import OfferSection3D from './sections3D/OfferSection3D'
import ServicesSection3D from './sections3D/ServicesSection3D'
import IndustriesSection3D from './sections3D/IndustriesSection3D'
import SocialSection3D from './sections3D/SocialSection3D'
import AboutSection3D from './sections3D/AboutSection3D'
import ContactSection3D from './sections3D/ContactSection3D'
interface Props {
  bloomEnabled?: boolean
  nodeBase?: number
}

export default function SceneManager({ bloomEnabled = true, nodeBase = 80 }: Props) {
  return (
    <>
      <color attach="background" args={['#0A0A0F']} />
      <fog attach="fog" args={['#0A0A0F', 10, 36]} />

      <CameraRig />

      {/* Sparse ambient particles — architecture is now the star, not the particle cloud */}
      <WorldEnvironment particleCount={nodeBase >= 80 ? 180 : 100} />

      {/* GridFloor removed — per-section floors handle their own ground */}

      {/* All 8 content zones — always in world, camera flies through them */}
      {/* Sections with CDN textures get their own Suspense to avoid blocking Text */}
      <Suspense fallback={null}>
        <HeroSection3D />
      </Suspense>
      <Suspense fallback={null}>
        <AboutSection3D />
      </Suspense>

      {/* Sections with 3D Text get isolated Suspense */}
      <Suspense fallback={null}>
        <OfferSection3D />
      </Suspense>

      {/* Pure geometry sections */}
      <ProblemSection3D />
      <ServicesSection3D />
      <Suspense fallback={null}>
        <IndustriesSection3D />
      </Suspense>
      <Suspense fallback={null}>
        <SocialSection3D />
      </Suspense>
      <ContactSection3D />

      {bloomEnabled ? (
        <EffectComposer>
          <Bloom intensity={0.08} luminanceThreshold={0.8} luminanceSmoothing={0.02} />
          <Vignette darkness={0.45} offset={0.5} />
        </EffectComposer>
      ) : (
        <EffectComposer>
          <Vignette darkness={0.45} offset={0.5} />
        </EffectComposer>
      )}
    </>
  )
}
