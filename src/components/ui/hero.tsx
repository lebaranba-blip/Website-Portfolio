"use client"
import { useState, useEffect, useMemo } from "react"
import { AnimatePresence, motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion"
import { usePreloaderDone } from "@/lib/preloader-context"
import { MenuBar } from "@/components/ui/glow-menu"
import { getNavItems, EASE_DEFAULT } from "@/lib/constants"
import { useLenis } from "@/lib/lenis-context"
import { useDict } from "@/lib/language-context"
import { commonDict } from "@/dictionaries/common"
import { heroDict } from "@/dictionaries/hero"
import TelegramButton from "@/components/ui/telegram-button"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import LanguageToggle from "@/components/ui/language-toggle"
import { ArrowRight } from "lucide-react"

// Plain inline text swap — no nested flex, so the baseline always matches the surrounding line
function InlineRotator({ texts, interval, active }: { texts: readonly string[]; interval: number; active: boolean }) {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => setIndex((i) => (i + 1) % texts.length), interval)
    return () => clearInterval(id)
  }, [active, texts, interval])

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={texts[index]}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease: EASE_DEFAULT }}
        style={{ display: "inline-block" }}
      >
        {texts[index]}
      </motion.span>
    </AnimatePresence>
  )
}

const HERO_REEL = [
  { src: "/hero/cinema.mp4", depth: 1.2, size: "clamp(200px, 20vw, 320px)", pos: "top-[7%] left-[3%]" },
  { src: "/hero/blessed.mp4", depth: 2, size: "clamp(220px, 23vw, 350px)", pos: "top-[4%] left-[70%]" },
  { src: "/hero/westrn.mp4", depth: 3, size: "clamp(220px, 23vw, 350px)", pos: "top-[62%] left-[4%]" },
  { src: "/hero/midwest.mp4", depth: 1.5, size: "clamp(230px, 24vw, 360px)", pos: "top-[60%] left-[68%]" },
  { src: "/hero/monstro.mp4", depth: 0.7, size: "clamp(170px, 17vw, 250px)", pos: "top-[38%] left-[1%]" },
  { src: "/hero/film.mp4", depth: 1.8, size: "clamp(190px, 19vw, 270px)", pos: "top-[32%] left-[78%]" },
] as const

const isMobileDevice = () => typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)

