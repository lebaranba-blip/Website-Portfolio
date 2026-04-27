"use client"
import { useState, useRef, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import { useIsTouch } from "@/lib/use-is-touch"

// ── Data ───────────────────────────────────────────────────────────────────
const SETS = [
  {
    id: "s2",
    num: "01",
    label: "Боль каруселей в ChatGPT",
    topic: "Pain → Solution",
    tone: "Чёрный + жёлтый · 3D-объекты · Nano Banana",
    system: "/works/carousel/s2-system.png",
    slides: [
      { src: "/works/carousel/s2-1.jpg", alt: "Слайд 1" },
      { src: "/works/carousel/s2-2.jpg", alt: "Слайд 2" },
      { src: "/works/carousel/s2-3.jpg", alt: "Слайд 3" },
      { src: "/works/carousel/s2-4.jpg", alt: "Слайд 4" },
      { src: "/works/carousel/s2-5.jpg", alt: "Слайд 5" },
      { src: "/works/carousel/s2-6.jpg", alt: "Слайд 6" },
      { src: "/works/carousel/s2-7.jpg", alt: "Слайд 7" },
      { src: "/works/carousel/s2-8.jpg", alt: "Слайд 8" },
      { src: "/works/carousel/s2-9.jpg", alt: "Слайд 9" },
      { src: "/works/carousel/s2-10.jpg", alt: "Слайд 10" },
    ],
  },
  {
    id: "s3",
    num: "02",
    label: "Figma жрала мои выходные",
    topic: "Личная история",
    tone: "Glitch · Terminal · Claude → ChatGPT Image 2",
    system: "/works/carousel/s3-system.png",
    slides: [
      { src: "/works/carousel/s3-1.jpg", alt: "Слайд 1" },
      { src: "/works/carousel/s3-2.jpg", alt: "Слайд 2" },
      { src: "/works/carousel/s3-3.jpg", alt: "Слайд 3" },
      { src: "/works/carousel/s3-4.jpg", alt: "Слайд 4" },
      { src: "/works/carousel/s3-5.jpg", alt: "Слайд 5" },
      { src: "/works/carousel/s3-6.jpg", alt: "Слайд 6" },
      { src: "/works/carousel/s3-7.jpg", alt: "Слайд 7" },
      { src: "/works/carousel/s3-8.jpg", alt: "Слайд 8" },
    ],
  },
]

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_DEFAULT } },
}

