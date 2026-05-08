"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Metadata } from "next"
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  useScroll, useTransform, useReducedMotion,
  type Variants,
} from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Motion Teaser — Дмитрий",
  description: "Motion design на коде. Remotion + TypeScript. Три видео от концепции до HQ рендера.",
  openGraph: {
    title: "Motion Teaser",
    description: "Motion design на коде. Remotion + TypeScript.",
    type: "website",
    images: [
      {
        url: "https://website-portfolio-y48s.vercel.app/works/motion-teaser/banner-v2.png",
        width: 1200,
        height: 630,
        alt: "Motion Teaser — Remotion demo reel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://website-portfolio-y48s.vercel.app/works/motion-teaser/banner-v2.png"],
  },
}

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
function NavBackButton({ href }: { href: string }) {
  return (
    <motion.div whileHover="hover" suppressHydrationWarning>
      <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>
        <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" variants={{ hover: { x: -4 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          <polyline points="15 18 9 12 15 6" />
        </motion.svg>
        <motion.span variants={{ hover: { x: -2 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          Все работы
        </motion.span>
      </Link>
    </motion.div>
  )
}

// ─── HeaderWriteButton ────────────────────────────────────────────────────────
function HeaderWriteButton({ href }: { href: string }) {
  return (
    <motion.a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none", cursor: "pointer" }}
      whileHover={{ scale: 1.05, opacity: 0.88 }} whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      suppressHydrationWarning
    >
      Написать
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
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: "#7c3aed", color: "#fff", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", cursor: "pointer" }}
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
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  if (isTouch) return <div className={className} style={style}>{children}</div>
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
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
function BigHeading({ line1, line2, color2 = "#7c3aed" }: { line1: string; line2: string; color2?: string }) {
  return (
    <div className="mb-10">
      <FadeIn><div style={{ color: "#fff", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>{line1}</div></FadeIn>
      <FadeIn delay={0.08}><div style={{ color: color2, display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>{line2}</div></FadeIn>
    </div>
  )
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────
function VideoPlayer({ src, label, description, ratio = "56.25%", accent = "#7c3aed" }: {
  src: string; label: string; description: string; ratio?: string; accent?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.play().then(() => setPlaying(true)).catch(() => {})
  }, [])

  const toggle = () => {
    if (!ref.current) return
    ref.current.muted = !ref.current.muted
    setMuted(ref.current.muted)
  }

  return (
    <FadeIn>
      <div className="group rounded-2xl overflow-hidden" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="relative">
          <video
            ref={ref}
            src={src}
            className="w-full h-auto"
            style={{ display: "block", aspectRatio: "16/9", objectFit: "cover" }}
            muted
            loop
            playsInline
            controls={false}
          />
          {/* Mute toggle */}
          <button
            onClick={toggle}
            className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
            aria-label={muted ? "Включить звук" : "Выключить звук"}
          >
            {muted
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
            }
          </button>
          {/* Top-left label badge */}
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

// ─── FeatureRow ───────────────────────────────────────────────────────────────
function FeatureRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  return (
    <motion.div
      className="flex items-center gap-4 py-3 cursor-default relative"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      initial={isTouch ? false : { opacity: 0, x: -16 }}
      whileInView={isTouch ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: EASE_DEFAULT }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      suppressHydrationWarning
    >
      <motion.div
        style={{ position: "absolute", left: -16, top: 8, bottom: 8, width: 3, background: "#7c3aed", borderRadius: 2, transformOrigin: "top" }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        suppressHydrationWarning
      />
      <motion.span
        className="font-mono font-bold text-xs"
        animate={{ color: hovered ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
        transition={{ duration: 0.15 }}
        style={{ minWidth: 20 }}
        suppressHydrationWarning
      >0{index + 1}</motion.span>
      <div style={{ flex: 1 }}>
        <motion.div
          className="font-bold text-sm"
          style={{ color: "#fff" }}
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >{label}</motion.div>
        <div className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</div>
      </div>
      <motion.span
        style={{ color: "#a78bfa", fontSize: 14 }}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        suppressHydrationWarning
      >→</motion.span>
    </motion.div>
  )
}

// ─── CodeBlock ────────────────────────────────────────────────────────────────
function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <FadeIn>
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)" }}>
        <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: "1px solid rgba(124,58,237,0.12)" }}>
          <div className="flex gap-1.5" aria-hidden="true">
            {["#ff5f57","#febc2e","#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
          </div>
          <span className="font-mono text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{title}</span>
        </div>
        <pre className="px-5 py-5 text-sm leading-relaxed overflow-x-auto" style={{ color: "#a78bfa", margin: 0 }}>{code}</pre>
      </div>
    </FadeIn>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MotionTeaserPage() {
  const [scrolled, setScrolled] = useState(false)
  const prefersReduced = useReducedMotion()
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  const s = isTouch ? scTouch : sc
  const si_ = isTouch ? siTouch : si

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroVideoY  = useTransform(heroScroll, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "20%"])
  const heroContentY = useTransform(heroScroll, [0, 1], prefersReduced ? ["0%", "0%"] : ["0%", "-12%"])

  return (
    <>
      {/* ── Header ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <NavBackButton href="/#works" />
        <HeaderWriteButton href={TELEGRAM_URL} />
      </header>

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>

          {/* DEPTH 0 — background video with parallax */}
          <motion.div className="absolute inset-0" style={{ y: heroVideoY }} suppressHydrationWarning aria-hidden="true">
            <video
              src="/works/motion-teaser/vivid-gradient.mp4"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35, scale: 1.08 }}
              muted loop playsInline autoPlay
            />
          </motion.div>

          {/* DEPTH 1 — atmospheric glow blobs */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <motion.div
              className="absolute"
              style={{ top: "10%", left: "50%", transform: "translateX(-50%)", width: "60vw", height: "60vh", background: "radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)", filter: "blur(40px)", borderRadius: "50%" }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              suppressHydrationWarning
            />
            <motion.div
              className="absolute"
              style={{ bottom: "5%", right: "10%", width: "35vw", height: "35vh", background: "radial-gradient(ellipse, rgba(167,139,250,0.18) 0%, transparent 70%)", filter: "blur(30px)", borderRadius: "50%" }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              suppressHydrationWarning
            />
          </div>

          {/* DEPTH 2 — gradient overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.65) 55%, rgba(10,10,10,0.2) 100%)" }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 45%)" }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 20%)" }} aria-hidden="true" />

          {/* DEPTH 4 — content */}
          <motion.div
            className="relative grid grid-cols-1 md:grid-cols-2 items-end px-6 md:px-12"
            style={{ minHeight: "100vh", paddingBottom: "clamp(3rem,6vw,5rem)", paddingTop: 100, y: heroContentY }}
            suppressHydrationWarning
          >
            <div className="flex flex-col justify-end">

              {/* Category badge */}
              <motion.div className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                <div style={{ width: 28, height: 1, background: "rgba(124,58,237,0.6)" }} />
                <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>Motion Design · 2026</span>
              </motion.div>

              {/* H1 — split entrance */}
              <div aria-label="Motion Design">
                <motion.div
                  className="font-black leading-none text-white"
                  style={{ fontSize: "clamp(4rem,10vw,9rem)", letterSpacing: "-0.04em" }}
                  initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 1.0, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >MOTION</motion.div>
                <motion.div
                  className="font-black leading-none"
                  style={{ fontSize: "clamp(4rem,10vw,9rem)", letterSpacing: "-0.04em", color: "#ec4899" }}
                  initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1.0, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >DESIGN</motion.div>
              </div>

              {/* Subtitle */}
              <motion.p className="text-base md:text-lg leading-relaxed mt-6 mb-10"
                style={{ color: "rgba(255,255,255,0.5)", maxWidth: "42ch" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                Не таймлайны. Не After Effects. Remotion + TypeScript — код превращается в видео кадр за кадром.
              </motion.p>

              {/* Meta row */}
              <motion.div className="flex flex-wrap gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {[
                  { label: "Стек", value: "Remotion · TypeScript" },
                  { label: "Формат", value: "1920×1080 · 60fps" },
                  { label: "Видео", value: "3 ролика" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderLeft: "1px solid rgba(124,58,237,0.4)", paddingLeft: 12 }}>
                    <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
                    <div className="font-semibold text-sm text-white">{value}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Scroll indicator — desktop */}
            <div className="hidden md:flex justify-end items-end pb-2">
              <motion.div className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                aria-hidden="true"
                suppressHydrationWarning
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.18)", writingMode: "vertical-rl" }}>scroll</span>
                <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, rgba(124,58,237,0.6), transparent)" }} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 01 DEMO REEL ═════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="01" text="Demo Reel" />
            <BigHeading line1="ТРИ РОЛИКА." line2="ОДИН НАВЫК." />

            <FadeIn delay={0.1}>
              <p className="text-lg mb-14 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>
                Три видео — три техники. Каждое снято с нуля через Remotion: от пустого компонента до финального MP4.
              </p>
            </FadeIn>

            {/* Main video — full width */}
            <div className="mb-6">
              <VideoPlayer
                src="/works/motion-teaser/motion-teaser.mp4"
                label="Motion Teaser"
                description="Kinetic typography, icon animation, typewriter effect, blur transitions, sparkle particles — полный демо-рил навыков"
              />
            </div>

            {/* Two secondary videos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VideoPlayer
                src="/works/motion-teaser/vivid-gradient.mp4"
                label="Vivid Gradient"
                description="Gradient wipe transitions, scene cuts, 60fps smooth motion"
              />
              <VideoPlayer
                src="/works/motion-teaser/article-highlight-hq.mp4"
                label="Article Highlight"
                description="Text highlight animation, word-by-word reveal, editorial style"
              />
            </div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 02 КАК ЭТО РАБОТАЕТ ═════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="02" text="Как это работает" />
            <BigHeading line1="REMOTION +" line2="TYPESCRIPT" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

              {/* Left — feature rows */}
              <div>
                <FadeIn delay={0.1}>
                  <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "55ch" }}>
                    Remotion превращает React-компоненты в видео. Каждый кадр — это рендер. Никаких GUI-таймлайнов, только код.
                  </p>
                </FadeIn>

                <div className="flex flex-col">
                  {[
                    { label: "spring()", desc: "physics-based easing вместо cubic-bezier" },
                    { label: "interpolate()", desc: "frame-based значения для любого свойства" },
                    { label: "useCurrentFrame()", desc: "текущий кадр как единственный источник истины" },
                    { label: "Sequence & Series", desc: "монтаж из независимых сцен" },
                    { label: "renderMedia()", desc: "CLI-рендер в MP4 / WebM / GIF" },
                  ].map(({ label, desc }, i) => (
                    <FeatureRow key={label} label={label} desc={desc} index={i} />
                  ))}
                </div>
              </div>

              {/* Right — code example */}
              <div className="flex flex-col gap-4">
                <CodeBlock
                  title="typewriter.tsx"
                  code={`const frame = useCurrentFrame();
const opacity = spring({
  fps: 60,
  frame: frame - delay,
  config: { damping: 200 },
});

return (
  <span style={{ opacity }}>
    {char}
  </span>
);`}
                />
                <CodeBlock
                  title="highlight.tsx"
                  code={`const progress = interpolate(
  frame,
  [start, start + 20],
  [0, 1],
  { extrapolateRight: "clamp" }
);

return (
  <mark style={{
    background: \`rgba(124,58,237,\${progress})\`
  }}>
    {word}
  </mark>
);`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Bleed kinetic typography ── */}
        <div className="relative overflow-hidden py-8" aria-hidden="true" style={{ background: "#0D0D0D" }}>
          <motion.div
            className="font-black leading-none whitespace-nowrap select-none"
            style={{ fontSize: "clamp(5rem,14vw,13rem)", letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1.5px rgba(124,58,237,0.15)", paddingLeft: "clamp(1.5rem,6vw,3rem)" }}
            initial={{ x: "4%", opacity: 0 }}
            whileInView={{ x: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >CODE IS THE</motion.div>
          <motion.div
            className="font-black leading-none whitespace-nowrap select-none"
            style={{ fontSize: "clamp(5rem,14vw,13rem)", letterSpacing: "-0.04em", color: "#ec4899", paddingLeft: "clamp(1.5rem,6vw,3rem)", marginTop: "-0.05em", opacity: 0.9 }}
            initial={{ x: "-4%", opacity: 0 }}
            whileInView={{ x: "0%", opacity: 0.9 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, delay: 0.08, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >TIMELINE.</motion.div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 03 ПОДХОД ════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="03" text="Подход" />
            <BigHeading line1="CODE-DRIVEN" line2="MOTION" />

            <FadeIn delay={0.1}>
              <p className="text-xl mb-14 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>
                Motion-дизайн через код даёт что-то недоступное в After Effects: версионирование, тесты, переиспользование, генерацию серий.
              </p>
            </FadeIn>

            {/* Advantage cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
              variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}
            >
              {[
                {
                  num: "01",
                  title: "Git-версионирование",
                  desc: "Каждая итерация анимации — это коммит. Откат, ветка, merge request — как в обычной разработке.",
                  tag: "Dev workflow",
                },
                {
                  num: "02",
                  title: "Серии из массива",
                  desc: "Нужно 20 вариантов с разным текстом? map() по массиву — и renderMedia() рендерит все параллельно.",
                  tag: "Scalability",
                },
                {
                  num: "03",
                  title: "Параметрические сцены",
                  desc: "Цвет, скорость, текст — всё через пропсы. Один компонент — бесконечно кастомизируемая сцена.",
                  tag: "Flexibility",
                },
              ].map(({ num, title, desc, tag }) => (
                <motion.div
                  key={num}
                  variants={si_}
                  className="p-7 rounded-2xl flex flex-col"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  whileHover={{ y: -5, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.25)" }}
                  transition={{ duration: 0.3, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >
                  <div className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>{num}</div>
                  <div className="font-black mb-3" style={{ fontSize: "clamp(1.3rem,2vw,1.7rem)", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.15 }}>{title}</div>
                  <div className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.4)", flex: 1 }}>{desc}</div>
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase self-start" style={{ border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa", background: "rgba(124,58,237,0.08)" }}>{tag}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stack grid */}
            <FadeIn delay={0.1}>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "3rem" }} />
              <div className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>Стек</div>
            </FadeIn>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {[
                { name: "Remotion 4", sub: "React → Video" },
                { name: "TypeScript", sub: "Type-safe" },
                { name: "spring()", sub: "Physics easing" },
                { name: "renderMedia()", sub: "CLI render" },
              ].map(({ name, sub }) => (
                <motion.div
                  key={name}
                  variants={si_}
                  className="p-5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  suppressHydrationWarning
                >
                  <div className="font-bold text-white mb-1">{name}</div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ 04 О ПРОЕКТЕ ═════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="04" text="О проекте" />

            <div className="mb-10">
              <FadeIn><div style={{ color: "#fff", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>О ПРОЕКТЕ</div></FadeIn>
            </div>

            {/* Top row */}
            <motion.div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>

              {/* Task card */}
              <motion.div variants={si_} className="p-8 rounded-2xl flex flex-col justify-between" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", minHeight: 200 }} suppressHydrationWarning>
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
                    <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Задача</span>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: "clamp(0.95rem,1.4vw,1.1rem)", color: "rgba(255,255,255,0.6)", maxWidth: 540 }}>
                    Доказать что motion-дизайн через код работает — без After Effects, без GUI-таймлайнов. Remotion + TypeScript от идеи до готового MP4.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Motion Design", "Code-driven", "Remotion", "TypeScript"].map(tag => (
                    <span key={tag} className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>{tag}</span>
                  ))}
                </div>
              </motion.div>

              {/* Metrics column */}
              <motion.div variants={si_} className="flex flex-col gap-4 md:w-52" suppressHydrationWarning>
                {[
                  { num: "3", unit: "видео", desc: "разные техники" },
                  { num: "60", unit: "fps", desc: "smooth motion" },
                  { num: "0", unit: "AE", desc: "только код" },
                ].map(({ num, unit, desc }) => (
                  <div key={unit} className="p-5 rounded-2xl flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <span className="font-black leading-none" style={{ fontSize: "2.2rem", letterSpacing: "-0.04em", color: "#fff" }}>{num}</span>
                    <span className="font-bold text-xs uppercase tracking-widest" style={{ color: "#7c3aed" }}>{unit}</span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{desc}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Bottom row */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>

              {/* What was done */}
              <motion.div variants={si_} className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-6">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Что сделано</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Kinetic typography", icon: "01" },
                    { label: "Gradient wipe", icon: "02" },
                    { label: "Typewriter effect", icon: "03" },
                    { label: "Word-by-word reveal", icon: "04" },
                    { label: "Sparkle particles", icon: "05" },
                    { label: "CLI batch render", icon: "06" },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold" style={{ color: "#7c3aed", minWidth: 20 }}>{icon}</span>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tools */}
              <motion.div variants={si_} className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-6">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Инструменты</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Remotion 4", "TypeScript", "React 19", "Node.js", "FFmpeg", "Claude"].map(tool => (
                    <span key={tool} className="text-sm px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.07)" }}>{tool}</span>
                  ))}
                </div>
                <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Весь пайплайн code-native: от компонента до готового MP4 без сторонних приложений.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative" style={{ background: "#0A0A0A" }}>
          {/* Ghost background text for depth */}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div className="font-black leading-none whitespace-nowrap" style={{ fontSize: "clamp(6rem,18vw,17rem)", letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(124,58,237,0.07)" }}>MOTION</div>
          </div>
          {/* Glow */}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "50vw", height: "50vh", background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          </div>

          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <motion.h2
              className="font-black leading-none mb-8"
              style={{ fontSize: "clamp(3rem,10vw,9rem)", letterSpacing: "-0.04em", whiteSpace: "nowrap" }}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <span style={{ color: "#fff" }}>Нужен </span><span style={{ color: "#ec4899" }}>motion?</span>
            </motion.h2>
            <FadeIn delay={0.2}>
              <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.35)", maxWidth: 440, margin: "0 auto 40px" }}>
                Kinetic typography, product animation, promo reel — от концепта до рендера. Код даёт скорость и масштаб.
              </p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <PrimaryButton href={TELEGRAM_URL}>Написать в Telegram</PrimaryButton>
                <GhostButton href="/#works">← Все работы</GhostButton>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
    </>
  )
}
