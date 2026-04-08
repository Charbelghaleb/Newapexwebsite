import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export const SCROLL_PAGES = 8
export const FLAME_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663387224517/jub4jdiQA2cL5JLPsWtMq2/digital-flame-circle-transparent_b225caae.png'

interface ScrollContextValue {
  progress: number
  scrollY: number
}

const ScrollContext = createContext<ScrollContextValue>({ progress: 0, scrollY: 0 })

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const sy = window.scrollY
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const p = maxScroll > 0 ? Math.min(Math.max(sy / maxScroll, 0), 1) : 0
        setScrollY(sy)
        setProgress(p)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ progress, scrollY }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  return useContext(ScrollContext)
}
