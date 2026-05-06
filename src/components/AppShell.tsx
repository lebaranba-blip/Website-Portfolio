"use client"
import { useState, useCallback } from "react"
import Preloader from "@/components/Preloader"
import SmoothScroll from "@/components/SmoothScroll"
import CustomCursor from "@/components/CustomCursor"
import ScrollProgress from "@/components/ScrollProgress"
import { PreloaderContext } from "@/lib/preloader-context"

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Init as true immediately if preloader was already shown this session —
  // avoids a flash where Hero renders with opacity:0 before setState fires
  const [preloaderDone, setPreloaderDone] = useState(() =>
    typeof window !== "undefined" && !!sessionStorage.getItem("preloader-done")
  )

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
