"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { flushSync } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import LanguageToggle from "@/components/ui/language-toggle"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict, useLanguage } from "@/lib/language-context"
import { pumaYouthDict } from "@/dictionaries/puma-youth"

// Palette pulled from the film's grade
const SUNSET = "#F2A65A"
const SAND = "#E8C9A0"
const CREAM = "#F2E6CF"
const TEAL = "#2E6B6A"
const TEAL_DEEP = "#1F4A4C"
const MEDIA = "/works/puma-youth"

// Static film-grain tile; one paint, no animation
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

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

// ─── Phone vs desktop rendition ───────────────────────────────────────────────
function useIsSmall() {
  const [small, setSmall] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setSmall(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return small
}

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
      <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-8" style={{ color: "rgba(242,230,207,0.62)" }}>
        <span style={{ color: SUNSET }}>—</span>{num} — {text}
      </span>
    </FadeIn>
  )
}

// ─── HeroFilm — muted teaser loop; "Sound" swaps in the full film from 0:00 ──
function HeroFilm({ lang, small, poster, title, soundLabel, watchLabel, onWatch, paused }: {
  lang: "ru" | "en"; small: boolean; poster: string; title: string
  soundLabel: string; watchLabel: string; onWatch: () => void; paused: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [full, setFull] = useState(false)
  const [muted, setMuted] = useState(true)
  const [ready, setReady] = useState(false)
  // The teaser starts fetching only after the poster has painted, so the poster
  // stays the LCP and doesn't share bandwidth with the video on mobile
  const [armed, setArmed] = useState(false)
  const arm = useCallback(() => {
    const go = () => setArmed(true)
    if ("requestIdleCallback" in window) window.requestIdleCallback(go, { timeout: 1200 })
    else setTimeout(go, 300)
  }, [])
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 4000) // safety net if onLoad never fires
    return () => clearTimeout(t)
  }, [])
  const res = small ? "720" : "1080"
  const filmSrc = `${MEDIA}/puma-youth-${lang}-${res}.mp4`
  // React only ever owns the teaser URL; the film is swapped in imperatively,
  // so a re-render can't reset the src and restart playback
  const src = `${MEDIA}/puma-youth-${lang}-loop-${res}.mp4`

  // A language switch drops back to the silent teaser in that language
  useEffect(() => {
    setFull(false)
    setMuted(true)
    if (ref.current) ref.current.muted = true
  }, [lang])

  // Only stream while the hero is on screen, and never under the modal
  useEffect(() => {
    const el = ref.current
    if (!el || !armed) return
    if (paused) { el.pause(); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [src, paused, armed])

  const toggleSound = () => {
    const el = ref.current
    if (!el) return
    if (!full) {
      // First press: full film with sound from 0:00. The swap and play() stay
      // inside the click handler — iOS only allows unmuted playback there.
      // Commit "armed" first so React's teaser src can't land on top of the film.
      if (!armed) flushSync(() => setArmed(true))
      el.src = filmSrc
      el.muted = false
      el.play().catch(() => { el.muted = true; setMuted(true) })
      setFull(true)
      setMuted(false)
      return
    }
    el.muted = !el.muted
    setMuted(el.muted)
  }

  return (
    <div className="relative">
    <div className="relative w-full overflow-hidden md:rounded-2xl" style={{ aspectRatio: "16 / 9", background: "#0B0A08" }}>
      {/* Poster as a real image so it is the LCP element */}
      <Image src={poster} alt="" fill priority fetchPriority="high" sizes="(max-width: 1280px) 100vw, 1200px" quality={82} style={{ objectFit: "cover" }} onLoad={arm} />
      <video
        ref={ref}
        src={armed ? src : undefined}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        onPlaying={() => setReady(true)}
        aria-label={title}
      />
      {/* Grain over the hero only */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: GRAIN, opacity: 0.07, mixBlendMode: "overlay" }} />
    </div>

      {/* Phones: under the frame so the burned-in subtitles stay readable; desktop: over the corners */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-6 mt-3 md:px-0 md:mt-0 md:absolute md:bottom-5 md:left-5 md:right-5">
        <button
          onClick={toggleSound}
          className="inline-flex items-center gap-2 font-semibold text-sm"
          style={{ minHeight: 44, padding: "0 18px", borderRadius: 9999, color: CREAM, background: "rgba(11,10,8,0.6)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(242,230,207,0.2)" }}
          aria-pressed={!muted}
        >
          {muted
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>}
          {soundLabel}
        </button>
        <button
          onClick={onWatch}
          className="inline-flex items-center gap-2 font-bold text-sm"
          style={{ minHeight: 44, padding: "0 20px", borderRadius: 9999, color: "#0B0A08", background: SUNSET }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l15 8-15 8z"/></svg>
          {watchLabel}
        </button>
      </div>
    </div>
  )
}

// ─── FilmModal — full film with native controls ───────────────────────────────
function FilmModal({ src, start = 0, title, closeLabel, onClose }: { src: string; start?: number; title: string; closeLabel: string; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev }
  }, [onClose])
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8" style={{ background: "rgba(5,5,4,0.94)" }} onClick={onClose}>
      <button ref={closeRef} onClick={onClose} aria-label={closeLabel} className="absolute top-3 right-3 md:top-5 md:right-5 w-11 h-11 flex items-center justify-center rounded-full" style={{ color: CREAM, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(242,230,207,0.2)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <video
        src={src}
        className="w-full h-auto"
        style={{ maxWidth: 1600, maxHeight: "100%", aspectRatio: "16 / 9", background: "#000" }}
        controls
        autoPlay
        playsInline
        preload="metadata"
        aria-label={title}
        onLoadedMetadata={e => { if (start) e.currentTarget.currentTime = start }}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

// ─── CompareSlider — drag the vertical handle; mouse, touch and keyboard ─────
function CompareSlider({ before, after, beforeLabel, afterLabel, alt }: {
  before: string; after: string; beforeLabel: string; afterLabel: string; alt: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50)
  const dragging = useRef(false)

  const moveTo = useCallback((clientX: number) => {
    const box = boxRef.current
    if (!box) return
    const r = box.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)))
  }, [])

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden rounded-2xl select-none"
      style={{ aspectRatio: "16 / 9", touchAction: "pan-y", cursor: "ew-resize", background: "#111" }}
      onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); moveTo(e.clientX) }}
      onPointerMove={e => { if (dragging.current) moveTo(e.clientX) }}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
    >
      <Image src={after} alt={alt} fill sizes="(max-width: 1280px) 100vw, 1200px" quality={82} style={{ objectFit: "cover" }} draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt="" fill sizes="(max-width: 1280px) 100vw, 1200px" quality={82} style={{ objectFit: "cover" }} draggable={false} />
      </div>

      <span className="absolute top-3 left-3 font-mono text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(11,10,8,0.65)", color: CREAM }}>{beforeLabel}</span>
      <span className="absolute top-3 right-3 font-mono text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(11,10,8,0.65)", color: SUNSET }}>{afterLabel}</span>

      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, width: 2, marginLeft: -1, background: CREAM }} />
      <div
        role="slider"
        tabIndex={0}
        aria-label={alt}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={e => {
          if (e.key === "ArrowLeft") setPos(p => Math.max(0, p - 5))
          if (e.key === "ArrowRight") setPos(p => Math.min(100, p + 5))
        }}
        className="absolute top-1/2 w-11 h-11 rounded-full flex items-center justify-center"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)", background: CREAM, color: "#0B0A08", boxShadow: "0 4px 18px rgba(0,0,0,0.4)" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 6 3 12 9 18"/><polyline points="15 6 21 12 15 18"/></svg>
      </div>
    </div>
  )
}

