"use client"
import { useState, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion"
import { usePreloaderDone } from "@/lib/preloader-context"
import { TextNav } from "@/components/ui/text-nav"
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
  // left column
  { src: "/hero/cinema.mp4",   depth: 1.2, size: "clamp(220px, 22vw, 380px)", pos: "top-[7%] left-[3%]" },
  { src: "/hero/monstro.mp4",  depth: 2.2, size: "clamp(170px, 16vw, 260px)", pos: "top-[38%] left-[2%]" },
  { src: "/hero/westrn.mp4",   depth: 1.6, size: "clamp(220px, 21vw, 360px)", pos: "top-[64%] left-[5%]" },
  { src: "/hero/timeline.mp4", depth: 0.9, size: "clamp(150px, 13vw, 220px)", pos: "top-[10%] left-[28%]" },
  // right column, mirrored
  { src: "/hero/blessed.mp4",  depth: 1.4, size: "clamp(220px, 22vw, 380px)", pos: "top-[7%] left-[75%]" },
  { src: "/hero/film.mp4",     depth: 2.4, size: "clamp(170px, 16vw, 260px)", pos: "top-[38%] left-[82%]" },
  { src: "/hero/midwest.mp4",  depth: 1.8, size: "clamp(220px, 21vw, 360px)", pos: "top-[64%] left-[74%]" },
  { src: "/hero/video2.mp4",   depth: 1.0, size: "clamp(150px, 13vw, 220px)", pos: "top-[10%] left-[59%]" },
] as const

// Phone-sized cuts of the same reel — 480px wide
// Offsets are in px where they have to clear fixed chrome (header, bottom nav)
// so the scatter survives short phones as well as tall ones.
const MOBILE_REEL = [
  { src: "/hero/m/westrn.mp4",   cls: "float-card",     pos: { top: 72,     left: "3vw",  width: "36vw" } },
  { src: "/hero/m/film.mp4",     cls: "float-card-alt", pos: { top: 98,     right: "3vw", width: "29vw" } },
  { src: "/hero/m/timeline.mp4", cls: "float-card-alt", pos: { top: 150,    left: "40vw", width: "26vw" } },
  { src: "/hero/m/cinema.mp4",   cls: "float-card-alt", pos: { bottom: 152, left: "4vw",  width: "30vw" } },
  { src: "/hero/m/blessed.mp4",  cls: "float-card",     pos: { bottom: 110, right: "3vw", width: "36vw" } },
  { src: "/hero/m/video2.mp4",   cls: "float-card",     pos: { bottom: 96,  left: "36vw", width: "26vw" } },
] as const

const isMobileDevice = () => typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768)

/**
 * iOS Safari ignores the autoplay attribute on <video> elements inserted after
 * the initial paint — which is exactly how this wall mounts, since it waits for
 * the viewport measurement. It also wants `muted` as a property, not just an
 * attribute, before it will allow an unprompted play. So drive playback by hand
 * and retry as the clip becomes ready; if the OS still refuses (Low Power Mode),
 * the poster stays up instead of a black box.
 */
function useAutoPlay(ref: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    const play = () => { void el.play().catch(() => {}) }
    play()
    el.addEventListener("loadeddata", play)
    el.addEventListener("canplay", play)
    const onVisible = () => { if (document.visibilityState === "visible") play() }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      el.removeEventListener("loadeddata", play)
      el.removeEventListener("canplay", play)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [ref])
}

