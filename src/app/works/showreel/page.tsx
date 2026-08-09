"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  useScroll, useTransform, useReducedMotion,
  type Variants,
} from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import LanguageToggle from "@/components/ui/language-toggle"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { showreelDict } from "@/dictionaries/showreel"

// ─── Stagger variants ─────────────────────────────────────────────────────────
const sc: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const si: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}
const scTouch: Variants = { show: {} }
const siTouch: Variants = { show: {} }

// ─── NavBackButton ────────────────────────────────────────────────────────────
function NavBackButton({ href, label }: { href: string; label: string }) {
  return (
    <motion.div whileHover="hover" suppressHydrationWarning>
      <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
        <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" variants={{ hover: { x: -4 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <polyline points="15 18 9 12 15 6" />
        </motion.svg>
        <motion.span variants={{ hover: { x: -2 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          {label}
        </motion.span>
      </Link>
    </motion.div>
  )
}

// ─── HeaderWriteButton ────────────────────────────────────────────────────────
function HeaderWriteButton({ href, label }: { href: string; label: string }) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: "#22D3EE", color: "#0A0A0A", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none", cursor: "pointer" }}
      whileHover={{ scale: 1.05, opacity: 0.88 }} whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      suppressHydrationWarning
    >
      {label}
    </motion.a>
  )
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top  - r.height / 2) * 0.25)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: "#22D3EE", color: "#0A0A0A", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", cursor: "pointer" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      suppressHydrationWarning
    >{children}</motion.a>
  )
}

// ─── GhostButton ─────────────────────────────────────────────────────────────
function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0); const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 20 })
  const sy = useSpring(y, { stiffness: 200, damping: 20 })
  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top  - r.height / 2) * 0.25)
  }
  const onLeave = () => { x.set(0); y.set(0) }
  return (
    <motion.a ref={ref} href={href}
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: "transparent", color: "#fff", fontWeight: 600, fontSize: "0.9rem", border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none", cursor: "pointer" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.45)" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      suppressHydrationWarning
    >{children}</motion.a>
  )
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 20, className, style }: {
  children: React.ReactNode; delay?: number; y?: number
  className?: string; style?: React.CSSProperties
}) {
  const isTouch = useIsTouch()
  return (
    <motion.div className={className} style={style}
      initial={isTouch ? false : { opacity: 0, y }}
      animate={isTouch ? { opacity: 1, y: 0 } : undefined}
      whileInView={isTouch ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >{children}</motion.div>
  )
}

// ─── SectionLabel ─────────────────────────────────────────────────────────────
function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <FadeIn>
      <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
        <span>—</span>{num} — {text}
      </span>
    </FadeIn>
  )
}

