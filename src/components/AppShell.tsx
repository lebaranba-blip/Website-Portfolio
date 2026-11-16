"use client"
import { useState, useEffect } from "react"
import SmoothScroll from "@/components/SmoothScroll"
import CustomCursor from "@/components/CustomCursor"
import ScrollProgress from "@/components/ScrollProgress"
import { PreloaderContext } from "@/lib/preloader-context"
import { LanguageProvider } from "@/lib/language-context"

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const preloaderDone = true

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <LanguageProvider>
      <PreloaderContext.Provider value={preloaderDone}>
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
