"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import LanguageToggle from "@/components/ui/language-toggle"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { yandexOctoberDict } from "@/dictionaries/yandex-october"

const ORANGE = "#FF5F1F"
const BLUE = "#0047FF"
const MEDIA = "/works/yandex-october"

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

// ─── SectionLabel / BigHeading ────────────────────────────────────────────────
function SectionLabel({ num, text }: { num: string; text: string }) {
  return (
    <FadeIn>
      <span className="font-mono text-xs uppercase tracking-widest flex items-center gap-3 mb-4" style={{ color: "rgba(255,255,255,0.28)" }}>
        <span>—</span>{num} — {text}
      </span>
    </FadeIn>
  )
}

function BigHeading({ line1, line2, color2 = ORANGE }: { line1: string; line2: string; color2?: string }) {
  const style: React.CSSProperties = { display: "block", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em" }
  return (
    <div className="mb-10">
      <FadeIn><div style={{ ...style, color: "#fff" }}>{line1}</div></FadeIn>
      <FadeIn delay={0.08}><div style={{ ...style, color: color2 }}>{line2}</div></FadeIn>
    </div>
  )
}

// ─── LazyVideo — streams only while on screen ─────────────────────────────────
function LazyVideo({ src, poster, className, style, label }: {
  src: string; poster?: string; className?: string; style?: React.CSSProperties; label?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { rootMargin: "200px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [src])
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      style={style}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
    />
  )
}

// ─── FacadeScreen — wide 3232×288 strip framed as a building screen ──────────
function FacadeScreen({ caption, note }: { caption: string; note: string }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  // On narrow screens the strip scrolls sideways; start on the head in the middle
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  }, [])
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #05060C 0%, #0B0F24 60%, #12111A 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div ref={scrollRef} className="overflow-x-auto" style={{ padding: "clamp(28px,5vw,64px) clamp(16px,3vw,40px)" }}>
        <div style={{ width: "max(100%, 900px)", position: "relative" }}>
          {/* Screen glow */}
          <div aria-hidden="true" style={{ position: "absolute", inset: "-30% -4%", background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${ORANGE}33 0%, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" }} />
          {/* Screen bezel */}
          <div style={{ position: "relative", padding: 6, background: "#1A1A1F", borderRadius: 6, boxShadow: `0 0 60px ${ORANGE}40, inset 0 0 0 1px rgba(255,255,255,0.06)` }}>
            <LazyVideo
              src={`${MEDIA}/facade.mp4`}
              poster={`${MEDIA}/facade-poster.webp`}
              className="block w-full h-auto"
              style={{ aspectRatio: "3232 / 288", borderRadius: 2 }}
              label={caption}
            />
          </div>
          {/* Building ledge */}
          <div aria-hidden="true" style={{ height: 14, margin: "0 2%", background: "linear-gradient(180deg, #24242C, #0E0E12)", borderRadius: "0 0 4px 4px" }} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>{caption}</span>
        <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{note}</span>
      </div>
    </div>
  )
}

// ─── ProcessPlayer — sound toggle, Story version on phones ────────────────────
function ProcessPlayer({ src, srcStory, poster, posterStory, label, soundOn, soundOff }: {
  src: string; srcStory: string; poster: string; posterStory: string; label: string; soundOn: string; soundOff: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)
  const [vertical, setVertical] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)")
    const update = () => setVertical(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [vertical, src])

  const toggle = () => {
    if (!ref.current) return
    ref.current.muted = !ref.current.muted
    setMuted(ref.current.muted)
  }

  const current = vertical ? srcStory : src
  return (
    <div className="relative rounded-2xl overflow-hidden mx-auto" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.06)", maxWidth: vertical ? 420 : "100%" }}>
      <video
        key={current}
        ref={ref}
        src={current}
        poster={vertical ? posterStory : poster}
        className="block w-full h-auto"
        style={{ aspectRatio: vertical ? "9 / 16" : "16 / 9" }}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
      <button
        onClick={toggle}
        className="absolute bottom-4 right-4 w-11 h-11 flex items-center justify-center rounded-full text-white"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}
        aria-label={muted ? soundOn : soundOff}
      >
        {muted
          ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
        }
      </button>
    </div>
  )
}

