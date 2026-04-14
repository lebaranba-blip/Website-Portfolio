"use client"
import { useEffect, useRef } from "react"
import { useLenis } from "@/lib/lenis-context"

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const bar = barRef.current
    if (!bar) return

    const update = (scrolled: number) => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      bar.style.transform = `scaleX(${progress})`
    }

    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => update(scroll)
      lenis.on("scroll", onLenisScroll)
      return () => lenis.off("scroll", onLenisScroll)
    }

    // Fallback — touch devices where Lenis is disabled
    const onNativeScroll = () => update(window.scrollY)
    window.addEventListener("scroll", onNativeScroll, { passive: true })
    return () => window.removeEventListener("scroll", onNativeScroll)
  }, [lenis])

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