// ─── StoryTile — still first, then a muted loop while on screen; opens the film at the scene
function StoryTile({ img, loop, alt, label, onOpen }: { img: string; loop: string; alt: string; label: string; onOpen: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { rootMargin: "100px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loop])
  return (
    <button onClick={onOpen} aria-label={`${label}: ${alt}`} className="group relative block w-full overflow-hidden rounded-xl text-left" style={{ aspectRatio: "16 / 9", background: TEAL_DEEP }}>
      <Image src={`${MEDIA}/${img}-1600.jpg`} alt={alt} fill sizes="(max-width: 768px) 100vw, 400px" quality={82} style={{ objectFit: "cover" }} />
      <video
        ref={ref}
        src={`${MEDIA}/${loop}.mp4`}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", opacity: live ? 1 : 0, transition: "opacity 0.5s ease" }}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setLive(true)}
      />
      <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 font-semibold text-xs transition-transform duration-300 group-hover:-translate-y-0.5" style={{ minHeight: 32, padding: "0 12px", borderRadius: 9999, color: "#0B0A08", background: SUNSET }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4l15 8-15 8z"/></svg>
        {label}
      </span>
    </button>
  )
}

// ─── LoopTile — tiny muted loop that only plays on screen ─────────────────────
function LoopTile({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() })
    io.observe(el)
    return () => io.disconnect()
  }, [src])
  return <video ref={ref} src={src} className="block w-full h-auto rounded-xl" style={{ aspectRatio: "16 / 9", background: "#0B0A08", border: "1px solid rgba(242,230,207,0.08)" }} muted loop playsInline preload="none" aria-label={label} />
}