// ─── BigHeading ───────────────────────────────────────────────────────────────
function BigHeading({ line1, line2, color2 = "#22D3EE" }: { line1: string; line2: string; color2?: string }) {
  return (
    <div className="mb-10">
      <FadeIn><div style={{ color: "#fff", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>{line1}</div></FadeIn>
      <FadeIn delay={0.08}><div style={{ color: color2, display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>{line2}</div></FadeIn>
    </div>
  )
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────
function VideoPlayer({ src, label, description, onOpen }: {
  src: string; label: string; description: string; onOpen: () => void
}) {
  const t = useDict(showreelDict)
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  // Seven full-length clips live on this page — only stream the ones on screen
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    if (!ref.current) return
    ref.current.muted = !ref.current.muted
    setMuted(ref.current.muted)
  }

  return (
    <FadeIn>
      <div className="group rounded-2xl overflow-hidden" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="relative cursor-pointer" onClick={onOpen}>
          <video
            ref={ref}
            src={src}
            poster={src.replace(".mp4", ".webp")}
            preload="metadata"
            className="w-full h-auto"
            style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
            muted={muted}
            loop
            playsInline
            controls={false}
          />
          {/* Expand hint on hover */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.15)", transition: "opacity 0.25s ease" }}
            aria-hidden="true"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); toggle() }}
            className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label={muted ? t.videoPlayer.unmute : t.videoPlayer.mute}
          >
            {muted
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
            }
          </button>
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <span className="font-mono text-xs font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
          </div>
        </div>
        <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{description}</div>
        </div>
      </div>
    </FadeIn>
  )
}

// ─── VideoLightbox ────────────────────────────────────────────────────────────
function VideoLightbox({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  const t = useDict(showreelDict)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [onClose])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10"
      style={{ background: "rgba(5,5,6,0.94)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white"
        style={{ background: "rgba(255,255,255,0.1)" }}
        onClick={onClose}
        aria-label={t.lightbox.close}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE_DEFAULT }}
        className="relative max-w-[92vw] max-h-[86vh]"
        onClick={(e) => e.stopPropagation()}
        suppressHydrationWarning
      >
        <video
          src={src}
          className="max-w-[92vw] max-h-[86vh] w-auto h-auto rounded-xl"
          style={{ display: "block" }}
          autoPlay
          controls
          loop
          playsInline
        />
        <p className="text-center text-sm mt-3 font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ─── Reel clips ───────────────────────────────────────────────────────────────
const PAIR_CLIP_SOURCES = [
  { src: "/works/showreel/cinema.mp4",  key: "roadStory" as const },
  { src: "/works/showreel/blessed.mp4", key: "streetNoir" as const },
  { src: "/works/showreel/westrn.mp4",  key: "western" as const },
  { src: "/works/showreel/midwest.mp4", key: "ruralAmericana" as const },
]

// ─── Stack marquee ────────────────────────────────────────────────────────────
const STACK_SOURCES = [
  { name: "Kling 3.0",   subKey: "stackSubVideoGen" as const },
  { name: "Veo 3.1",     subKey: "stackSubVideoGen" as const },
  { name: "Seedance 2.0", subKey: "stackSubVideoGen" as const },
  { name: "DaVinci Resolve", subKey: "stackSubEditColor" as const },
]

function StackMarquee({ items, reducedMotion }: { items: { name: string; sub: string }[]; reducedMotion: boolean }) {
  const loop = [...items, ...items]
  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-3"
        style={{ width: "max-content" }}
        animate={reducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        suppressHydrationWarning
      >
        {loop.map(({ name, sub }, i) => (
          <div
            key={`${name}-${i}`}
            className="p-5 rounded-xl flex-shrink-0"
            style={{ width: 200, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="font-bold text-white mb-1">{name}</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShowreelPage() {
  const t = useDict(showreelDict)
  const [scrolled, setScrolled] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; label: string } | null>(null)
  const prefersReduced = useReducedMotion()
  const isTouch = useIsTouch()
  const s = isTouch ? scTouch : sc
  const si_ = isTouch ? siTouch : si

  const pairClips = PAIR_CLIP_SOURCES.map(({ src, key }) => ({ src, ...t.demoReel.clips[key] }))
  const stackItems = STACK_SOURCES.map(({ name, subKey }) => ({ name, sub: t.approach[subKey] }))

  const openLightbox = useCallback((src: string, label: string) => setLightbox({ src, label }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroVideoY   = useTransform(heroScroll, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "20%"])
  const heroContentY = useTransform(heroScroll, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "-12%"])

  return (
    <>
      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: scrolled ? "rgba(11,11,13,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <NavBackButton href="/#works" label={t.nav.allWorks} />
        <div className="flex items-center gap-3">
          <LanguageToggle dark />
          <HeaderWriteButton href={TELEGRAM_URL} label={t.header.write} />
        </div>
      </header>

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>

          <motion.div className="absolute inset-0" style={{ y: heroVideoY }} suppressHydrationWarning aria-hidden="true">
            <video
              src="/works/showreel/card-bg.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.4, scale: 1.08 }}
              muted loop playsInline autoPlay
            />
          </motion.div>

          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 55%, rgba(10,10,10,0.25) 100%)" }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 45%)" }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 20%)" }} aria-hidden="true" />

          <motion.div
            className="relative grid grid-cols-1 md:grid-cols-2 items-end px-6 md:px-12"
            style={{ minHeight: "100vh", paddingBottom: "clamp(3rem,6vw,5rem)", paddingTop: 100, y: heroContentY }}
            suppressHydrationWarning
          >
            <div className="flex flex-col justify-end">

              <motion.div className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                <div style={{ width: 28, height: 1, background: "rgba(34,211,238,0.6)" }} />
                <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>{t.hero.eyebrow}</span>
              </motion.div>

              <div aria-label="Skills Reel">
                <motion.div
                  className="font-black leading-none text-white"
                  style={{ fontSize: "clamp(4rem,10vw,9rem)", letterSpacing: "-0.04em" }}
                  initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 1.0, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >{t.hero.headingLine1}</motion.div>
                <motion.div
                  className="font-black leading-none"
                  style={{ fontSize: "clamp(4rem,10vw,9rem)", letterSpacing: "-0.04em", color: "#22D3EE" }}
                  initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1.0, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >{t.hero.headingLine2}</motion.div>
              </div>

              <motion.p className="text-base md:text-lg leading-relaxed mt-6 mb-10"
                style={{ color: "rgba(255,255,255,0.5)", maxWidth: "44ch" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {t.hero.subline}
              </motion.p>

              <motion.div className="flex flex-wrap gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {[
                  { label: t.hero.metaFormatLabel, value: t.hero.metaFormatValue },
                  { label: t.hero.metaGenresLabel, value: t.hero.metaGenresValue },
                  { label: t.hero.metaStackLabel,  value: t.hero.metaStackValue },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderLeft: "1px solid rgba(34,211,238,0.4)", paddingLeft: 12 }}>
                    <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
                    <div className="font-semibold text-sm text-white">{value}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="hidden md:flex justify-end items-end pb-2">
              <motion.div className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                aria-hidden="true"
                suppressHydrationWarning
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.18)", writingMode: "vertical-rl" }}>scroll</span>
                <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, rgba(34,211,238,0.6), transparent)" }} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 01 DEMO REEL ═════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="01" text={t.demoReel.sectionLabel} />
            <BigHeading line1={t.demoReel.headingLine1} line2={t.demoReel.headingLine2} />

            <FadeIn delay={0.1}>
              <p className="text-lg mb-14 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>
                {t.demoReel.intro}
              </p>
            </FadeIn>

            {/* Hook — full width */}
            <div className="mb-6">
              <VideoPlayer
                src="/works/showreel/film.mp4"
                label={t.demoReel.hookLabel}
                description={t.demoReel.hookDescription}
                onOpen={() => openLightbox("/works/showreel/film.mp4", t.demoReel.hookLabel)}
              />
            </div>

            {/* Grid of 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {pairClips.map((clip) => (
                <VideoPlayer key={clip.src} {...clip} onOpen={() => openLightbox(clip.src, clip.label)} />
              ))}
            </div>

            {/* Closer — full width */}
            <div className="mb-6">
              <VideoPlayer
                src="/works/showreel/monstro.mp4"
                label={t.demoReel.closerLabel}
                description={t.demoReel.closerDescription}
                onOpen={() => openLightbox("/works/showreel/monstro.mp4", t.demoReel.closerLabel)}
              />
            </div>

            {/* POV — full width */}
            <div>
              <VideoPlayer
                src="/works/showreel/pov.mp4"
                label={t.demoReel.povLabel}
                description={t.demoReel.povDescription}
                onOpen={() => openLightbox("/works/showreel/pov.mp4", t.demoReel.povLabel)}
              />
            </div>
          </div>
        </section>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 02 ПОДХОД ════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="02" text={t.approach.sectionLabel} />
            <BigHeading line1={t.approach.headingLine1} line2={t.approach.headingLine2} />

            <FadeIn delay={0.1}>
              <p className="text-lg mb-14 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>
                {t.approach.intro}
              </p>
            </FadeIn>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
              variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              {t.approach.cards.map(({ num, title, desc, tag }) => (
                <motion.div
                  key={num}
                  variants={si_}
                  className="p-7 rounded-2xl flex flex-col"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  whileHover={{ y: -5, background: "rgba(34,211,238,0.06)", borderColor: "rgba(34,211,238,0.25)" }}
                  transition={{ duration: 0.3, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >
                  <div className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>{num}</div>
                  <div className="font-black mb-3" style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.15 }}>{title}</div>
                  <div className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.4)", flex: 1 }}>{desc}</div>
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase self-start" style={{ border: "1px solid rgba(34,211,238,0.35)", color: "#67e8f9", background: "rgba(34,211,238,0.08)" }}>{tag}</span>
                </motion.div>
              ))}
            </motion.div>

            <FadeIn delay={0.1}>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "3rem" }} />
              <div className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>{t.approach.stackLabel}</div>
            </FadeIn>
            <StackMarquee
              items={[
                { name: "Kling 3.0", sub: t.approach.stackSubVideoGen },
                { name: "Veo 3.1", sub: t.approach.stackSubVideoGen },
                { name: "Seedance 2.0", sub: t.approach.stackSubVideoGen },
                { name: "DaVinci Resolve", sub: t.approach.stackSubEditColor },
              ]}
              reducedMotion={!!prefersReduced}
            />
          </div>
        </section>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative" style={{ background: "#0D0D0D" }}>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div className="font-black leading-none whitespace-nowrap" style={{ fontSize: "clamp(6rem,18vw,17rem)", letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(34,211,238,0.07)" }}>SKILLS</div>
          </div>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "50vw", height: "50vh", background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <motion.h2
              className="font-black leading-none mb-8"
              style={{ fontSize: "clamp(3rem,10vw,9rem)", letterSpacing: "-0.04em" }}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <span style={{ color: "#fff" }}>{t.cta.headingPart1}</span><span style={{ color: "#22D3EE" }}>{t.cta.headingPart2}</span>
            </motion.h2>
            <FadeIn delay={0.2}>
              <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.35)", maxWidth: 440, margin: "0 auto 40px" }}>
                {t.cta.subline}
              </p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <PrimaryButton href={TELEGRAM_URL}>{t.cta.primaryButton}</PrimaryButton>
                <GhostButton href="/#works">{t.cta.ghostButton}</GhostButton>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>

      <AnimatePresence>
        {lightbox && (
          <VideoLightbox src={lightbox.src} label={lightbox.label} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