function scrollToSection(href: string, lenis: ReturnType<typeof useLenis>) {
  if (lenis) {
    lenis.scrollTo(href, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  } else {
    const el = document.querySelector(href) as HTMLElement
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" })
  }
}

export default function HeroSection() {
  const prefersReduced = useReducedMotion()
  const [activeItem, setActiveItem] = useState<string | undefined>()
  const [isMobile, setIsMobile] = useState(false)
  const preloaderDone = usePreloaderDone()
  const t = useDict(heroDict)
  const tc = useDict(commonDict)
  const navItems = useMemo(() => getNavItems(tc.nav), [tc])

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])
  const lenis = useLenis()
  const [skipIntro, setSkipIntro] = useState(false)
  useEffect(() => {
    try { setSkipIntro(preloaderDone && !!sessionStorage.getItem("preloader-done")) } catch {}
  }, [preloaderDone])

  const scrollY = useMotionValue(0)
  const contentY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0])

  useEffect(() => {
    if (prefersReduced) return
    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => scrollY.set(scroll)
      lenis.on("scroll", onLenisScroll)
      return () => lenis.off("scroll", onLenisScroll)
    }
    const onNativeScroll = () => scrollY.set(window.scrollY)
    window.addEventListener("scroll", onNativeScroll, { passive: true })
    return () => window.removeEventListener("scroll", onNativeScroll)
  }, [lenis, prefersReduced, scrollY])

  return (
    <section
      id="hero"
      aria-label={t.ariaLabel}
      style={{ height: "100dvh", minHeight: "640px" }}
      className="relative w-full overflow-hidden flex flex-col noise-overlay"
    >
      {/* ── Ambient glow background ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          background: [
            "radial-gradient(ellipse 120% 55% at 50% 5%, rgba(8,145,178,0.11) 0%, transparent 65%)",
            "radial-gradient(ellipse 80% 45% at 85% 85%, rgba(234,88,12,0.08) 0%, transparent 65%)",
          ].join(", "),
        }}
      />

      {/* ── Scattered video wall — desktop only, mouse parallax ── */}
      {!isMobile && (
        <Floating className="z-10" sensitivity={prefersReduced ? 0 : 0.7}>
          {HERO_REEL.map((clip, i) => (
            <FloatingElement key={clip.src} depth={clip.depth} className={clip.pos}>
              <motion.video
                className="rounded-xl object-cover block cursor-pointer"
                style={{
                  width: clip.size,
                  aspectRatio: "16/9",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.08, ease: EASE_DEFAULT }}
                src={clip.src}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
              />
            </FloatingElement>
          ))}
        </Floating>
      )}

      {/* ── HEADER ── */}
      <header className="relative z-30 flex items-center justify-between md:justify-center px-6 md:px-10 py-5 flex-shrink-0">
        {/* Logo — mobile only */}
        <a href="#hero" className="md:hidden font-black text-lg tracking-tighter" style={{ color: "var(--text)" }}>DK</a>

        {/* GlowMenu — center, desktop only */}
        <nav aria-label={tc.navAriaLabel} className="hidden md:block">
          <MenuBar
            items={navItems}
            activeItem={activeItem}
            onItemClick={(id, href) => {
              setActiveItem(id)
              if (href) scrollToSection(href, lenis)
            }}
          />
        </nav>

        {/* Language toggle — desktop, absolute right */}
        <div className="hidden md:block" style={{ position: "absolute", right: "clamp(1.5rem,4vw,2.5rem)", top: "50%", transform: "translateY(-50%)" }}>
          <LanguageToggle />
        </div>

        {/* Mobile — language toggle only (nav lives in the bottom bar) */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
        </div>
      </header>

      {/* ── CENTER CONTENT ── */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-6 -mt-20 md:mt-0">
        <motion.div
          className="flex flex-col items-center text-center"
          style={{ y: contentY, opacity: contentOpacity }}
          suppressHydrationWarning
        >
          {/* Live badge */}
          <motion.div
            className="flex items-center gap-2 mb-5"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            initial={skipIntro ? false : "hidden"}
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_DEFAULT }}
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
              {t.badge}
            </span>
          </motion.div>

          {/* Name eyebrow */}
          <motion.p
            className="font-mono text-[15px] md:text-base tracking-[0.06em] mb-5 md:mb-6"
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            initial={skipIntro ? false : "hidden"}
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <span style={{ color: "var(--text)", opacity: 0.85 }}>{t.name}</span>
          </motion.p>

          {/* H1 */}
          <h1
            className="mb-6"
            style={{ letterSpacing: "-0.04em", lineHeight: "1.05" }}
          >
            <motion.span
              className="block font-black gradient-text whitespace-nowrap"
              style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(1.6rem, 7.4vw, 5.5rem)" }}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              initial={skipIntro ? false : "hidden"}
              animate={preloaderDone ? "visible" : "hidden"}
              transition={{ duration: 1.1, delay: 0.28, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              {t.role}
            </motion.span>
          </h1>

          {/* Subline */}
          <motion.div
            className="text-[15px] md:text-lg font-mono max-w-sm md:max-w-md mb-10 leading-[1.6]"
            style={{ color: "var(--text)", opacity: 0.75 }}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 0.75, y: 0 } }}
            initial={skipIntro ? false : "hidden"}
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.46, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            {t.sublinePrefix}{" "}
            <InlineRotator texts={t.phrases} interval={2800} active={!prefersReduced} />
            {t.sublineSuffix}
          </motion.div>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 mb-12"
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            initial={skipIntro ? false : "hidden"}
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <TelegramButton />
            <a
              href="#works"
              className="btn-secondary flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("#works", lenis)
              }}
            >
              {t.ctaWorks}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2.5"
        aria-hidden="true"
      >
        <span
          className="text-xs font-mono tracking-[0.3em] uppercase font-semibold"
          style={{ color: "var(--text)", opacity: 0.6 }}
        >
          scroll
        </span>
        <motion.div
          className="w-[3px] h-10 rounded-full origin-top"
          style={{ background: "linear-gradient(to bottom, #fff, transparent)" }}
          animate={prefersReduced ? {} : { scaleY: [0.4, 1, 0.4], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>
    </section>
  )
}
