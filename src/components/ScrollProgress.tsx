"use client"
import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      bar.style.transform = `scaleX(${progress})`
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 99999,
        pointerEvents: "none",
        background: "var(--surface-2)",
      }}
    >
      <div
        ref={barRef}
        style={{
          height: "100%",
          background: "linear-gradient(90deg, var(--cyan), var(--orange))",
          transformOrigin: "left",
          transform: "scaleX(0)",
          willChange: "transform",
        }}
      />
    </div>
  )
}
