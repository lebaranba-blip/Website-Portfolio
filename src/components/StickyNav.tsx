"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { MenuBar } from "@/components/ui/glow-menu"
import MagneticWrapper from "@/components/MagneticWrapper"
import { TELEGRAM_URL, NAV_ITEMS, EASE_DEFAULT } from "@/lib/constants"

export default function StickyNav() {
  const [visible, setVisible] = useState(false)
  const [activeItem, setActiveItem] = useState<string | undefined>()
  const [mobileOpen, setMobileOpen] = useState(false)
  const prefersReduced = useReducedMotion()

  // Show/hide nav on scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Closest section to viewport center — с RAF throttle
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const center = window.innerHeight / 2
        let closest: string | undefined
        let minDist = Infinity
        NAV_ITEMS.forEach((item) => {
          const el = document.getElementById(item.sectionId)
          if (!el) return
          const rect = el.getBoundingClientRect()
          const dist = Math.abs(rect.top + rect.height / 2 - center)
          if (dist < minDist) { minDist = dist; closest = item.label }
        })
        if (closest) setActiveItem(closest)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Scroll lock при открытом мобильном меню
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-3"
            style={{
              background: "rgba(237, 234, 228, 0.72)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
            suppressHydrationWarning
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_DEFAULT }}
          >
            {/* Spacer left (keeps menu centered) */}
            <div className="w-24 hidden md:block" />

            {/* Desktop GlowMenu — center */}
            <div className="hidden md:block">
              <MenuBar
                items={NAV_ITEMS}
                activeItem={activeItem}
                onItemClick={(label, href) => {
                  setActiveItem(label)
                  const lenis = (window as unknown as { lenis?: { scrollTo: (target: string, opts?: object) => void } }).lenis
                  if (lenis && href) {
                    lenis.scrollTo(href, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
                  }
                }}
              />
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex justify-end w-24">
              <MagneticWrapper>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  Написать
                </a>
              </MagneticWrapper>
            </div>

            {/* Mobile: burger */}
            <div className="flex md:hidden w-full items-center justify-between">
              <a href="#hero" className="font-black text-lg tracking-tighter" style={{ color: "var(--text)" }}>
                DM
              </a>
              <button
                className="flex flex-col gap-1.5 p-2 -mr-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={mobileOpen}
              >
                <span className="block w-6 h-0.5 transition-all duration-300" style={{ background: "var(--text)", transform: mobileOpen ? "rotate(45deg) translateY(8px)" : "rotate(0deg) translateY(0)" }} />
                <span className="block w-6 h-0.5 transition-all duration-300" style={{ background: "var(--text)", opacity: mobileOpen ? 0 : 1 }} />
                <span className="block w-6 h-0.5 transition-all duration-300" style={{ background: "var(--text)", transform: mobileOpen ? "rotate(-45deg) translateY(-8px)" : "rotate(0deg) translateY(0)" }} />
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && visible && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
            style={{ background: "var(--bg)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="text-4xl font-light transition-opacity hover:opacity-50"
                style={{ color: "var(--text)" }}
                onClick={(e) => {
                  e.preventDefault()
                  setMobileOpen(false)
                  const lenis = (window as unknown as { lenis?: { scrollTo: (target: string, opts?: object) => void } }).lenis
                  if (lenis) lenis.scrollTo(item.href, { duration: 1.2 })
                  else document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" })
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 + 0.1, duration: 0.5 }}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              Написать в Telegram
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
