"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import {
  motion, AnimatePresence,
  useMotionValue, useSpring,
  useScroll, useTransform, useReducedMotion,
  type Variants,
} from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"

// ─── TextReveal ───────────────────────────────────────────────────────────────
function TextReveal({
  children, delay = 0, className, style,
}: {
  children: React.ReactNode; delay?: number
  className?: string; style?: React.CSSProperties
}) {
  return (
    <div style={{ overflow: "hidden", display: "block" }}>
      <motion.div
        className={className}
        style={style}
        initial={{ y: "106%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        {children}
      </motion.div>
    </div>
  )
}

// ─── XPCounter ────────────────────────────────────────────────────────────────
function XPCounter() {
  const [xp, setXp] = useState(0)
  const started = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const target = 2400
        const duration = 1600
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setXp(Math.round(ease * target))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
      {xp.toLocaleString("ru")} <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.3)" }}>/ 3 000</span>
    </div>
  )
}

// ─── FeatureRow ───────────────────────────────────────────────────────────────
function FeatureRow({ label, desc, index }: { label: string; desc: string; index: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="flex items-center gap-4 py-3 cursor-default relative"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: [0.16,1,0.3,1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      suppressHydrationWarning
    >
      {/* Blue accent bar */}
      <motion.div
        style={{ position: "absolute", left: -16, top: 8, bottom: 8, width: 3, background: "#1B3FD8", borderRadius: 2, transformOrigin: "top" }}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        suppressHydrationWarning
      />
      {/* Number */}
      <motion.span
        className="font-mono font-bold text-xs"
        animate={{ color: hovered ? "#1B3FD8" : "rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.15 }}
        style={{ minWidth: 20 }}
        suppressHydrationWarning
      >0{index + 1}</motion.span>
      <div style={{ flex: 1 }}>
        <motion.div
          className="font-bold text-sm"
          style={{ color: "var(--text)" }}
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
          suppressHydrationWarning
        >{label}</motion.div>
        <div className="text-sm" style={{ color: "var(--muted)" }}>{desc}</div>
      </div>
      {/* Arrow */}
      <motion.span
        style={{ color: "#1B3FD8", fontSize: 14 }}
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
        transition={{ duration: 0.2 }}
        suppressHydrationWarning
      >→</motion.span>
    </motion.div>
  )
}

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({
  children, delay = 0, y = 20, className, style,
}: {
  children: React.ReactNode; delay?: number; y?: number
  className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className} style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  )
}

// ─── Stagger helpers ──────────────────────────────────────────────────────────
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

// ─── NavBackButton ────────────────────────────────────────────────────────────
function NavBackButton({ href }: { href: string }) {
  return (
    <motion.div whileHover="hover" suppressHydrationWarning>
      <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", color: "var(--muted)", textDecoration: "none" }}>
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
      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: "var(--text)", color: "var(--bg)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none", cursor: "pointer" }}
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
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: "var(--text)", color: "var(--bg)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", cursor: "pointer" }}
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
      style={{ x: sx, y: sy, display: "inline-flex", alignItems: "center", padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: "transparent", color: "var(--text)", fontWeight: 600, fontSize: "0.9rem", border: "1.5px solid rgba(0,0,0,0.2)", textDecoration: "none", cursor: "pointer" }}
      onMouseMove={onMove} onMouseLeave={onLeave}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      suppressHydrationWarning
    >{children}</motion.a>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNav }: {
  images: { src: string; alt: string }[]
  index: number; onClose: () => void; onNav: (i: number) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNav((index + 1) % images.length)
      if (e.key === "ArrowLeft")  onNav((index - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [index, images.length, onClose, onNav])

  return createPortal(
    <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }} onClick={onClose}
    >
      <button className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white" style={{ background: "rgba(255,255,255,0.1)" }} onClick={onClose} aria-label="Закрыть">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      {images.length > 1 && (
        <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-white" style={{ background: "rgba(255,255,255,0.1)" }} onClick={e => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length) }} aria-label="Предыдущее">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      <motion.div key={index} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE_DEFAULT }} className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()} suppressHydrationWarning>
        <Image src={images[index].src} alt={images[index].alt} width={1400} height={1000} className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl" quality={92} />
        <p className="text-center text-sm mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>{images[index].alt} · {index + 1} / {images.length}</p>
      </motion.div>
      {images.length > 1 && (
        <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-white" style={{ background: "rgba(255,255,255,0.1)" }} onClick={e => { e.stopPropagation(); onNav((index + 1) % images.length) }} aria-label="Следующее">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
    </motion.div>,
    document.body
  )
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────
function VideoPlayer({ src, ratio = "56.25%" }: { src: string; ratio?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  useEffect(() => { ref.current?.play().catch(() => {}) }, [])
  const toggle = () => { if (!ref.current) return; ref.current.muted = !ref.current.muted; setMuted(ref.current.muted) }
  return (
    <div className="relative overflow-hidden w-full rounded-2xl" style={{ paddingBottom: ratio }}>
      <video ref={ref} src={src} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "100%", height: ratio === "48%" ? "130%" : "100%", objectFit: "cover" }} muted loop playsInline controls={false} />
      <button onClick={toggle} className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} aria-label={muted ? "Включить звук" : "Выключить звук"}>
        {muted
          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
        }
      </button>
    </div>
  )
}

