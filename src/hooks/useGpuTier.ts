import { useEffect, useState } from 'react'
import { getGPUTier } from 'detect-gpu'

export interface GpuConfig {
  nodeBase: number
  dpr: number
  bloomEnabled: boolean
  tier: number
}

const DEFAULT_CONFIG: GpuConfig = {
  nodeBase: 80,
  dpr: 1,
  bloomEnabled: true,
  tier: 2,
}

export function useGpuTier(): GpuConfig {
  const [config, setConfig] = useState<GpuConfig>(DEFAULT_CONFIG)

  useEffect(() => {
    getGPUTier().then((gpu) => {
      console.log('[Apex] GPU tier:', gpu.tier, gpu.gpu)
      if (gpu.tier >= 3) {
        setConfig({ nodeBase: 120, dpr: Math.min(window.devicePixelRatio, 2), bloomEnabled: true, tier: gpu.tier })
      } else if (gpu.tier >= 2) {
        setConfig({ nodeBase: 80, dpr: 1.5, bloomEnabled: true, tier: gpu.tier })
      } else {
        setConfig({ nodeBase: 40, dpr: 1, bloomEnabled: false, tier: gpu.tier })
      }
    }).catch(() => {
      setConfig(DEFAULT_CONFIG)
    })
  }, [])

  return config
}
