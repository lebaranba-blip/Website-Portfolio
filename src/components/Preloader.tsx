"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(true)
  // guard — onComplete вызывается строго один раз
  const completedRef = useRef(false)

  const safeComplete = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    onComplete()
  }, [onComplete])

  useEffect(() => {
    // Пропускаем прелоадер при повторных посещениях в той же сессии
    if (sessionStorage.getItem("preloader-done")) {
      setVisible(false)
      safeComplete()
      return
    }

    const duration = 2000
    const interval = 16
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current += 1
      const progress = current / steps
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.min(Math.round(eased * 100), 100))

      if (current >= steps) {
        clearInterval(timer)
        sessionStorage.setItem("preloader-done", "1")
        setTimeout(() => setVisible(false), 400)
      }
    }, interval)

    // hard fallback — если AnimatePresence не вызовет onExitComplete
    const hardFallback = setTimeout(() => safeComplete(), 4000)

    return () => {
      clearInterval(timer)
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
        >
          {/* grain из globals.css body::before покрывает preloader автоматически */}

          {/* top-left: wordmark */}
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
              AI & Design
            </motion.span>
          </div>

          {/* center: counter */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative" aria-live="polite" aria-label={`Загрузка ${count}%`}>
              {/* background giant number */}
              <div
                className="text-[13vw] font-black leading-none select-none"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: "linear-gradient(135deg, #0891B2 0%, #EA580C 50%, #1D4ED8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  opacity: 0.15,
                }}
                aria-hidden="true"
              >
                {String(count).padStart(3, "0")}
              </div>

              {/* foreground counter */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[11vw] font-black leading-none tabular-nums"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    background: "linear-gradient(135deg, #0891B2 0%, #EA580C 60%, #1D4ED8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {String(count).padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* bottom bar: progress line + label */}
          <div className="px-8 pb-10 flex flex-col gap-4">
            {/* progress bar */}
            <div className="h-px w-full bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #0891B2, #EA580C)",
                  width: `${count}%`,
                }}
                transition={{ ease: "linear" }}
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
                className="text-xs tabular-nums text-white/30"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                {count}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