function TextReveal({ children, delay = 0, className, style, hero = false }: {
  children: React.ReactNode; delay?: number
  className?: string; style?: React.CSSProperties; hero?: boolean
}) {
  return (
    <div style={{ overflow: "hidden", display: "block" }}>
      <motion.div className={className} style={style}
        initial={{ y: hero ? "0%" : "106%" }}
        animate={hero ? { y: "0%" } : undefined}
        whileInView={hero ? undefined : { y: "0%" }}
        viewport={hero ? undefined : { once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >{children}</motion.div>
    </div>
  )
}

function FadeIn({ children, delay = 0, className, style, hero = false }: {
  children: React.ReactNode; delay?: number
  className?: string; style?: React.CSSProperties; hero?: boolean
}) {
  return (
    <motion.div className={className} style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={hero ? { opacity: 1, y: 0 } : undefined}
      whileInView={hero ? undefined : { opacity: 1, y: 0 }}
      viewport={hero ? undefined : { once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >{children}</motion.div>
  )
}

function ParallaxImage({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const shouldReduce = useReducedMotion()
  const isTouch = useIsTouch()
  const parallaxOff = shouldReduce || isTouch || !mounted
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], parallaxOff ? [0, 0] : [-28, 28])

  useEffect(() => { setMounted(true) }, [])

  return (
    <div ref={ref} style={{ overflow: "hidden", borderRadius: 20, position: "relative", cursor: "zoom-in" }}>
      <motion.button
        onClick={onClick}
        className="w-full group relative overflow-hidden block"
        style={{ borderRadius: 20, border: "none", padding: 0, background: "none", cursor: "zoom-in" }}
        whileHover={isTouch ? undefined : { scale: 1.01 }}
        transition={{ duration: 0.4, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        <motion.div style={{ y }} suppressHydrationWarning>
          <Image src={src} alt={alt}
            width={1200} height={600}
            sizes="(max-width: 768px) 100vw, 1024px"
            className="w-full h-auto"
            quality={82} style={{ display: "block", borderRadius: 20, boxShadow: "0 2px 24px rgba(0,0,0,0.1)" }} />
        </motion.div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.3)", borderRadius: 20 }}>
          <span className="font-mono text-white text-sm px-5 py-2.5" style={{ background: "rgba(0,0,0,0.6)", borderRadius: 100, backdropFilter: "blur(8px)" }}>
            Открыть систему ↗
          </span>
        </div>
      </motion.button>
    </div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({ images, index: initIndex, onClose }: {
  images: { src: string; alt: string }[]
  index: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(initIndex)
  const prev = useCallback(() => setIdx(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIdx(i => (i + 1) % images.length), [images.length])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(5,5,5,0.94)", backdropFilter: "blur(16px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} suppressHydrationWarning
    >
      <motion.div
        className="relative"
        style={{ width: "min(92vw,520px)" }}
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }} transition={{ duration: 0.28, ease: EASE_DEFAULT }}
        onClick={e => e.stopPropagation()} suppressHydrationWarning
      >
        <div style={{ aspectRatio: "1/1", borderRadius: 22, overflow: "hidden", position: "relative", background: "#111" }}>
          <AnimatePresence mode="wait">
            <motion.div key={idx} style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}
              suppressHydrationWarning
            >
              <Image src={images[idx].src} alt={images[idx].alt} fill sizes="(max-width: 640px) 92vw, 520px" className="object-cover" quality={82} />
            </motion.div>
          </AnimatePresence>
          {/* Counter badge */}
          <div className="absolute top-3 right-3 font-mono text-xs px-3 py-1"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", borderRadius: 20, color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {idx + 1} / {images.length}
          </div>
        </div>
        {/* Alt text */}
        <p className="text-center mt-3 font-mono text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{images[idx].alt}</p>
        {/* Arrows */}
        {images.length > 1 && <>
          <button onClick={prev} aria-label="Назад"
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ left: -56, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer", fontSize: 18 }}>←</button>
          <button onClick={next} aria-label="Вперёд"
            className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ right: -56, width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer", fontSize: 18 }}>→</button>
        </>}
        {/* Close */}
        <button onClick={onClose} aria-label="Закрыть"
          className="absolute -top-10 right-0 font-mono text-xs"
          style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>ESC ✕</button>
        {/* Dots */}
        <div className="flex gap-2 justify-center mt-4">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Слайд ${i + 1}`}
              style={{ width: i === idx ? 22 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.25)", transition: "all 0.2s", border: "none", cursor: "pointer" }} />
          ))}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ── SlideThumb — with pointer-tilt 3D effect ──────────────────────────────
function SlideThumb({ src, alt, onClick, eager = false }: { src: string; alt: string; onClick: () => void; eager?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null)
  const shouldReduce = useReducedMotion()
  const isTouch = useIsTouch()

  useEffect(() => {
    const el = ref.current
    if (!el || shouldReduce || isTouch) return
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width  - 0.5
      const y = (e.clientY - r.top)  / r.height - 0.5
      el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`
    }
    const onLeave = () => { el.style.transform = "" }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave) }
  }, [shouldReduce, isTouch])

  return (
    <motion.button ref={ref} type="button" onClick={onClick}
      className="relative overflow-hidden cursor-zoom-in group w-full"
      style={{
        aspectRatio: "1/1", borderRadius: 14,
        boxShadow: "0 2px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 200px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        quality={75}
        loading={eager ? "eager" : "lazy"}
      />
      {/* Hover overlay — desktop only */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:block"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden md:flex items-end justify-between">
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", lineHeight: 1.3 }}>{alt}</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 4 }}>
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </motion.button>
  )
}

export default function CarouselCasePage() {
  const [lightbox, setLightbox] = useState<{ slides: { src: string; alt: string }[]; index: number } | null>(null)
  const [systemOpen, setSystemOpen] = useState<string | null>(null)

  const openLightbox = useCallback((slides: { src: string; alt: string }[], index: number) => {
    setLightbox({ slides, index })
  }, [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSystemOpen(null)
        setLightbox(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(237,234,228,0.88)", backdropFilter: "blur(14px)" }}>
        <Link href="/#works" className="flex items-center gap-2 font-mono text-sm px-2 -ml-2" style={{ color: "var(--muted)", minHeight: 44 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Все работы
        </Link>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm px-5 py-2">
          Написать
        </a>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
        <FadeIn delay={0.05} hero>
          <div className="font-mono text-xs mb-6 flex gap-3 flex-wrap" style={{ color: "var(--muted)" }}>
            <span>AI Visual</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>2026</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>ChatGPT Images 2.0</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>Instagram · Threads</span>
          </div>
        </FadeIn>
        <h1 style={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0 }}>
          <TextReveal hero className="block" style={{ fontSize: "clamp(3rem,7.5vw,6.5rem)" }}>КАРУСЕЛИ</TextReveal>
          <TextReveal hero delay={0.07} className="block" style={{ fontSize: "clamp(3rem,7.5vw,6.5rem)", color: "#10B981" }}>БЕЗ FIGMA</TextReveal>
          <TextReveal hero delay={0.13} className="block" style={{ fontSize: "clamp(3rem,7.5vw,6.5rem)" }}>И СТУДИИ</TextReveal>
        </h1>
        <FadeIn hero delay={0.28}>
          <p className="mt-8 max-w-2xl" style={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.55, fontSize: 19, fontWeight: 500 }}>
            Три серии каруселей для Instagram и Threads — каждая в отдельной визуальной системе. Промпт, система, слайды. Без дизайнера, без Figma, за один вечер.
          </p>
        </FadeIn>
      </section>

      {/* ── Cover — система карусели 3 ─────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <FadeIn hero>
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", background: "#0a0a0a", boxShadow: "0 6px 48px rgba(0,0,0,0.14)" }}>
            <Image src="/works/carousel/cover.png" alt="Визуальная система — Карусель 3"
              width={1200} height={700}
              sizes="(max-width: 768px) 100vw, 1024px"
              className="w-full h-auto" quality={82}
              priority style={{ display: "block" }} />
          </div>
          <p className="font-mono text-xs mt-3 text-center" style={{ color: "var(--muted)" }}>
            Визуальная система — карусель 03 / Glitch Terminal
          </p>
        </FadeIn>
      </section>

      {/* ── Три карусели ───────────────────────────────────────────────────── */}
      {SETS.map((set, si) => (
        <section key={set.id} id={set.id} className="mb-28">
          {/* Section header */}
          <div className="px-6 md:px-12 max-w-5xl mx-auto mb-8">
            <div className="flex items-start gap-8 justify-between flex-wrap">
              <div className="flex items-start gap-5">
                {/* Kinetic section number */}
                <motion.div
                  className="font-black select-none leading-none flex-shrink-0"
                  style={{ fontSize: "clamp(4rem,9vw,7.5rem)", color: "rgba(0,0,0,0.055)", letterSpacing: "-0.05em", lineHeight: 1, marginTop: "0.02em" }}
                  initial={{ opacity: 0, scale: 0.55 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  aria-hidden="true"
                  suppressHydrationWarning
                >
                  {set.num}
                </motion.div>
                <div>
                  <FadeIn>
                    <p className="font-mono mb-4" style={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.14em", fontSize: 13, fontWeight: 600 }}>
                      {set.topic.toUpperCase()}
                    </p>
                  </FadeIn>
                  <TextReveal className="font-black" style={{ fontSize: "clamp(1.9rem,4vw,3.2rem)", letterSpacing: "-0.04em", lineHeight: 1.05 }}>
                    {set.label}
                  </TextReveal>
                  <FadeIn delay={0.12}>
                    <p className="font-mono text-xs mt-4" style={{ color: "rgba(0,0,0,0.55)", letterSpacing: "0.02em" }}>{set.tone}</p>
                  </FadeIn>
                </div>
              </div>
              {/* System preview button — min 44px touch target */}
              <FadeIn delay={0.15}>
                <button
                  onClick={() => setSystemOpen(set.system)}
                  className="flex items-center gap-2 font-mono text-xs px-4 transition-all"
                  style={{ borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", color: "var(--muted)", background: "rgba(0,0,0,0.03)", cursor: "pointer", minHeight: 44 }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
                  Визуальная система
                </button>
              </FadeIn>
            </div>
          </div>

          {/* Slides grid — 5×2 on desktop, 3×N on tablet, 2×N on mobile */}
          <div className="px-6 md:px-12 max-w-5xl mx-auto">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4"
              variants={staggerContainer} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: "-30px" }}
            >
              {set.slides.map((slide, i) => (
                <motion.div key={slide.src} variants={staggerItem} suppressHydrationWarning>
                  <SlideThumb src={slide.src} alt={slide.alt} onClick={() => openLightbox(set.slides, i)} eager={si === 0 && i < 5} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* System image below slides — parallax */}
          <div className="px-6 md:px-12 max-w-5xl mx-auto mt-8">
            <FadeIn delay={0.1}>
              <ParallaxImage
                src={set.system}
                alt={`Визуальная система — ${set.label}`}
                onClick={() => setSystemOpen(set.system)}
              />
              <p className="font-mono text-xs mt-2.5 text-center" style={{ color: "var(--muted)" }}>
                Визуальная система — карусель {set.num} · палитра, шрифты, стиль, иконки
              </p>
            </FadeIn>
          </div>
        </section>
      ))}

      {/* ── Процесс ────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <FadeIn><p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>— КАК ДЕЛАЕТСЯ</p></FadeIn>
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { n: "01", title: "Тема + аудитория", desc: "Формулирую боль или идею. Решаю кто читатель и какой тон голоса нужен." },
            { n: "02", title: "Визуальная система", desc: "Прошу ChatGPT Images сгенерировать полную систему: палитра, шрифты, стиль объектов, иконки." },
            { n: "03", title: "Слайды по системе", desc: "Генерирую каждый слайд отдельно, держась в рамках утверждённой системы. Консистентность — через описание." },
            { n: "04", title: "Готово к публикации", desc: "Финальные слайды 1:1 или 4:5 — сразу в Instagram и Threads. Без экспорта из Figma." },
          ].map(({ n, title, desc }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.09, ease: EASE_DEFAULT }}
              style={{ borderRadius: 18, padding: "24px 20px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)" }}
              suppressHydrationWarning
            >
              <div className="font-mono font-black mb-4" style={{ fontSize: 36, color: "rgba(0,0,0,0.07)", lineHeight: 1 }}>{n}</div>
              <div className="font-bold text-sm mb-2" style={{ lineHeight: 1.3 }}>{title}</div>
              <div style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65 }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── О проекте ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <FadeIn><p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>— О ПРОЕКТЕ</p></FadeIn>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Задача", value: "Показать, что карусели для соцсетей можно делать быстро, без Figma и дизайнерского бюджета" },
            { label: "Инструменты", value: "ChatGPT Images 2.0 — генерация слайдов и визуальной системы. Nano Banana 2 — раздельная генерация слайдов." },
            { label: "Результат", value: "3 серии по 4–10 слайдов, каждая в своей визуальной системе. Готовы к публикации." },
          ].map(({ label, value }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div style={{ borderRadius: 18, padding: "24px 20px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", height: "100%" }}>
                <div className="font-mono text-xs mb-3" style={{ color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{value}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-32">
        <div style={{ borderRadius: 28, background: "#0A0A0A", padding: "clamp(40px,6vw,72px)", textAlign: "center" }}>
          <TextReveal className="font-black text-white mb-5"
            style={{ fontSize: "clamp(2.2rem,5.5vw,4.4rem)", lineHeight: 1.02, letterSpacing: "-0.045em" }}>
            НУЖЕН ВИЗУАЛ ДЛЯ СОЦСЕТЕЙ?
          </TextReveal>
          <FadeIn delay={0.15}>
            <p className="mb-10" style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, lineHeight: 1.55, maxWidth: 520, margin: "0 auto 2.5rem", fontWeight: 500 }}>
              Карусели, обложки, посты — собираю под бренд за вечер. Покажу варианты до начала работы.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                style={{ background: "#fff", color: "#0A0A0A", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 100, display: "inline-block" }}>
                Написать в Telegram
              </a>
              <Link href="/#works"
                className="transition-all"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 100, display: "inline-block", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.13)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.85)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)" }}
              >
                ← Все работы
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Slide lightbox ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox images={lightbox.slides} index={lightbox.index} onClose={closeLightbox} />
        )}
      </AnimatePresence>

      {/* ── System image lightbox ──────────────────────────────────────────── */}
      <AnimatePresence>
        {systemOpen && createPortal(
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
            style={{ background: "rgba(5,5,5,0.94)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSystemOpen(null)} suppressHydrationWarning
          >
            <motion.div
              style={{ width: "min(95vw,1100px)", position: "relative" }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.28, ease: EASE_DEFAULT }}
              onClick={e => e.stopPropagation()} suppressHydrationWarning
            >
              <Image src={systemOpen} alt="Визуальная система" width={1100} height={600}
                sizes="(max-width: 768px) 95vw, 1100px"
                className="w-full h-auto" quality={88} style={{ borderRadius: 18, display: "block" }} />
              <button onClick={() => setSystemOpen(null)} aria-label="Закрыть"
                className="absolute -top-10 right-0 font-mono text-xs"
                style={{ color: "rgba(255,255,255,0.35)", cursor: "pointer" }}>ESC ✕</button>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

    </div>
  )
}
