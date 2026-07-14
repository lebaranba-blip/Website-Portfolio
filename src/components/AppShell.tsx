"use client"
import { useState, useCallback, useEffect } from "react"
import Preloader from "@/components/Preloader"
import SmoothScroll from "@/components/SmoothScroll"
import CustomCursor from "@/components/CustomCursor"
import ScrollProgress from "@/components/ScrollProgress"
import { PreloaderContext } from "@/lib/preloader-context"
import { LanguageProvider } from "@/lib/language-context"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      if (sessionStorage.getItem("preloader-done")) {
        setPreloaderDone(true)
      }
    } catch {}
  }, [])

  const handleComplete = useCallback(() => {
    setPreloaderDone(true)
  }, [])

  return (
    <LanguageProvider>
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
    </LanguageProvider>
  )
}
