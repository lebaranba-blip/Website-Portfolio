"use client"
import { useEffect, useRef } from "react"

/**
 * Fades children marked with [data-reveal] up into place as they enter the
 * viewport, one after another. The container itself never animates.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = [...root.querySelectorAll<HTMLElement>("[data-reveal]")]
    items.forEach((el, i) => { el.style.setProperty("--reveal-d", `${(i % 6) * 70}ms`); el.dataset.reveal = "out" })
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { (e.target as HTMLElement).dataset.reveal = "in"; io.unobserve(e.target) }
    }, { rootMargin: "0px 0px -8% 0px" })
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return ref
}
