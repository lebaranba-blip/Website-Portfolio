"use client"
import { useEffect, useState } from "react"
import Lenis from "lenis"
import { LenisContext } from "@/lib/lenis-context"

export default function SmoothScroll({ children }: { children?: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.04,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      overscroll: false,
    })

    setLenis(instance)
    ;(window as unknown as { lenis?: Lenis }).lenis = instance

    let rafId: number
    const raf = (time: number) => {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      instance.destroy()
      delete (window as unknown as { lenis?: Lenis }).lenis
      setLenis(null)
    }
  }, [])

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  )
}