// ─── Still — 16:9 frame through next/image (AVIF/WebP + srcset, lazy) ────────
function Still({ name, alt, sizes }: { name: string; alt: string; sizes: string }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 9", background: TEAL_DEEP }}>
      <Image src={`${MEDIA}/${name}-1600.jpg`} alt={alt} fill sizes={sizes} quality={82} style={{ objectFit: "cover" }} />
    </div>
  )
}

const divider = <div style={{ height: 1, background: "rgba(242,230,207,0.07)" }} />
const card: React.CSSProperties = { background: "rgba(242,230,207,0.03)", border: "1px solid rgba(242,230,207,0.08)" }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PumaYouthPage() {
  const t = useDict(pumaYouthDict)
  const { lang } = useLanguage()
  const small = useIsSmall()
  const [scrolled, setScrolled] = useState(false)
  const [modal, setModal] = useState(false)
  const [start, setStart] = useState(0)
  const isTouch = useIsTouch()
  const s = isTouch ? scTouch : sc
  const si_ = isTouch ? siTouch : si

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const filmSrc = `${MEDIA}/puma-youth-${lang}-${small ? "720" : "1080"}.mp4`

  return (
    <>
      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: scrolled ? "rgba(11,10,8,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(242,230,207,0.06)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <NavBackButton href="/#works" label={t.nav.allWorks} />
        <div className="flex items-center gap-3">
          <LanguageToggle dark />
          <motion.a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: SUNSET, color: "#0B0A08", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none" }}
            whileHover={{ scale: 1.05, opacity: 0.88 }} whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            suppressHydrationWarning
          >{t.nav.write}</motion.a>
        </div>
      </header>

      <main style={{ background: "#0B0A08", color: CREAM, minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ paddingTop: "clamp(96px,12vw,140px)", paddingBottom: "clamp(3rem,6vw,5rem)" }}>
          <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-25%", left: "-10%", width: "70vw", height: "70vh", background: `radial-gradient(ellipse, ${SUNSET}26 0%, transparent 70%)`, filter: "blur(40px)" }} />
          <div aria-hidden="true" className="absolute pointer-events-none" style={{ bottom: "-20%", right: "-10%", width: "60vw", height: "60vh", background: `radial-gradient(ellipse, ${TEAL}33 0%, transparent 70%)`, filter: "blur(40px)" }} />
          <div className="relative" style={{ maxWidth: 1280, margin: "0 auto" }}>
            {/* One line at every width: size follows the viewport instead of wrapping */}
            <motion.h1 className="font-black leading-[1.02] whitespace-nowrap px-6 md:px-12 mb-8 md:mb-10"
              style={{ fontSize: "clamp(1.2rem,5.6vw,5rem)", letterSpacing: "-0.04em", color: CREAM }}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >{t.hero.title}</motion.h1>

            <div className="md:px-12">
              <HeroFilm
                lang={lang}
                small={small}
                poster={`${MEDIA}/poster.jpg`}
                title={t.hero.title}
                soundLabel={t.hero.sound}
                watchLabel={t.hero.watchFull}
                onWatch={() => { setStart(0); setModal(true) }}
                paused={modal}
              />
            </div>

            <div className="px-6 md:px-12 mt-5 flex flex-col gap-1.5">
              <p className="text-sm md:text-base font-medium" style={{ color: "rgba(242,230,207,0.82)" }}>{t.hero.role}</p>
              <p className="font-mono text-xs" style={{ color: "rgba(242,230,207,0.6)" }}>{t.hero.label}</p>
            </div>
          </div>
        </section>

        {divider}

        {/* ══ 01 ИДЕЯ ═══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20 md:py-28">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="01" text={t.idea.label} />
            <FadeIn delay={0.08}>
              <p className="font-bold leading-[1.25]" style={{ fontSize: "clamp(1.4rem,3vw,2.4rem)", letterSpacing: "-0.02em", color: CREAM, maxWidth: "30ch" }}>{t.idea.text}</p>
            </FadeIn>
          </div>
        </section>

        {divider}

        {/* ══ 02 СЮЖЕТ ══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0E0D0B" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="02" text={t.story.label} />
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.story.items.map(({ img, loop, at, title, text, alt }) => (
                <motion.figure key={img} variants={si_} className="m-0" suppressHydrationWarning>
                  <StoryTile img={img} loop={loop} alt={alt} label={t.story.watchFrom} onOpen={() => { setStart(at); setModal(true) }} />
                  <figcaption className="mt-4 text-sm leading-relaxed" style={{ color: "rgba(242,230,207,0.7)" }}>
                    <span className="font-bold" style={{ color: SUNSET }}>{title}</span> {text}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 03 1975 / СЕГОДНЯ ═════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="03" text={t.then.label} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
              {t.then.pairs.map(pair => (
                <FadeIn key={pair.a}>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ src: pair.a, label: pair.aLabel, alt: pair.aAlt, accent: SAND }, { src: pair.b, label: pair.bLabel, alt: pair.bAlt, accent: SUNSET }].map(f => (
                      <figure key={f.src} className="m-0 relative overflow-hidden rounded-xl" style={{ aspectRatio: "688 / 768", background: "#ECEAE6" }}>
                        <Image src={`${MEDIA}/${f.src}.jpg`} alt={f.alt} fill sizes="(max-width: 1024px) 50vw, 300px" quality={82} style={{ objectFit: "cover" }} />
                        <figcaption className="absolute top-2 left-2 font-mono text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(11,10,8,0.78)", color: f.accent }}>{f.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mt-4" style={{ color: "rgba(242,230,207,0.7)", maxWidth: "52ch" }}>{pair.caption}</p>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {divider}

        {/* ══ 04 ПРОЦЕСС ════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0E0D0B" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="04" text={t.process.label} />
            <motion.ol className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 m-0 p-0 list-none" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.process.steps.map(({ img, title, text, alt }, i) => (
                // A step without a picture yet becomes a full-width text card
                <motion.li
                  key={title}
                  variants={si_}
                  // The odd last step (the DaVinci screen) gets the full row so its UI stays legible
                  className={!img ? "md:col-span-2 p-6 md:p-8 rounded-2xl" : i === t.process.steps.length - 1 && i % 2 === 0 ? "md:col-span-2" : undefined}
                  style={img ? undefined : card}
                  suppressHydrationWarning
                >
                  {img && <Still name={img} alt={alt} sizes={i === t.process.steps.length - 1 && i % 2 === 0 ? "(max-width: 1280px) 100vw, 1200px" : "(max-width: 768px) 100vw, 600px"} />}
                  <div className={`flex items-baseline gap-3 mb-2 ${img ? "mt-5" : ""}`}>
                    <span className="font-mono text-xs font-bold" style={{ color: SUNSET }}>0{i + 1}</span>
                    <span className="font-black" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", letterSpacing: "-0.03em", color: CREAM }}>{title}</span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: "rgba(242,230,207,0.68)", maxWidth: "52ch" }}>{text}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {divider}

        {/* ══ 05 СЛОЖНОСТИ ══════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="05" text={t.challenges.label} />
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.challenges.items.map(({ title, text }) => (
                <motion.div key={title} variants={si_} className="p-6 md:p-7 rounded-2xl" style={card} suppressHydrationWarning>
                  <div className="font-black mb-3" style={{ fontSize: "clamp(1.1rem,1.8vw,1.35rem)", letterSpacing: "-0.02em", color: CREAM }}>{title}</div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(242,230,207,0.68)" }}>
                    <span style={{ color: SAND, marginRight: 6 }}>→</span>{text}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 06 ДО / ПОСЛЕ ═════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0E0D0B" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="06" text={t.grade.label} />
            <FadeIn>
              <CompareSlider
                before={`${MEDIA}/grade_before-1600.jpg`}
                after={`${MEDIA}/grade_after-1600.jpg`}
                beforeLabel={t.grade.before}
                afterLabel={t.grade.after}
                alt={t.grade.alt}
              />
              <p className="font-mono text-xs mt-4" style={{ color: "rgba(242,230,207,0.6)" }}>{t.grade.caption}</p>
            </FadeIn>
          </div>
        </section>

        {divider}

        {/* ══ 07 ЧТО СДАНО / ИНСТРУМЕНТЫ / СРОК / ПРАВА ═════════════════════ */}
        <section className="px-6 md:px-12 py-20">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="07" text={t.deliverables.label} />
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.deliverables.items.map(d => (
                <motion.div key={d} variants={si_} className="p-5 rounded-xl font-semibold text-sm leading-snug" style={{ ...card, color: CREAM }} suppressHydrationWarning>{d}</motion.div>
              ))}
            </motion.div>

            <FadeIn className="mb-14">
              <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(242,230,207,0.62)" }}>{t.deliverables.logos}</div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(n => <LoopTile key={n} src={`${MEDIA}/logo-${n}.mp4`} label={`${t.deliverables.logos} — ${n}`} />)}
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FadeIn>
                <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(242,230,207,0.62)" }}>{t.tools.label}</div>
                <div className="flex flex-wrap gap-2">
                  {t.tools.list.map(tool => (
                    <span key={tool} className="text-sm px-3 py-1.5 rounded-xl font-medium" style={{ background: `${TEAL}26`, color: CREAM, border: `1px solid ${TEAL}66` }}>{tool}</span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.05}>
                <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(242,230,207,0.62)" }}>{t.timeline.label}</div>
                <p className="text-base leading-relaxed" style={{ color: "rgba(242,230,207,0.8)" }}>{t.timeline.text}</p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(242,230,207,0.62)" }}>{t.rights.label}</div>
                <p className="text-base leading-relaxed" style={{ color: "rgba(242,230,207,0.8)" }}>{t.rights.text}</p>
              </FadeIn>
            </div>
          </div>
        </section>

        {divider}

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative">
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "60vw", height: "50vh", background: `radial-gradient(ellipse, ${SUNSET}24 0%, transparent 70%)`, filter: "blur(40px)" }} />
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <motion.h2
              className="font-black leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2rem,5.5vw,4.4rem)", letterSpacing: "-0.04em", color: CREAM }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >{t.cta.title}</motion.h2>
            <FadeIn delay={0.15}>
              <p className="text-base leading-relaxed" style={{ color: "rgba(242,230,207,0.68)", maxWidth: 560, margin: "0 auto 40px" }}>{t.cta.text}</p>
            </FadeIn>
            <FadeIn delay={0.22}>
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold" style={{ padding: "14px 34px", minHeight: 48, borderRadius: 9999, background: SUNSET, color: "#0B0A08", fontSize: "0.95rem", textDecoration: "none" }}>
                {t.cta.button}
              </a>
            </FadeIn>
          </div>
        </section>

      </main>

      {modal && <FilmModal src={filmSrc} start={start} title={t.hero.title} closeLabel={t.hero.close} onClose={() => setModal(false)} />}
    </>
  )
}