// ─── Gallery images ───────────────────────────────────────────────────────────
const GALLERY = [
  { src: "/works/gump/logo-photo.png",  alt: "Логотип Gump Donuts" },
  { src: "/works/gump/tshirt2.png",     alt: "Мерч — футболки" },
  { src: "/works/gump/truck.png",       alt: "Брендированный фургон" },
  { src: "/works/gump/tshirt.png",      alt: "Футболка" },
  { src: "/works/gump/apron.png",       alt: "Фирменный фартук" },
  { src: "/works/gump/billboard.png",   alt: "Билборд EAT OR REGRET" },
  { src: "/works/gump/boxes.png",       alt: "Фирменная упаковка" },
  { src: "/works/gump/shopper.png",     alt: "Шоппер" },
  { src: "/works/gump/lifestyle.png",   alt: "Лайфстайл" },
  { src: "/works/gump/banner.png",      alt: "Рекламный баннер" },
  { src: "/works/gump/poster-cafe.png", alt: "Постер в кофейне" },
]

type LightboxSet = { images: { src: string; alt: string }[]; index: number }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GumpDonutsPage() {
  const [lightbox, setLightbox] = useState<LightboxSet | null>(null)
  const [mounted,  setMounted]  = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const prefersReduced = useReducedMotion()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const openGallery = useCallback((i: number) => setLightbox({ images: GALLERY, index: i }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroImgY     = useTransform(heroScroll, [0,1], prefersReduced ? ["0%","0%"] : ["0%","18%"])
  const heroContentY = useTransform(heroScroll, [0,1], prefersReduced ? ["0%","0%"] : ["0%","-10%"])

  return (
    <>
      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background:         scrolled ? "rgba(237,234,228,0.92)" : "transparent",
          backdropFilter:     scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom:       scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <NavBackButton href="/#works" />
        <HeaderWriteButton href={TELEGRAM_URL} />
      </header>

      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative w-full overflow-hidden" style={{ minHeight: "100vh", background: "#0A0A0A" }}>

          {/* Background image — parallax */}
          <motion.div className="absolute inset-0" style={{ y: heroImgY }} suppressHydrationWarning>
            <motion.div className="absolute inset-0"
              initial={{ scale: 1.06 }} animate={{ scale: 1.0 }}
              transition={{ duration: 16, ease: "easeOut" }}
              suppressHydrationWarning
            >
              <Image src="/works/gump/freepik_wide-cinematic-shot.-a-pi_2742556639.png" alt="Gump Donuts" fill className="object-cover" priority quality={92} />
            </motion.div>
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.1) 100%)" }} aria-hidden="true" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 40%)" }} aria-hidden="true" />

          {/* Split layout */}
          <motion.div className="relative grid grid-cols-1 md:grid-cols-2 items-end px-6 md:px-12"
            style={{ minHeight: "100vh", paddingBottom: "clamp(3rem,6vw,5rem)", paddingTop: 100, y: heroContentY }}
            suppressHydrationWarning
          >
            {/* Left — content */}
            <div className="flex flex-col justify-end">

              {/* Category badge */}
              <motion.div className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.25)" }} />
                <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>Brand Identity · 2026</span>
              </motion.div>

              {/* H1 */}
              <motion.h1 className="font-black leading-none text-white mb-6"
                style={{ fontSize: "clamp(4rem,10vw,9rem)", letterSpacing: "-0.04em" }}
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1.0, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                EAT OR<br /><span style={{ color: "#F472B6" }}>REGRET.</span>
              </motion.h1>

              {/* Desc */}
              <motion.p className="text-base md:text-lg leading-relaxed mb-10"
                style={{ color: "rgba(255,255,255,0.45)", maxWidth: "42ch" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                360° айдентика за 3 дня — маскот, упаковка, мерч, ролик. Без студии и фотографа.
              </motion.p>

              {/* Meta row */}
              <motion.div className="flex flex-wrap gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {[
                  { label: "Клиент", value: "Gump Donuts" },
                  { label: "Стек",   value: "Kling · Figma · PS" },
                  { label: "Охват",  value: "360° Identity" },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderLeft: "1px solid rgba(255,255,255,0.12)", paddingLeft: 12 }}>
                    <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.28)" }}>{label}</div>
                    <div className="font-semibold text-sm text-white">{value}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — scroll indicator only on desktop */}
            <div className="hidden md:flex justify-end items-end pb-2">
              <motion.div className="flex flex-col items-center gap-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                suppressHydrationWarning
                aria-hidden="true"
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.2)", writingMode: "vertical-rl" }}>scroll</span>
                <div style={{ width: 1, height: 56, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }} />
              </motion.div>
            </div>
          </motion.div>
        </section>

        <div className="mx-6 md:mx-12" style={{ height: 1, background: "var(--border)" }} />

        {/* ══ 01 ИДЕЯ ══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-16">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(0,0,0,0.55)" }}>
                <span>—</span>01 — Идея
              </span>
            </FadeIn>

            <div className="mb-10">
              <FadeIn><div style={{ color: "var(--text)", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>ОТКУДА ВЗЯЛСЯ</div></FadeIn>
              <FadeIn delay={0.08}><div style={{ color: "#1B3FD8", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>GUMP?</div></FadeIn>
            </div>

            {/* Brand story — full width, 2-col text */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 mb-14"
              variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            >
              <motion.p variants={staggerItem} className="text-lg leading-relaxed" style={{ color: "var(--muted)", maxWidth: "65ch" }}>
                <strong style={{ color: "var(--text)" }}>Форрест Гамп бежал просто потому что бежал.</strong> Без диеты, без подсчёта калорий, без сторис о «читмиле». Добежал до финиша — и съел что хотел. Это честно.
              </motion.p>
              <motion.p variants={staggerItem} className="text-lg leading-relaxed" style={{ color: "var(--muted)", maxWidth: "65ch" }}>
                Gump Donuts — ответ фитнес-маркетингу, который стыдит тебя за сахар. Тезис простой: <strong style={{ color: "var(--text)" }}>отработай и заслужи пончик.</strong> Без вины, без оправданий.
              </motion.p>
              <motion.p variants={staggerItem} className="text-lg leading-relaxed md:col-span-2" style={{ color: "var(--muted)", maxWidth: "65ch" }}>
                Ирония над «осознанным потреблением» — добрая, не едкая. Объединяет тех, кто бегает утром и ест пончики вечером. Бородатый бегун с пончиком в руке стал голосом этого бренда.
              </motion.p>
            </motion.div>

            <div className="mb-20" />

            {/* Gamification block — phone left, content right */}
            <FadeIn>
              <div style={{ height: 1, background: "var(--border)", marginBottom: "4rem" }} />
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-center">

              {/* Left — phone mockup */}
              <FadeIn y={40} delay={0.1}>
                <div className="flex justify-center md:justify-start pl-0 md:pl-8">
                  {/* Phone shell */}
                  <div className="relative" style={{ width: 290, height: 580 }}>
                    {/* Animated glow */}
                    <motion.div
                      className="absolute" aria-hidden="true"
                      style={{ inset: -24, borderRadius: 60, background: "radial-gradient(ellipse at 50% 60%, rgba(27,63,216,0.22) 0%, rgba(244,114,182,0.12) 50%, transparent 70%)", filter: "blur(20px)" }}
                      animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.04, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      suppressHydrationWarning
                    />
                    {/* Frame */}
                    <div className="absolute inset-0 rounded-[48px]" style={{ background: "linear-gradient(160deg, #2a2a2a 0%, #111 100%)", boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
                      {/* Screen */}
                      <div className="absolute rounded-[40px] overflow-hidden" style={{ inset: 6, background: "#0D0D12" }}>

                        {/* Dynamic Island */}
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3" style={{ top: 12, height: 28, background: "#000", borderRadius: 20, zIndex: 20, minWidth: 96 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }} />
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "#1a1a1a" }} />
                        </div>

                        {/* Status bar */}
                        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5" style={{ height: 52, paddingTop: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-mono,monospace)" }}>9:41</span>
                          <div className="flex items-center gap-1" aria-hidden="true">
                            {[3,4,4].map((h,i) => <div key={i} style={{ width: 3, height: h, background: "rgba(255,255,255,0.4)", borderRadius: 1 }} />)}
                            <div style={{ width: 15, height: 7, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 2, marginLeft: 3, padding: "1px 1px" }}><div style={{ width: "70%", height: "100%", background: "rgba(255,255,255,0.5)", borderRadius: 1 }} /></div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col" style={{ paddingTop: 56, paddingBottom: 18, paddingLeft: 16, paddingRight: 16 }}>

                          {/* App header */}
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-mono,monospace)" }}>Привет, Макс</div>
                              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Сегодня активный день</div>
                            </div>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1B3FD8,#F472B6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                          </div>

                          {/* XP Ring card */}
                          <div className="rounded-2xl mb-3 flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(27,63,216,0.25) 0%, rgba(244,114,182,0.15) 100%)", border: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px" }}>
                            {/* Animated Ring */}
                            <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                              <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: "rotate(-90deg)" }}>
                                <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
                                <motion.circle
                                  cx="26" cy="26" r="22" fill="none"
                                  stroke="url(#xpGrad)" strokeWidth="4" strokeLinecap="round"
                                  initial={{ strokeDasharray: `0 ${2*Math.PI*22}` }}
                                  whileInView={{ strokeDasharray: `${2*Math.PI*22*0.8} ${2*Math.PI*22}` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                  suppressHydrationWarning
                                />
                                <defs><linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1B3FD8"/><stop offset="100%" stopColor="#F472B6"/></linearGradient></defs>
                              </svg>
                              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#fff" }}>80%</div>
                            </div>
                            <div>
                              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono,monospace)", marginBottom: 2 }}>XP до пончика</div>
                              {/* Animated XP counter */}
                              <XPCounter />
                              <motion.div
                                style={{ fontSize: 10, color: "#F472B6", fontWeight: 600, marginTop: 2 }}
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                suppressHydrationWarning
                              >+600 XP сегодня</motion.div>
                            </div>
                          </div>

                          {/* Activity cards */}
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-mono,monospace)", marginBottom: 8 }}>Активности</div>
                          <div className="flex flex-col gap-2 mb-3">
                            {[
                              { label: "Пробежка", val: "5.2 км", xp: "+300 XP", done: true,  icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",                                                      delay: 0.7 },
                              { label: "Велосипед", val: "8 км",  xp: "+200 XP", done: true,  icon: "M5 17H3a2 2 0 01-2-2v-3a4 4 0 014-4h12a4 4 0 014 4v3a2 2 0 01-2 2h-2M12 17l-2 2 2 2M8 17H6m14 0h-2", delay: 0.85 },
                              { label: "Пончик",   val: "задание", xp: "+500 XP", done: false, icon: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM12 8v4l3 3", delay: 1.0 },
                            ].map(({ label, val, xp, done, icon, delay }) => (
                              <motion.div
                                key={label}
                                className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                                style={{ background: done ? "rgba(27,63,216,0.12)" : "rgba(255,255,255,0.04)", border: `1px solid ${done ? "rgba(27,63,216,0.2)" : "rgba(255,255,255,0.05)"}` }}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay, ease: [0.16,1,0.3,1] }}
                                suppressHydrationWarning
                              >
                                <div style={{ width: 30, height: 30, borderRadius: 10, background: done ? "rgba(27,63,216,0.25)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={done ? "#6e90ff" : "rgba(255,255,255,0.25)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: done ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)", lineHeight: 1.2 }}>{label}</div>
                                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "var(--font-mono,monospace)" }}>{val}</div>
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 700, color: done ? "#F472B6" : "rgba(255,255,255,0.2)", fontFamily: "var(--font-mono,monospace)" }}>{xp}</div>
                                {done && (
                                  <motion.div
                                    style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(27,63,216,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: delay + 0.2 }}
                                    suppressHydrationWarning
                                  >
                                    <svg width="8" height="8" viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" stroke="#6e90ff" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}
                          </div>

                          {/* Reward banner */}
                          <motion.div
                            className="rounded-2xl mt-auto flex items-center gap-3"
                            style={{ background: "linear-gradient(135deg,rgba(244,114,182,0.15),rgba(244,114,182,0.06))", border: "1px solid rgba(244,114,182,0.2)", padding: "10px 12px" }}
                            animate={{ borderColor: ["rgba(244,114,182,0.2)", "rgba(244,114,182,0.45)", "rgba(244,114,182,0.2)"] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            suppressHydrationWarning
                          >
                            <div style={{ width: 34, height: 34, borderRadius: 12, background: "rgba(244,114,182,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"><path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 6v4l3 3"/></svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#F472B6", lineHeight: 1.2 }}>Glazed Classic</div>
                              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono,monospace)" }}>600 XP до награды</div>
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(244,114,182,0.6)", fontFamily: "var(--font-mono,monospace)", background: "rgba(244,114,182,0.1)", padding: "3px 7px", borderRadius: 6 }}>СКОРО</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    {/* Side buttons */}
                    <div className="absolute rounded-r-full" style={{ width: 3, height: 36, background: "#222", right: -3, top: 100 }} />
                    <div className="absolute rounded-l-full" style={{ width: 3, height: 28, background: "#222", left: -3, top: 80 }} />
                    <div className="absolute rounded-l-full" style={{ width: 3, height: 28, background: "#222", left: -3, top: 116 }} />
                  </div>
                </div>
              </FadeIn>

              {/* Right — gamification content */}
              <motion.div className="flex flex-col gap-8"
                variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
              >
                <motion.div variants={staggerItem}>
                  <div className="font-black leading-none mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,3rem)", letterSpacing: "-0.03em" }}>
                    <span style={{ color: "var(--text)" }}>ГЕЙМИФИКАЦИЯ </span><br />
                    <span style={{ color: "#1B3FD8" }}>КАК МЕХАНИКА</span>
                  </div>
                </motion.div>

                <motion.p variants={staggerItem} className="text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
                  Бренд строится на принципе <strong style={{ color: "var(--text)" }}>reward loop</strong> — отработал активность, заработал XP, получил пончик. Приложение отслеживает каждый километр и открывает награды.
                </motion.p>

                {/* Feature list with hover micro-interactions */}
                <motion.div variants={staggerItem} className="flex flex-col">
                  {[
                    { label: "XP система",       desc: "каждый километр = очки" },
                    { label: "Reward loop",       desc: "достиг цели — получи пончик" },
                    { label: "Activity tracking", desc: "бег, велосипед, зал" },
                    { label: "Loyalty program",   desc: "уровни и эксклюзивные награды" },
                  ].map(({ label, desc }, i) => (
                    <FeatureRow key={label} label={label} desc={desc} index={i} />
                  ))}
                </motion.div>

                {/* Quote */}
                <motion.div variants={staggerItem}>
                  <div className="font-black leading-tight" style={{ fontSize: "clamp(1.5rem,2.8vw,2.2rem)", letterSpacing: "-0.025em" }}>
                    <span style={{ color: "var(--text)" }}>«Беги. </span><span style={{ color: "#F472B6" }}>Зарабатывай. </span><span style={{ color: "var(--text)" }}>Съешь.»</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="mx-6 md:mx-12" style={{ height: 1, background: "var(--border)" }} />

        {/* ══ 02 IDENTITY ══════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-16" style={{ background: "var(--surface)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(0,0,0,0.55)" }}>
                <span>—</span>02 — Айдентика
              </span>
            </FadeIn>

            <div className="mb-10">
              <FadeIn><div style={{ color: "var(--text)", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>ЦВЕТ, ФОРМА</div></FadeIn>
              <FadeIn delay={0.08}><div style={{ color: "#F472B6", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>ХАРАКТЕР</div></FadeIn>
            </div>

            {/* Swatches */}
            <motion.div className="flex gap-3 mb-10 flex-wrap" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
              {[
                { color: "#1B3FD8", name: "Gump Blue",   hex: "#1B3FD8", role: "Основной" },
                { color: "#F472B6", name: "Donut Pink",  hex: "#F472B6", role: "Акцент" },
                { color: "#FFFFFF", name: "Glaze White", hex: "#FFFFFF", role: "Нейтральный" },
                { color: "#0A0A0A", name: "Deep Dark",   hex: "#0A0A0A", role: "Фон" },
              ].map(({ color, name, hex, role }) => (
                <motion.div key={color} variants={staggerItem}
                  className="rounded-2xl overflow-hidden flex-1 min-w-[130px]"
                  style={{ border: "1px solid var(--border)" }}
                  whileHover={{ y: -5 }} suppressHydrationWarning
                >
                  <div style={{ height: 120, background: color, borderBottom: color === "#FFFFFF" ? "1px solid rgba(0,0,0,0.08)" : undefined }} />
                  <div className="p-3" style={{ background: "var(--bg)" }}>
                    <div className="font-bold text-sm mb-0.5" style={{ color: "var(--text)" }}>{name}</div>
                    <div className="font-mono text-xs mb-0.5" style={{ color: "var(--muted)" }}>{hex}</div>
                    <div className="font-mono" style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{role}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gallery grid — desktop */}
            <div className="hidden md:grid" style={{ gridTemplateColumns: "repeat(12, 1fr)", gap: 12 }}>
              {/* Row 1: wide truck (7 cols 16:10) + tall apron (5 cols 4:5) */}
              <GCell src="/works/gump/truck.png"      alt="Брендированный фургон" label="Брендинг фургона"   col="1/8"  row={1} ratio="16/10" i={0} onClick={() => openGallery(2)} />
              <GCell src="/works/gump/apron.png"      alt="Фирменный фартук"      label="Фартук · Мерч"      col="8/13" row={1} ratio="4/5"   i={1} onClick={() => openGallery(4)} />
              {/* Row 2: square logo-photo (4 cols 1:1) + square boxes (4 cols 1:1) + tall tshirt (4 cols 4:5) */}
              <GCell src="/works/gump/logo-photo.png" alt="Логотип"               label="Логотип"            col="1/5"  row={2} ratio="1"     i={2} onClick={() => openGallery(0)} />
              <GCell src="/works/gump/boxes.png"      alt="Упаковка"              label="Упаковка · Коробки" col="5/9"  row={2} ratio="1"     i={3} onClick={() => openGallery(6)} />
              <GCell src="/works/gump/tshirt.png"     alt="Футболка"              label="Футболка · Мерч"    col="9/13" row={2} ratio="4/5"   i={4} onClick={() => openGallery(3)} />
              {/* Row 3: square tshirt2 (5 cols) + wide shopper (7 cols 16:9) */}
              <GCell src="/works/gump/tshirt2.png"    alt="Футболки мерч"         label="Мерч · Линейка"     col="1/6"  row={3} ratio="1"     i={5} onClick={() => openGallery(1)} />
              <GCell src="/works/gump/lifestyle.png"  alt="Лайфстайл"             label="Продуктовый кадр"   col="6/13" row={3} ratio="16/9"  i={6} onClick={() => openGallery(8)} />
              {/* Row 4: square shopper (5 cols) + wide billboard (7 cols 16:9) */}
              <GCell src="/works/gump/shopper.png"    alt="Шоппер"                label="Шоппер · Мерч"      col="1/6"  row={4} ratio="1"     i={7} onClick={() => openGallery(7)} />
              <GCell src="/works/gump/billboard.png"  alt="Билборд"               label="Наружная реклама"   col="6/13" row={4} ratio="16/9"  i={8} onClick={() => openGallery(5)} />
              {/* Row 5: banner (7 cols) + cafe poster (5 cols) */}
              <GCell src="/works/gump/banner.png"      alt="Рекламный баннер"        label="Баннер · OOH"       col="1/8"  row={5} ratio="16/9"  i={9}  onClick={() => openGallery(9)} />
              <GCell src="/works/gump/poster-cafe.png" alt="Постер в кофейне"        label="Постер · Мокап"     col="8/13" row={5} ratio="16/9"  i={10} onClick={() => openGallery(10)} />
            </div>
            {/* Gallery grid — mobile 2-col */}
            <div className="grid md:hidden" style={{ gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { src: "/works/gump/truck.png",      alt: "Брендированный фургон", label: "Фургон",    ratio: "16/10", gi: 2 },
                { src: "/works/gump/apron.png",      alt: "Фирменный фартук",      label: "Фартук",    ratio: "4/5",   gi: 4 },
                { src: "/works/gump/logo-photo.png", alt: "Логотип",               label: "Логотип",   ratio: "1",     gi: 0 },
                { src: "/works/gump/boxes.png",      alt: "Упаковка",              label: "Упаковка",  ratio: "1",     gi: 6 },
                { src: "/works/gump/tshirt2.png",    alt: "Футболки",              label: "Мерч",      ratio: "1",     gi: 1 },
                { src: "/works/gump/lifestyle.png",  alt: "Лайфстайл",             label: "Лайфстайл", ratio: "16/9",  gi: 8 },
                { src: "/works/gump/shopper.png",    alt: "Шоппер",                label: "Шоппер",    ratio: "1",     gi: 7 },
                { src: "/works/gump/billboard.png",  alt: "Билборд",               label: "Наружка",   ratio: "16/9",  gi: 5 },
                { src: "/works/gump/banner.png",      alt: "Рекламный баннер",  label: "Баннер",         ratio: "16/9", gi: 9  },
                { src: "/works/gump/poster-cafe.png", alt: "Постер в кофейне",  label: "Постер · Мокап", ratio: "16/9", gi: 10 },
              ].map(({ src, alt, label, ratio, gi }, i) => (
                <GCell key={src} src={src} alt={alt} label={label} col="auto" row={0} ratio={ratio} i={i} onClick={() => openGallery(gi)} />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-6 md:mx-12" style={{ height: 1, background: "var(--border)" }} />

        {/* ══ 03 AI PIPELINE ═══════════════════════════════════════════════ */}
        <section className="py-16" style={{ background: "#0D0D0D" }}>
          <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span>—</span>03 — AI Workflow
              </span>
            </FadeIn>

            <div className="mb-6">
              <FadeIn><div style={{ color: "#fff", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>CGI БЕЗ</div></FadeIn>
              <FadeIn delay={0.08}><div style={{ color: "#6e90ff", display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>СТУДИИ</div></FadeIn>
            </div>

            <FadeIn delay={0.1}>
              <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 700 }}>
                Никаких съёмочных групп и реквизита. Весь визуал — от фургона в космосе до пончика в невесомости — сгенерирован и доработан в Kling, Figma и Photoshop за три дня.
              </p>
            </FadeIn>

            {/* Workflow board */}
            <FadeIn delay={0.05}>
              <div className="rounded-2xl overflow-hidden mb-6">
                <Image src="/works/gump/workflow-board.png" alt="AI Pipeline — Kling воркфлоу" width={1920} height={1080} className="w-full h-auto" quality={92} />
              </div>
            </FadeIn>

            {/* Pipeline video */}
            <FadeIn delay={0.08}>
              <div className="rounded-2xl overflow-hidden mb-6" style={{ background: "#000" }}>
                <video src="/works/gump/pipeline.mp4" className="w-full h-auto" style={{ display: "block", maxHeight: "80vh" }} autoPlay muted loop playsInline />
              </div>
            </FadeIn>

            {/* Space grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FadeIn>
                <div className="rounded-2xl overflow-hidden" style={{ maxHeight: 360 }}>
                  <Image src="/works/gump/space1.png" alt="Астронавт за рулём фургона в космосе" width={1280} height={853} className="w-full h-full object-cover rounded-2xl" style={{ maxHeight: 360 }} quality={92} />
                </div>
              </FadeIn>
              <FadeIn delay={0.08}>
                <div className="rounded-2xl overflow-hidden" style={{ background: "#000", maxHeight: 360 }}>
                  <video src="/works/gump/space-video.mp4" className="w-full h-full object-cover" style={{ display: "block", maxHeight: 360 }} autoPlay muted loop playsInline />
                </div>
              </FadeIn>
            </div>

            {/* Tool cards */}
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {[
                { num: "Инструмент 01", name: "Kling 3.0",   desc: "Фотореалистичные сцены без студии: фургон в городе, пончики в невесомости, lifestyle-кадры. Всё что обычно стоит недели съёмок — из Kling за часы.", tag: "AI Image Gen" },
                { num: "Инструмент 02", name: "Figma",        desc: "Системная айдентика: компонентная библиотека, автолейауты, сетки для упаковки, digital и outdoor. Все мокапы и носители собраны здесь.", tag: "Design System" },
                { num: "Инструмент 03", name: "Photoshop",    desc: "AI-кадры вживляются в реальные среды: билборды, фургон, одежда. Тени, светокоррекция, перспектива — то что делает генерацию неотличимой от съёмки.", tag: "Compositing" },
              ].map(({ num, name, desc, tag }) => (
                <motion.div key={name} variants={staggerItem}
                  className="rounded-2xl p-8"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  whileHover={{ y: -4 }} suppressHydrationWarning
                >
                  <div className="font-mono text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>{num}</div>
                  <div className="font-black mb-4" style={{ fontSize: "clamp(1.6rem,2.5vw,2.2rem)", letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}>{name}</div>
                  <div className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</div>
                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase" style={{ border: "1px solid rgba(27,63,216,0.35)", color: "#6e90ff", background: "rgba(27,63,216,0.08)" }}>{tag}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </section>

        <div style={{ height: 1, background: "var(--border)" }} />

        {/* ══ 04 В ДВИЖЕНИИ ════════════════════════════════════════════════ */}
        <section className="py-24 overflow-hidden">
          {/* Bleed kinetic typography — full width */}
          <div className="relative mb-4" aria-hidden="true" style={{ overflow: "hidden" }}>
            <motion.div
              className="font-black leading-none whitespace-nowrap select-none"
              style={{
                fontSize: "clamp(5rem,14vw,13rem)",
                letterSpacing: "-0.04em",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(0,0,0,0.08)",
                paddingLeft: "clamp(1.5rem,6vw,3rem)",
              }}
              initial={{ x: "4%", opacity: 0 }}
              whileInView={{ x: "0%", opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              suppressHydrationWarning
            >
              GLAZING THROUGH
            </motion.div>
            <motion.div
              className="font-black leading-none whitespace-nowrap select-none"
              style={{
                fontSize: "clamp(5rem,14vw,13rem)",
                letterSpacing: "-0.04em",
                color: "#F472B6",
                paddingLeft: "clamp(1.5rem,6vw,3rem)",
                marginTop: "-0.05em",
              }}
              initial={{ x: "-4%", opacity: 0 }}
              whileInView={{ x: "0%", opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              suppressHydrationWarning
            >
              THE GALAXY
            </motion.div>
          </div>

          <div className="px-6 md:px-12" style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn delay={0.15}>
              <p className="text-xl mb-10 leading-relaxed" style={{ color: "var(--muted)", maxWidth: 620, fontWeight: 400 }}>
                Рекламный ролик без актёров и оператора. Пончик в невесомости — буквально то, что обещает слоган.
              </p>
            </FadeIn>

            <FadeIn delay={0.2}>
              <VideoPlayer src="/works/gump/ad.mp4" ratio="48%" />
            </FadeIn>
          </div>
        </section>

        <div className="mx-6 md:mx-12" style={{ height: 1, background: "var(--border)" }} />

        {/* ══ 05 О ПРОЕКТЕ ═════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-16">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(0,0,0,0.55)" }}>
                <span>—</span>05 — О проекте
              </span>
            </FadeIn>

            <div className="mb-12">
              <FadeIn><div style={{ display: "block", color: "var(--text)", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }}>О ПРОЕКТЕ</div></FadeIn>
            </div>

            {/* Top row: wide task card + metrics column */}
            <motion.div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 mb-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>

              {/* Задача — wide */}
              <motion.div variants={staggerItem} className="p-8 rounded-2xl flex flex-col justify-between" style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 220 }} suppressHydrationWarning>
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#1B3FD8", display: "inline-block" }} />
                    <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Задача</span>
                  </div>
                  <p className="leading-relaxed" style={{ fontSize: "clamp(0.95rem,1.4vw,1.1rem)", color: "var(--text)", maxWidth: 560 }}>
                    Создать полноценный фирменный стиль для Gump Donuts — от нуля до готового к производству брендбука. Проверить, может ли связка AI-инструментов и одного дизайнера заменить студийный процесс по качеству результата.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {["Брендинг", "AI Production", "Айдентика", "Промо"].map(tag => (
                    <span key={tag} className="font-mono text-xs px-3 py-1 rounded-full" style={{ background: "rgba(27,63,216,0.08)", color: "#1B3FD8", border: "1px solid rgba(27,63,216,0.15)" }}>{tag}</span>
                  ))}
                </div>
              </motion.div>

              {/* Метрики — стопка */}
              <motion.div variants={staggerItem} className="flex flex-col gap-4 md:w-56" suppressHydrationWarning>
                {[
                  { num: "3", unit: "дня", desc: "полный цикл" },
                  { num: "360°", unit: "охват", desc: "от лого до видео" },
                  { num: "0", unit: "студий", desc: "AI + дизайнер" },
                ].map(({ num, unit, desc }) => (
                  <div key={unit} className="p-5 rounded-2xl flex flex-col gap-1" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                    <span className="font-black leading-none" style={{ fontSize: "2.2rem", letterSpacing: "-0.04em", color: "var(--text)" }}>{num}</span>
                    <span className="font-bold text-xs uppercase tracking-widest" style={{ color: "#1B3FD8" }}>{unit}</span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>{desc}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Bottom row: deliverables + tools */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>

              {/* Что сделано */}
              <motion.div variants={staggerItem} className="p-8 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-6">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EA580C", display: "inline-block" }} />
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Что сделано</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Логотип и маскот", icon: "01" },
                    { label: "Фирменный стиль", icon: "02" },
                    { label: "Упаковка и мерч", icon: "03" },
                    { label: "Наружная реклама", icon: "04" },
                    { label: "Промо-материалы", icon: "05" },
                    { label: "Видеопродакшн", icon: "06" },
                  ].map(({ label, icon }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold" style={{ color: "#EA580C", minWidth: 20 }}>{icon}</span>
                      <span className="text-sm" style={{ color: "var(--text)" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Инструменты */}
              <motion.div variants={staggerItem} className="p-8 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }} suppressHydrationWarning>
                <div className="flex items-center gap-2 mb-6">
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F472B6", display: "inline-block" }} />
                  <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "var(--muted)" }}>Инструменты</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Midjourney", "Kling AI", "Nano Banana 2", "Seedance 2.0", "Adobe Firefly", "Figma", "CapCut", "Runway", "Claude", "Photoshop"].map(tool => (
                    <span key={tool} className="text-sm px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(0,0,0,0.04)", color: "var(--text)", border: "1px solid var(--border)" }}>{tool}</span>
                  ))}
                </div>
                <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Весь стек — AI-нативный. Ни одного стокового изображения, ни одной лицензионной фотографии.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="mx-6 md:mx-12" style={{ height: 1, background: "var(--border)" }} />

        {/* ══ CTA ══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative" style={{ background: "var(--bg)" }}>
          {/* Ghost background text for depth */}
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <div className="font-black leading-none whitespace-nowrap" style={{ fontSize: "clamp(8rem,22vw,20rem)", letterSpacing: "-0.04em", color: "transparent", WebkitTextStroke: "1px rgba(0,0,0,0.05)" }}>GUMP</div>
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <motion.h2
              className="font-black leading-none mb-8"
              style={{ fontSize: "clamp(3rem,10vw,9rem)", letterSpacing: "-0.04em", whiteSpace: "nowrap" }}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              suppressHydrationWarning
            >
              <span style={{ color: "var(--text)" }}>Есть </span><span style={{ color: "#1B3FD8" }}>идея?</span>
            </motion.h2>
            <FadeIn delay={0.2}>
              <p className="text-base mb-10" style={{ color: "var(--muted)", maxWidth: 440, margin: "0 auto 40px" }}>
                Ваша идея заслуживает визуала, который продаёт. Собираю бренд-айдентику под ключ: логотип, стиль, упаковка, видео.
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

      {/* Lightbox */}
      <AnimatePresence>
        {mounted && lightbox !== null && (
          <Lightbox images={lightbox.images} index={lightbox.index} onClose={closeLightbox} onNav={i => setLightbox(lb => lb ? { ...lb, index: i } : null)} />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── GCell — gallery cell helper ──────────────────────────────────────────────
function GCell({ src, alt, label, col, row, ratio, i, onClick }: {
  src: string; alt: string; label?: string; col: string; row: number
  ratio: string; i: number; onClick: () => void
}) {
  return (
    <motion.button type="button"
      className="rounded-xl overflow-hidden cursor-zoom-in relative group"
      style={{ gridColumn: col !== "auto" ? col : undefined, gridRow: row || undefined, aspectRatio: ratio, border: "1px solid var(--border)" }}
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_DEFAULT }}
      whileHover={{ scale: 1.01 }}
      suppressHydrationWarning
    >
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" quality={85} />
      {label && (
        <span className="absolute bottom-3 left-3 z-10 pointer-events-none"
          style={{
            background: "rgba(10,10,10,0.72)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.82)",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "5px 10px",
            borderRadius: 7,
          }}
        >{label}</span>
      )}
    </motion.button>
  )
}