const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }
const divider = <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function YandexOctoberPage() {
  const t = useDict(yandexOctoberDict)
  const [scrolled, setScrolled] = useState(false)
  const isTouch = useIsTouch()
  const s = isTouch ? scTouch : sc
  const si_ = isTouch ? siTouch : si

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

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
        <NavBackButton href="/#works" label={t.nav.allWorks} />
        <div className="flex items-center gap-3">
          <LanguageToggle dark />
          <motion.a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: ORANGE, color: "#fff", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none" }}
            whileHover={{ scale: 1.05, opacity: 0.88 }} whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            suppressHydrationWarning
          >{t.nav.write}</motion.a>
        </div>
      </header>

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden px-6 md:px-12" style={{ paddingTop: "clamp(110px,14vw,160px)", paddingBottom: "clamp(3rem,6vw,5rem)" }}>
          <div aria-hidden="true" className="absolute pointer-events-none" style={{ top: "-20%", right: "-10%", width: "60vw", height: "60vh", background: `radial-gradient(ellipse, ${BLUE}40 0%, transparent 70%)`, filter: "blur(40px)" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <motion.div className="flex items-center gap-3 mb-8"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <div style={{ width: 28, height: 1, background: ORANGE }} />
              <span className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>{t.hero.eyebrow}</span>
            </motion.div>

            <h1>
              <motion.span className="block font-black leading-none text-white"
                style={{ fontSize: "clamp(2.8rem,8vw,7rem)", letterSpacing: "-0.04em" }}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >{t.hero.title1}</motion.span>
              <motion.span className="block font-black leading-[1.05] mt-2"
                style={{ fontSize: "clamp(1.8rem,4.6vw,4rem)", letterSpacing: "-0.035em", color: ORANGE }}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.9, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >{t.hero.title2}</motion.span>
            </h1>

            <motion.p className="text-base md:text-lg leading-relaxed mt-6 mb-10"
              style={{ color: "rgba(255,255,255,0.55)", maxWidth: "52ch" }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >{t.hero.subtitle}</motion.p>

            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              {t.hero.meta.map(({ label, value }) => (
                <div key={label} style={{ borderLeft: `1px solid ${ORANGE}66`, paddingLeft: 12 }}>
                  <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
                  <div className="font-semibold text-sm text-white">{value}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 1, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <FacadeScreen caption={t.hero.facadeCaption} note={t.hero.draftNote} />
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ CREDITS ═══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-14" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div className="font-mono text-xs uppercase tracking-widest mb-6" style={{ color: "rgba(255,255,255,0.28)" }}>{t.credits.label}</div>
            </FadeIn>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.credits.items.map(({ role, who }, i) => {
                const mine = i === t.credits.items.length - 1
                return (
                  <motion.div key={role} variants={si_} className="p-5 rounded-xl" style={mine ? { background: `${ORANGE}14`, border: `1px solid ${ORANGE}55` } : card} suppressHydrationWarning>
                    <div className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>{role}</div>
                    <div className="font-bold" style={{ color: mine ? ORANGE : "#fff" }}>{who}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 01 ЗАДАЧА ═════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="01" text={t.task.label} />
            <BigHeading line1={t.task.heading1} line2={t.task.heading2} />

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mb-12">
              <FadeIn delay={0.1}>
                <p className="text-lg leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{t.task.intro}</p>
                <p className="text-base" style={{ color: "rgba(255,255,255,0.35)" }}>{t.task.hero}</p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-2">
                  {t.task.limits.map(l => (
                    <span key={l} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ background: `${ORANGE}12`, color: "rgba(255,255,255,0.7)", border: `1px solid ${ORANGE}40` }}>
                      <span style={{ color: ORANGE, marginRight: 6 }}>×</span>{l}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.task.beats.map(({ time, text }, i) => (
                <motion.div key={time} variants={si_} className="p-6 rounded-2xl" style={card} suppressHydrationWarning>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold" style={{ color: ORANGE }}>{time}</span>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>0{i + 1}</span>
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 02 ПЕРВАЯ ВЕРСИЯ ══════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="02" text={t.v1.label} />
            <BigHeading line1={t.v1.heading1} line2={t.v1.heading2} color2={BLUE} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 720 }}>{t.v1.text}</p>
            </FadeIn>
          </div>
        </section>

        {divider}

        {/* ══ 03 СЛОЖНОСТИ ══════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="03" text={t.problems.label} />
            <BigHeading line1={t.problems.heading1} line2={t.problems.heading2} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed mb-14" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>{t.problems.intro}</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 items-start">
              <motion.div className="flex flex-col gap-4" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {t.problems.items.map(({ num, title, problem, fix }) => (
                  <motion.div key={num} variants={si_} className="p-6 md:p-7 rounded-2xl" style={card} suppressHydrationWarning>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-mono text-xs font-bold" style={{ color: ORANGE }}>{num}</span>
                      <span className="font-black" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", letterSpacing: "-0.03em", color: "#fff" }}>{title}</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>{problem}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <span style={{ color: ORANGE, marginRight: 6 }}>→</span>{fix}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="flex flex-col gap-4 md:sticky md:top-24">
                <FadeIn>
                  <div className="rounded-2xl overflow-hidden relative" style={{ background: BLUE }}>
                    <LazyVideo src={`${MEDIA}/head.mp4`} poster={`${MEDIA}/poster.webp`} className="block w-full h-auto" style={{ aspectRatio: "3 / 4" }} label={t.problems.resultLabel} />
                    <span className="absolute top-4 left-4 font-mono text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(8px)" }}>{t.problems.resultLabel}</span>
                  </div>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="font-mono text-xs uppercase tracking-widest mb-3 mt-2" style={{ color: "rgba(255,255,255,0.28)" }}>{t.problems.framesLabel}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ src: `${MEDIA}/first-frame.webp`, alt: t.problems.firstFrame }, { src: `${MEDIA}/last-frame.webp`, alt: t.problems.lastFrame }].map(f => (
                      <figure key={f.src} className="m-0">
                        <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: "3 / 4", background: BLUE }}>
                          <Image src={f.src} alt={f.alt} fill sizes="(max-width: 768px) 50vw, 240px" quality={78} style={{ objectFit: "cover" }} />
                        </div>
                        <figcaption className="font-mono text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>{f.alt}</figcaption>
                      </figure>
                    ))}
                  </div>
                </FadeIn>
              </div>
            </div>
          </div>
        </section>

        {divider}

        {/* ══ 04 АНАТОМИЯ ПРОМПТА ═══════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="04" text={t.prompt.label} />
            <BigHeading line1={t.prompt.heading1} line2={t.prompt.heading2} color2={BLUE} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>{t.prompt.intro}</p>
            </FadeIn>

            <FadeIn>
              <div className="rounded-2xl overflow-hidden" style={{ background: `${BLUE}12`, border: `1px solid ${BLUE}40` }}>
                <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: `1px solid ${BLUE}30` }}>
                  <div className="flex gap-1.5" aria-hidden="true">
                    {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                  </div>
                  <span className="font-mono text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>prompt.txt</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {/* Locks */}
                  <div className="p-6 flex flex-col gap-4" style={{ borderBottom: `1px solid ${BLUE}25` }}>
                    {t.prompt.locks.map(({ key, value }) => (
                      <div key={key}>
                        <div className="font-mono text-xs font-bold mb-1" style={{ color: "#8FA0FF" }}>{key}</div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Timeline */}
                  <div className="p-6 flex flex-col gap-4" style={{ borderBottom: `1px solid ${BLUE}25` }}>
                    {t.task.beats.map(({ time, text }) => (
                      <div key={time}>
                        <div className="font-mono text-xs font-bold mb-1" style={{ color: ORANGE }}>[{time}]</div>
                        <div className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{text}</div>
                      </div>
                    ))}
                  </div>
                  {/* Rules */}
                  <div className="p-6">
                    <div className="font-mono text-xs font-bold mb-3" style={{ color: "#FF6B6B" }}>{t.prompt.rulesTitle}</div>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                      {t.prompt.rules.map(r => (
                        <li key={r} className="font-mono text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>— {r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {divider}

        {/* ══ 05 ИТЕРАЦИИ ═══════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="05" text={t.iterations.label} />
            <BigHeading line1={t.iterations.heading1} line2={t.iterations.heading2} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>{t.iterations.intro}</p>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-[2fr_1.1fr] gap-4 items-start">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[{ src: `${MEDIA}/head-v2.mp4`, label: t.iterations.before, final: false }, { src: `${MEDIA}/head-v3.mp4`, label: t.iterations.after, final: true }].map(v => (
                <FadeIn key={v.src}>
                  <div className="rounded-2xl overflow-hidden" style={{ background: BLUE, border: v.final ? `2px solid ${ORANGE}` : "1px solid rgba(255,255,255,0.08)" }}>
                    <LazyVideo src={v.src} className="block w-full h-auto" style={{ aspectRatio: "3 / 4", opacity: v.final ? 1 : 0.85 }} label={v.label} />
                  </div>
                  <div className="font-mono text-xs mt-3" style={{ color: v.final ? ORANGE : "rgba(255,255,255,0.35)" }}>{v.label}</div>
                </FadeIn>
              ))}
              </div>
              <motion.ul className="flex flex-col gap-3 m-0 p-0 list-none" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {t.iterations.notes.map((n, i) => (
                  <motion.li key={n} variants={si_} className="p-5 rounded-xl flex gap-3" style={card} suppressHydrationWarning>
                    <span className="font-mono text-xs font-bold" style={{ color: ORANGE, minWidth: 20 }}>0{i + 1}</span>
                    <span className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{n}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </section>

        {divider}

        {/* ══ 06 РАЗБОР ═════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <SectionLabel num="06" text={t.process.label} />
            <FadeIn>
              <h2 className="font-black mb-3" style={{ fontSize: "clamp(1.8rem,4vw,3rem)", letterSpacing: "-0.035em", color: "#fff" }}>{t.process.heading}</h2>
              <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>{t.process.desc}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <ProcessPlayer src={t.process.src} srcStory={t.process.srcStory} poster={t.process.poster} posterStory={t.process.posterStory}label={t.process.heading} soundOn={t.video.soundOn} soundOff={t.video.soundOff} />
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="flex flex-wrap items-center gap-2 mt-10">
                <span className="font-mono text-xs uppercase tracking-widest mr-2" style={{ color: "rgba(255,255,255,0.28)" }}>{t.stack.label}</span>
                {t.stack.list.map(tool => (
                  <span key={tool} className="text-sm px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>{tool}</span>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {divider}

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative" style={{ background: "#0A0A0A" }}>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "50vw", height: "50vh", background: `radial-gradient(ellipse, ${ORANGE}1F 0%, transparent 70%)`, filter: "blur(40px)" }} />
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <motion.h2
              className="font-black leading-none mb-8"
              style={{ fontSize: "clamp(2.6rem,8vw,7rem)", letterSpacing: "-0.04em" }}
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <span style={{ color: "#fff" }}>{t.cta.title1}</span><span style={{ color: ORANGE }}>{t.cta.title2}</span>
            </motion.h2>
            <FadeIn delay={0.2}>
              <p className="text-base" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto 40px" }}>{t.cta.desc}</p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold" style={{ padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: ORANGE, color: "#fff", fontSize: "0.9rem", textDecoration: "none" }}>
                  {t.cta.primaryButton}
                </a>
                <Link href="/#works" className="inline-flex items-center font-semibold" style={{ padding: "14px 32px", minHeight: 48, borderRadius: 9999, color: "#fff", fontSize: "0.9rem", border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                  {t.cta.ghostButton}
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>

      </main>
    </>
  )
}