function HeroClip({ src, poster, className, style, initial, animate, transition, whileHover }: {
  src: string
  poster: string
  className?: string
  style?: React.CSSProperties
  initial?: Record<string, number>
  animate?: Record<string, number>
  transition?: Record<string, unknown>
  whileHover?: Record<string, number>
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useAutoPlay(ref)
  return (
    <motion.video
      ref={ref}
      className={className}
      style={style}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  )
}

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
  // "unknown" until measured — keeps phones from fetching the desktop clips
  const [device, setDevice] = useState<"unknown" | "mobile" | "desktop">("unknown")
  const preloaderDone = usePreloaderDone()
  const t = useDict(heroDict)
  const tc = useDict(commonDict)
  const navItems = useMemo(() => getNavItems(tc.nav), [tc])

  useEffect(() => {
    setDevice(isMobileDevice() ? "mobile" : "desktop")
  }, [])
  const lenis = useLenis()
  const [skipIntro, setSkipIntro] = useState(false)
  useEffect(() => {
    try { setSkipIntro(preloaderDone && !!sessionStorage.getItem("preloader-done")) } catch {}
  }, [preloaderDone])

  const scrollY = useMotionValue(0)
  const contentY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -60])
  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0])
  const wallScale = useTransform(scrollY, [0, 700], [1, 1.45])
  const wallOpacity = useTransform(scrollY, [0, 650], [1, 0])

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

      {/* ── Scattered video wall — mobile: fixed scatter, gentle float ── */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none" style={{ scale: wallScale, opacity: wallOpacity }}>
      {device === "mobile" && (
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {MOBILE_REEL.map((clip, i) => (
            <div key={clip.src} className={`absolute ${clip.cls}`} style={clip.pos}>
              <HeroClip
                className="block w-full rounded-lg object-cover"
                style={{
                  aspectRatio: "16/9",
                  boxShadow: "0 14px 34px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
                }}
                initial={{ opacity: 0 }}
                animate={preloaderDone ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.45 + i * 0.1, ease: EASE_DEFAULT }}
                src={clip.src}
                poster={clip.src.replace(".mp4", ".webp")}
              />
            </div>
          ))}
          {/* Scrim — keeps the centred copy legible wherever a clip lands */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 82% 40% at 50% 47%, rgba(11,11,13,0.96) 0%, rgba(11,11,13,0.88) 48%, rgba(11,11,13,0) 78%)",
            }}
          />
        </div>
      )}

      </motion.div>

      {/* ── Scattered video wall — desktop only, mouse parallax ── */}
      {device === "desktop" && (
        <motion.div className="absolute inset-0 z-10" style={{ scale: wallScale, opacity: wallOpacity }}>
        <Floating className="z-10" sensitivity={prefersReduced ? 0 : 0.7}>
          {HERO_REEL.map((clip, i) => (
            <FloatingElement key={clip.src} depth={clip.depth} className={clip.pos}>
              <div className={i % 2 ? "float-card-alt" : "float-card"} style={{ animationDelay: `${-i * 1.3}s` }}>
              <HeroClip
                className="rounded-xl object-cover block cursor-pointer"
                style={{
                  width: clip.size,
                  aspectRatio: "16/9",
                  boxShadow: "0 20px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: EASE_DEFAULT }}
                src={clip.src}
                poster={clip.src.replace(".mp4", ".webp")}
              />
            </div>
            </FloatingElement>
          ))}
        </Floating>
        </motion.div>
      )}

      {/* ── HEADER ── */}
      <header className="relative z-30 flex items-center justify-between md:justify-center px-6 md:px-10 py-5 flex-shrink-0">
        {/* Logo — mobile only */}
        <a href="#hero" className="md:hidden font-black text-lg tracking-tighter" style={{ color: "var(--text)" }}>DK</a>

        {/* GlowMenu — center, desktop only */}
        <nav aria-label={tc.navAriaLabel} className="hidden md:block">
          <TextNav
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
              style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "clamp(1.75rem, 7.6vw, 5.4rem)" }}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              initial={skipIntro ? false : "hidden"}
              animate={preloaderDone ? "visible" : "hidden"}
              transition={{ duration: 0.9, delay: 0.14, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              {t.role.split(" & ").map((part, i) => (
                <span key={part} className="block">{i > 0 ? `& ${part}` : part}</span>
              ))}
            </motion.span>
          </h1>

          {/* Subline */}
          <motion.div
            className="text-[16px] md:text-[19px] max-w-sm md:max-w-lg mb-10 leading-[1.55]"
            style={{ color: "var(--text)", opacity: 0.75 }}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 0.75, y: 0 } }}
            initial={skipIntro ? false : "hidden"}
            animate={preloaderDone ? "visible" : "hidden"}
            transition={{ duration: 0.7, delay: 0.24, ease: EASE_DEFAULT }}
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
            transition={{ duration: 0.7, delay: 0.32, ease: EASE_DEFAULT }}
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

    </section>
  )
}
