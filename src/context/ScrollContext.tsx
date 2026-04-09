import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

export const SCROLL_PAGES = 12
export const FLAME_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663387224517/jub4jdiQA2cL5JLPsWtMq2/digital-flame-circle-transparent_b225caae.png'

const SMOOTH_FACTOR = 0.12

interface ScrollContextValue {
  progress: number
  scrollY: number
}

const ScrollContext = createContext<ScrollContextValue>({ progress: 0, scrollY: 0 })

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const rawProgressRef = useRef(0)
  const smoothProgressRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const loopRef = useRef<number>(0)

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      rawProgressRef.current = maxScroll > 0 ? Math.min(Math.max(sy / maxScroll, 0), 1) : 0
      setScrollY(sy)
    }

    // Continuous RAF loop for exponential smoothing
    const loop = () => {
      const now = performance.now()
      const delta = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      const raw = rawProgressRef.current
      const smooth = smoothProgressRef.current
      const f = 1 - Math.pow(1 - SMOOTH_FACTOR, delta * 60)
      const next = smooth + (raw - smooth) * f

      if (Math.abs(next - smooth) > 0.0001) {
        smoothProgressRef.current = next
        setProgress(next)
      } else if (Math.abs(raw - smooth) > 0.0001) {
        // Snap when very close
        smoothProgressRef.current = raw
        setProgress(raw)
      }

      loopRef.current = requestAnimationFrame(loop)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    loopRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (loopRef.current) cancelAnimationFrame(loopRef.current)
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
