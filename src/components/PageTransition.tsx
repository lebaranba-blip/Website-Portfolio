"use client"
import { useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useReducedSafe } from "@/lib/use-reduced"

/**
 * Shutter between pages. An internal link click closes two letterbox bars
 * over the screen with a thin light seam in the middle, the route changes
 * behind them, then the bars open on the new page — a cut, not a reload.
 * Reduced motion: a short dip to black instead of moving bars.
 */
type Phase = "idle" | "closing" | "closed" | "opening"
const CLOSE_MS = 520

export default function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const reduced = useReducedSafe()
  const [phase, setPhase] = useState<Phase>("idle")
  const pending = useRef<string | null>(null)
  const first = useRef(true)

  // Intercept internal navigations
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const href = a.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      if (/\.(pdf|mp4|webp|jpg|png)$/i.test(url.pathname)) return
      e.preventDefault()
      e.stopPropagation()
      pending.current = url.pathname + url.search + url.hash
      setPhase("closing")
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  // Closed → change route
  useEffect(() => {
    if (phase !== "closing") return
    const t = setTimeout(() => {
      setPhase("closed")
      if (pending.current) router.push(pending.current)
    }, reduced ? 180 : CLOSE_MS)
    return () => clearTimeout(t)
  }, [phase, reduced, router])

  // New route mounted → open
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (phase === "idle") return
    const hash = pending.current?.split("#")[1]
    pending.current = null
    requestAnimationFrame(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView()
      else window.scrollTo(0, 0)
      setPhase("opening")
    })
    const t = setTimeout(() => setPhase("idle"), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const shut = phase === "closing" || phase === "closed"
  const ease = [0.76, 0, 0.24, 1] as const

  if (reduced) {
    return (
      <motion.div
        className="fixed inset-0 z-[95] pointer-events-none"
        style={{ background: "#050506" }}
        initial={false}
        animate={{ opacity: shut ? 1 : 0 }}
        transition={{ duration: 0.18 }}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none" aria-hidden="true" style={{ visibility: phase === "idle" ? "hidden" : "visible" }}>
      <motion.div
        className="absolute left-0 right-0 top-0 h-1/2 origin-top"
        style={{ background: "#050506" }}
        initial={false}
        animate={{ scaleY: shut ? 1 : 0 }}
        transition={{ duration: shut ? CLOSE_MS / 1000 : 0.75, ease }}
      />
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-1/2 origin-bottom"
        style={{ background: "#050506" }}
        initial={false}
        animate={{ scaleY: shut ? 1 : 0 }}
        transition={{ duration: shut ? CLOSE_MS / 1000 : 0.75, ease }}
      />
      {/* Light seam where the bars meet */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-px origin-center"
        style={{ background: "linear-gradient(90deg, transparent, var(--cyan), var(--orange), var(--blue), transparent)", boxShadow: "0 0 24px rgba(8,145,178,0.8)" }}
        initial={false}
        animate={{ scaleX: phase === "closed" ? 1 : 0, opacity: phase === "closed" ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
      />
    </div>
  )
}
