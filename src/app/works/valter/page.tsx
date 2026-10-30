"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import LanguageToggle from "@/components/ui/language-toggle"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { valterDict } from "@/dictionaries/valter"

const RED = "#E4002B"
const BLUE = "#2F6BFF"
const MEDIA = "/works/valter"

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

function BigHeading({ line1, line2, color2 = RED }: { line1: string; line2: string; color2?: string }) {
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
      preload="none"
      aria-label={label}
    />
  )
}

// ─── AdPlayer — vertical final cut with a sound toggle ────────────────────────
function AdPlayer({ src, poster, label, soundOn, soundOff }: {
  src: string; poster: string; label: string; soundOn: string; soundOff: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.play().catch(() => {}); else el.pause() },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [src])

  const toggle = () => {
    if (!ref.current) return
    ref.current.muted = !ref.current.muted
    setMuted(ref.current.muted)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden mx-auto w-full" style={{ background: "#000", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 400, boxShadow: `0 30px 80px ${BLUE}30` }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        className="block w-full h-auto"
        style={{ aspectRatio: "9 / 16" }}
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
export default function ValterPage() {
  const t = useDict(valterDict)
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
            style={{ display: "inline-flex", alignItems: "center", padding: "8px 20px", minHeight: 36, borderRadius: 9999, background: RED, color: "#fff", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.02em", textDecoration: "none" }}
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
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-center" style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div>
              <motion.div className="flex items-center gap-3 mb-8"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                <div style={{ width: 28, height: 1, background: RED }} />
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
                  style={{ fontSize: "clamp(1.8rem,4.2vw,3.6rem)", letterSpacing: "-0.035em", color: RED }}
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

              <motion.div className="grid grid-cols-2 gap-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {t.hero.meta.map(({ label, value }) => (
                  <div key={label} style={{ borderLeft: `1px solid ${RED}66`, paddingLeft: 12 }}>
                    <div className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</div>
                    <div className="font-semibold text-sm text-white">{value}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 1, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <AdPlayer src={`${MEDIA}/final.mp4`} poster={`${MEDIA}/final-poster.webp`} label={t.hero.playerLabel} soundOn={t.video.soundOn} soundOff={t.video.soundOff} />
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 01 ЗАДАЧА ═════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="01" text={t.task.label} />
            <BigHeading line1={t.task.heading1} line2={t.task.heading2} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 720 }}>{t.task.intro}</p>
            </FadeIn>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.task.beats.map(({ time, title, text }, i) => (
                <motion.div key={time} variants={si_} className="p-6 md:p-7 rounded-2xl" style={card} suppressHydrationWarning>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold" style={{ color: RED }}>{time}</span>
                    <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>0{i + 1}</span>
                  </div>
                  <div className="font-black mb-2" style={{ fontSize: "clamp(1.2rem,2vw,1.5rem)", letterSpacing: "-0.03em", color: "#fff" }}>{title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 02 ПЕРСОНАЖ ═══════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="02" text={t.character.label} />
            <BigHeading line1={t.character.heading1} line2={t.character.heading2} color2={BLUE} />

            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 mb-12">
              <FadeIn delay={0.1}>
                <p className="text-lg leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{t.character.intro}</p>
                <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{t.character.voice}</p>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="flex flex-wrap gap-2">
                  {t.character.traits.map(tr => (
                    <span key={tr} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ background: `${BLUE}14`, color: "rgba(255,255,255,0.7)", border: `1px solid ${BLUE}45` }}>{tr}</span>
                  ))}
                </div>
              </FadeIn>
            </div>

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.character.shots.map(({ src, alt }) => (
                <motion.figure key={src} variants={si_} className="m-0" suppressHydrationWarning>
                  <div className="rounded-xl overflow-hidden relative" style={{ aspectRatio: "1200 / 670", background: "#fff" }}>
                    <Image src={`${MEDIA}/${src}.webp`} alt={alt} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px" quality={78} style={{ objectFit: "cover" }} />
                  </div>
                  <figcaption className="font-mono text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>{alt}</figcaption>
                </motion.figure>
              ))}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 03 ИДЕЯ ═══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="03" text={t.idea.label} />
            <BigHeading line1={t.idea.heading1} line2={t.idea.heading2} />
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-3" variants={s} initial="hidden" whileInView="show" viewport={{ once: true }}>
              {t.idea.columns.map(({ title, items }, i) => {
                const mine = i === t.idea.columns.length - 1
                return (
                  <motion.div key={title} variants={si_} className="p-6 md:p-7 rounded-2xl" style={mine ? { background: `${RED}12`, border: `1px solid ${RED}55` } : card} suppressHydrationWarning>
                    <div className="font-mono text-xs uppercase tracking-widest mb-5" style={{ color: mine ? RED : "rgba(255,255,255,0.35)" }}>{title}</div>
                    <ul className="flex flex-col gap-3 m-0 p-0 list-none">
                      {items.map(it => (
                        <li key={it} className="text-sm leading-relaxed flex gap-2" style={{ color: "rgba(255,255,255,0.7)" }}>
                          <span style={{ color: mine ? RED : "rgba(255,255,255,0.3)" }}>→</span><span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {divider}

        {/* ══ 04 СЦЕНЫ ══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0A0A0A" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="04" text={t.scenes.label} />
            <BigHeading line1={t.scenes.heading1} line2={t.scenes.heading2} color2={BLUE} />
            <FadeIn delay={0.1}>
              <p className="text-lg leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.45)", maxWidth: 640 }}>{t.scenes.intro}</p>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {t.scenes.items.map(({ src, caption }) => (
                <FadeIn key={src}>
                  <div className="rounded-xl overflow-hidden" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <LazyVideo src={`${MEDIA}/${src}.mp4`} poster={`${MEDIA}/${src}.webp`} className="block w-full h-auto" style={{ aspectRatio: "9 / 16", objectFit: "cover" }} label={caption} />
                  </div>
                  <div className="font-mono text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>{caption}</div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {divider}

        {/* ══ 05 МОУШН ══════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-20" style={{ background: "#0D0D0D" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <SectionLabel num="05" text={t.motion.label} />
            <BigHeading line1={t.motion.heading1} line2={t.motion.heading2} />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-center">
              <FadeIn delay={0.1}>
                <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>{t.motion.text}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs uppercase tracking-widest mr-2" style={{ color: "rgba(255,255,255,0.28)" }}>{t.stack.label}</span>
                  {t.stack.list.map(tool => (
                    <span key={tool} className="text-sm px-3 py-1.5 rounded-xl font-medium" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.07)" }}>{tool}</span>
                  ))}
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                {/* Checkerboard reads as "transparent background" */}
                <div className="rounded-2xl overflow-hidden mx-auto" style={{ maxWidth: 360, border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "#1a1a1a", backgroundImage: "linear-gradient(45deg,#232323 25%,transparent 25%),linear-gradient(-45deg,#232323 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#232323 75%),linear-gradient(-45deg,transparent 75%,#232323 75%)", backgroundSize: "24px 24px", backgroundPosition: "0 0,0 12px,12px -12px,-12px 0" }}>
                  <LazyVideo src={`${MEDIA}/lower-third.webm`} className="block w-full h-auto" style={{ aspectRatio: "9 / 16" }} label={t.motion.caption} />
                </div>
                <div className="font-mono text-xs mt-3 text-center" style={{ color: "rgba(255,255,255,0.35)" }}>{t.motion.caption}</div>
              </FadeIn>
            </div>
          </div>
        </section>

        {divider}

        {/* ══ CTA ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 md:px-12 py-28 text-center overflow-hidden relative" style={{ background: "#0A0A0A" }}>
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "50vw", height: "50vh", background: `radial-gradient(ellipse, ${RED}1F 0%, transparent 70%)`, filter: "blur(40px)" }} />
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
              <span style={{ color: "#fff" }}>{t.cta.title1}</span><span style={{ color: RED }}>{t.cta.title2}</span>
            </motion.h2>
            <FadeIn delay={0.2}>
              <p className="text-base" style={{ color: "rgba(255,255,255,0.4)", maxWidth: 460, margin: "0 auto 40px" }}>{t.cta.desc}</p>
            </FadeIn>
            <FadeIn delay={0.28}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-bold" style={{ padding: "14px 32px", minHeight: 48, borderRadius: 9999, background: RED, color: "#fff", fontSize: "0.9rem", textDecoration: "none" }}>
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
