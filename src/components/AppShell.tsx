"use client"
import { useState, useCallback, useEffect } from "react"
import Preloader from "@/components/Preloader"
import SmoothScroll from "@/components/SmoothScroll"
import CustomCursor from "@/components/CustomCursor"
import ScrollProgress from "@/components/ScrollProgress"
import { PreloaderContext } from "@/lib/preloader-context"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  // Always false on server — synced from sessionStorage after mount to avoid hydration mismatch
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (sessionStorage.getItem("preloader-done")) {
      setPreloaderDone(true)
    }
  }, [])

  const handleComplete = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  return (
    <PreloaderContext.Provider value={preloaderDone}>
      <Preloader onComplete={handleComplete} />
      <SmoothScroll>
        {mounted && preloaderDone && (
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
