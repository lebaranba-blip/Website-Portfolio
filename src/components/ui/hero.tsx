"use client"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { usePreloaderDone } from "@/lib/preloader-context"
import { MenuBar } from "@/components/ui/glow-menu"
import { NAV_ITEMS, EASE_DEFAULT } from "@/lib/constants"
import TelegramButton from "@/components/ui/telegram-button"

const WebGLShader = dynamic(() => import("@/components/ui/web-gl-shader"), { ssr: false })

const STATS = [
  { num: 5, suffix: "+", label: "проектов" },
  { num: 2, suffix: "+", label: "года опыта" },
  { num: 100, suffix: "%", label: "AI-подход" },
]

function CountUp({ num, suffix, active, delay = 0 }: { num: number; suffix: string; active: boolean; delay?: number }) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!active || started.current) return
    started.current = true
    const duration = 2200
    const timer = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 4)
        setDisplay(Math.round(ease * num))
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(timer)
  }, [active, num, delay])

  return <>{display}{suffix}</>
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion()
  const [activeItem, setActiveItem] = useState<string | undefined>()
  const preloaderDone = usePreloaderDone()

  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0])

  return (
    <section
      id="hero"
      aria-label="Главная секция"
      style={{ height: "100dvh", minHeight: "640px" }}
      className="relative w-full overflow-hidden flex flex-col"
    >
      {/* ── WebGL Beam — depth-0, atmospheric ── */}
      <WebGLShader />

      {/* ── HEADER — desktop only ── */}
      <header className="relative z-20 flex items-center justify-center px-6 md:px-10 py-5 flex-shrink-0">
        {/* GlowMenu — center, desktop only */}
        <nav aria-label="Основная навигация" className="hidden md:block">
          <MenuBar
            items={NAV_ITEMS}
            activeItem={activeItem}
            onItemClick={(label, href) => {
              setActiveItem(label)
              const lenis = (window as unknown as { lenis?: { scrollTo: (target: string, opts?: object) => void } }).lenis
              if (lenis && href) lenis.scrollTo(href, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
              else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
            }}
          />
        </nav>
      </header>

      {/* ── CENTER CONTENT — depth-4 ── */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-6 -mt-20 md:mt-0">
        <motion.div
          className="flex flex-col items-center text-center"
          style={{ y: contentY, opacity: contentOpacity }}
          suppressHydrationWarning
        >
          {/* Live badge */}
          <motion.div
            className="flex items-center gap-2 mb-8"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <span className="relative flex h-2 w-2">
              <span className="live-dot-glow" aria-hidden="true" />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "var(--cyan)" }}
              />
            </span>
            <span
              className="font-mono text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              Открыт для проектов
            </span>
          </motion.div>

          {/* H1 — большой, по центру */}
          <h1
            className="mb-6"
            style={{ letterSpacing: "-0.04em", lineHeight: "1.05" }}
          >
            <motion.span
              className="block font-black text-[clamp(4rem,12vw,11rem)] gradient-text"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              initial="hidden"
              animate={preloaderDone ? "visible" : "hidden"}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              AI & Design
            </motion.span>
          </h1>

          {/* Subline */}
          <motion.p
            className="text-base md:text-lg font-mono max-w-md mb-10 leading-[1.6]"
            style={{ color: "var(--text)", opacity: 0.85 }}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 0.85, y: 0 } }}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            Делаю бизнес заметным: AI-визуал, брендинг, автоматизация.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="flex items-center justify-center mb-12"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <TelegramButton />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex items-center gap-8 md:gap-12"
            role="list"
            aria-label="Статистика"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            initial="hidden"
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.75, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col items-center"
                role="listitem"
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                initial="hidden"
                animate={preloaderDone ? "visible" : "hidden"}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.07, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                <span className="font-black text-xl leading-none" style={{ color: "var(--text)" }}>
                  <CountUp num={s.num} suffix={s.suffix} active={preloaderDone} delay={900 + i * 150} />
                </span>
                <span className="text-xs font-mono mt-1 opacity-40 tracking-wide">{s.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── BOTTOM FADE ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        aria-hidden="true"
      />

      {/* ── SCROLL INDICATOR ── */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5"
        aria-hidden="true"
      >
        <span
          className="text-[0.5rem] font-mono tracking-[0.3em] uppercase"
          style={{ color: "var(--muted)", opacity: 0.35 }}
        >
          scroll
        </span>
        <motion.div
          className="w-px h-7 origin-top"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)" }}
          animate={prefersReduced ? {} : { scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>
    </section>
  )
}
