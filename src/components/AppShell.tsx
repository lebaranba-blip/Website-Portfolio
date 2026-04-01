"use client"
import { useState, useCallback } from "react"
import Preloader from "@/components/Preloader"
import SmoothScroll from "@/components/SmoothScroll"
import CustomCursor from "@/components/CustomCursor"
import ScrollProgress from "@/components/ScrollProgress"
import { PreloaderContext } from "@/lib/preloader-context"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false)

  const handleComplete = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  return (
    <PreloaderContext.Provider value={preloaderDone}>
      <Preloader onComplete={handleComplete} />
      <SmoothScroll>
        {preloaderDone && (
          <>
            <ScrollProgress />
            <CustomCursor />
          </>
        )}
        {children}
      </SmoothScroll>
    </PreloaderContext.Provider>
  )
}
