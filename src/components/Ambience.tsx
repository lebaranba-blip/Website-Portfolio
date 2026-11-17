"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Light leaks behind the whole page. Three blurred colour fields drift slowly;
 * which one glows depends on the section on screen, so scrolling the page
 * shifts its colour temperature like changing reels in a projector.
 * Only opacity and transform change. Under reduced motion the drift stops.
 */
const MOOD: Record<string, number> = { hero: 0, works: 1, process: 2, services: 0, about: 1, faq: 2, contact: 1 }

export default function Ambience() {
  const [mood, setMood] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const ids = Object.keys(MOOD)
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length) { setMood(1); return }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setMood(MOOD[e.target.id] ?? 0)
    }, { rootMargin: "-45% 0px -45% 0px" })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return (
    <div className="ambience" aria-hidden="true">
      <span className="amb amb-cyan" style={{ opacity: mood === 0 ? 1 : 0.25 }} />
      <span className="amb amb-orange" style={{ opacity: mood === 1 ? 1 : 0.2 }} />
      <span className="amb amb-blue" style={{ opacity: mood === 2 ? 1 : 0.25 }} />
    </div>
  )
}
