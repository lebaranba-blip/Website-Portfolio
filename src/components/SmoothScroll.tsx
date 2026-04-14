"use client"
import { LenisContext } from "@/lib/lenis-context"

export default function SmoothScroll({ children }: { children?: React.ReactNode }) {
  return (
    <LenisContext.Provider value={null}>
      {children}
    </LenisContext.Provider>
  )
}
