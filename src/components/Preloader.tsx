"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)
  const completedRef = useRef(false)
  const bgNumRef = useRef<HTMLDivElement>(null)
  const fgNumRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const liveRef = useRef<HTMLDivElement>(null)

  const safeComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    let skip = false
    try { skip = !!sessionStorage.getItem("preloader-done") } catch {}
    if (skip) {
      setVisible(false)
      safeComplete()
      return
    }

    const duration = 1200
    const start = performance.now()
    let raf = 0
    let lastDisplayed = -1

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const value = Math.min(Math.round(eased * 100), 100)

      if (value !== lastDisplayed) {
        lastDisplayed = value
        const text = String(value).padStart(3, "0")
        if (bgNumRef.current) bgNumRef.current.textContent = text
        if (fgNumRef.current) fgNumRef.current.textContent = text
        if (labelRef.current) labelRef.current.textContent = `${value}%`
        if (liveRef.current) liveRef.current.setAttribute("aria-label", `Загрузка ${value}%`)
        if (barRef.current) barRef.current.style.width = `${value}%`
      }

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        try { sessionStorage.setItem("preloader-done", "1") } catch {}
        setTimeout(() => setVisible(false), 200)
      }
    }

    raf = requestAnimationFrame(tick)
    const hardFallback = setTimeout(() => {
      setVisible(false)
      safeComplete()
    }, 4500)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hardFallback)
    }
  }, [safeComplete])

  return (
    <AnimatePresence onExitComplete={safeComplete} mode="wait">
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={(def) => { if (def === "exit") safeComplete() }}
        >
          <div className="flex items-center justify-between px-8 pt-8">
            <motion.span
              className="font-black text-lg tracking-tighter text-white/80"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Дмитрий
            </motion.span>
            <motion.span
              className="text-xs tracking-widest uppercase text-white/30"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              AI Director & Visual Artist
            </motion.span>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div ref={liveRef} className="relative" aria-live="polite" aria-label="Загрузка 0%">
              <span
                ref={fgNumRef}
                className="text-[11vw] font-black leading-none tabular-nums select-none"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: "linear-gradient(135deg, #22D3EE 0%, #FB923C 60%, #60A5FA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                }}
              >
                000
              </span>
              <div ref={bgNumRef} aria-hidden="true" style={{ display: "none" }} />
            </div>
          </div>

          <div className="px-8 pb-10 flex flex-col gap-4">
            <div className="h-px w-full bg-white/10 overflow-hidden rounded-full">
              <div
                ref={barRef}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #22D3EE, #FB923C)",
                  width: "0%",
                  willChange: "width",
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <motion.span
                className="text-xs tracking-widest uppercase text-white/30"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Загрузка
              </motion.span>
              <span
                ref={labelRef}
                className="text-xs tabular-nums text-white/30"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                0%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
