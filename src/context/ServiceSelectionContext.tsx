import React, { createContext, useContext, useState, useCallback } from 'react'

export interface TierData {
  id: string
  tag: string
  name: string
  price: string
  duration: string
  desc: string
  features: string[]
  roi: string
  featured: boolean
}

export const TIERS: TierData[] = [
  {
    id: 'tier1', tag: 'TIER_01', name: 'AI Foundations', price: '$1.5K–$3K', duration: '2–4 weeks',
    desc: 'Perfect for businesses new to AI. We introduce you to the basics and help you implement immediate wins.',
    features: ['AI readiness assessment', 'Tool recommendations', 'Custom SOPs', 'Team training'],
    roi: '2–3x / Year 1', featured: false,
  },
  {
    id: 'tier2', tag: 'TIER_02', name: 'Workflow Automation', price: '$3K–$10K', duration: '4–8 weeks',
    desc: 'Ready to scale? We automate your core workflows and integrate your systems for seamless operations.',
    features: ['Workflow analysis & optimization', 'System integrations (CRM, PM, etc.)', 'Custom automation (3 processes)', 'AI-assisted operations'],
    roi: '3–5x / Year 1', featured: true,
  },
  {
    id: 'tier3', tag: 'TIER_03', name: 'Agentic AI', price: '$10K–$30K+', duration: '8–16 weeks',
    desc: 'Full transformation. We design and deploy custom AI agents to create a truly lean, autonomous operation.',
    features: ['Business process re-engineering', 'Custom AI agent development', 'Autonomous workflows', 'Lean-office transformation'],
    roi: '5–10x / Year 1', featured: false,
  },
]

interface ServiceSelectionContextValue {
  selectedTier: TierData | null
  selectTier: (id: string) => void
  clearSelection: () => void
}

const ServiceSelectionContext = createContext<ServiceSelectionContextValue>({
  selectedTier: null,
  selectTier: () => {},
  clearSelection: () => {},
})

export function ServiceSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedTier, setSelectedTier] = useState<TierData | null>(null)

  const selectTier = useCallback((id: string) => {
    const tier = TIERS.find(t => t.id === id) || null
    setSelectedTier(tier)
  }, [])

  if (typeof window !== 'undefined') {
    (window as any).__selectTier = selectTier
  }

  const clearSelection = useCallback(() => {
    setSelectedTier(null)
  }, [])

  return (
    <ServiceSelectionContext.Provider value={{ selectedTier, selectTier, clearSelection }}>
      {children}
    </ServiceSelectionContext.Provider>
  )
}

export function useServiceSelection() {
  return useContext(ServiceSelectionContext)
}
