"use client"
import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import MagneticWrapper from "@/components/MagneticWrapper"
import { MenuBar } from "@/components/ui/glow-menu"
import LanguageToggle from "@/components/ui/language-toggle"
import { TELEGRAM_URL, getNavItems, EASE_DEFAULT } from "@/lib/constants"
import { useLenis } from "@/lib/lenis-context"
import { useDict } from "@/lib/language-context"
import { commonDict } from "@/dictionaries/common"

export default function StickyNav() {
  const [visible, setVisible] = useState(false)
  const [activeItem, setActiveItem] = useState<string | undefined>()
  const prefersReduced = useReducedMotion()
  const lenis = useLenis()
  const t = useDict(commonDict)
  const navItems = useMemo(() => getNavItems(t.nav), [t])

  useEffect(() => {
    const threshold = window.innerHeight * 0.85
    const onScroll = (scroll: number) => setVisible(scroll > threshold)

    if (lenis) {
      const handler = ({ scroll }: { scroll: number }) => onScroll(scroll)
      lenis.on("scroll", handler)
      return () => lenis.off("scroll", handler)
    }

    const nativeHandler = () => onScroll(window.scrollY)
    window.addEventListener("scroll", nativeHandler, { passive: true })
    return () => window.removeEventListener("scroll", nativeHandler)
  }, [lenis])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    navItems.forEach((item) => {
      const el = document.getElementById(item.sectionId)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveItem(item.sectionId) },
        { threshold: 0.35, rootMargin: "-10% 0px -55% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [navItems])

  const scrollTo = (href: string, sectionId: string) => {
    setActiveItem(sectionId)
    if (lenis) lenis.scrollTo(href, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* ── Desktop sticky top nav ── */}
      <AnimatePresence>
        {visible && (
          <motion.header
            className="fixed top-0 left-0 right-0 z-50 hidden md:grid items-center px-6 md:px-10 py-3"
            style={{
              background: "rgba(11, 11, 13, 0.72)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              gridTemplateColumns: "1fr auto 1fr",
            }}
            suppressHydrationWarning
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_DEFAULT }}
          >
            <div />

            <MenuBar
              items={navItems}
              activeItem={activeItem}
              onItemClick={(id, href) => scrollTo(href ?? "", id)}
            />

            <div className="flex justify-end items-center gap-3">
              <LanguageToggle dark />
              <MagneticWrapper>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs px-5 py-2.5"
                >
                  {t.write}
                </a>
              </MagneticWrapper>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom nav ── */}
      <nav className="mobile-bottom-nav md:hidden" aria-label={t.navAriaLabel}>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeItem === item.sectionId
          return (
            <button
              key={item.sectionId}
              onClick={() => scrollTo(item.href, item.sectionId)}
              className="flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px] transition-all duration-200"
              style={{ opacity: isActive ? 1 : 0.4, color: isActive ? "var(--cyan)" : "var(--text)" }}
              aria-label={item.label}
            >
              <Icon size={20} />
              <span className="font-mono text-[9px] tracking-[0.12em] uppercase">{item.label}</span>
            </button>
          )
        })}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 flex-1 min-h-[44px]"
          style={{ color: "var(--cyan)" }}
          aria-label="Telegram"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
          </svg>
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase">TG</span>
        </a>
      </nav>
    </>
  )
}
