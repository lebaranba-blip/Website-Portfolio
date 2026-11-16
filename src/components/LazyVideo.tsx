"use client"
import { useEffect, useRef, useState } from "react"

/**
 * A muted loop that costs nothing until it is needed: the file is requested
 * when the element gets near the viewport, plays only while on screen, and
 * stays on its poster for visitors who asked for reduced motion.
 */
export default function LazyVideo({ src, poster, className, style }: {
  src: string
  poster?: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const visible = useRef(false)
  const still = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const load = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); load.disconnect() } }, { rootMargin: "60% 0px" })
    const play = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting
      if (e.isIntersecting && !still.current) { el.muted = true; el.play().catch(() => {}) }
      else el.pause()
    }, { threshold: 0.15 })
    load.observe(el)
    play.observe(el)
    return () => { load.disconnect(); play.disconnect() }
  }, [])

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      // The file may arrive after the play request (fast scroll) — start once it can
      onCanPlay={(e) => { if (visible.current && !still.current && e.currentTarget.paused) { e.currentTarget.muted = true; e.currentTarget.play().catch(() => {}) } }}
      className={className}
      style={style}
    />
  )
}
