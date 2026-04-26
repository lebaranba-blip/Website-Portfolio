"use client"
import { useState, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"

// ── Slide data — replace src with real images ──────────────────────────────
// Each "set" is one carousel (multiple slides in a row)
const SETS = [
  {
    id: "set-1",
    title: "Бренд-карусель",
    slides: [
      { src: "/works/carousel/s1-1.png", alt: "Слайд 1" },
      { src: "/works/carousel/s1-2.png", alt: "Слайд 2" },
      { src: "/works/carousel/s1-3.png", alt: "Слайд 3" },
      { src: "/works/carousel/s1-4.png", alt: "Слайд 4" },
    ],
  },
  {
    id: "set-2",
    title: "Продуктовая карусель",
    slides: [
      { src: "/works/carousel/s2-1.png", alt: "Слайд 1" },
      { src: "/works/carousel/s2-2.png", alt: "Слайд 2" },
      { src: "/works/carousel/s2-3.png", alt: "Слайд 3" },
    ],
  },
  {
    id: "set-3",
    title: "Lifestyle карусель",
    slides: [
      { src: "/works/carousel/s3-1.png", alt: "Слайд 1" },
      { src: "/works/carousel/s3-2.png", alt: "Слайд 2" },
      { src: "/works/carousel/s3-3.png", alt: "Слайд 3" },
      { src: "/works/carousel/s3-4.png", alt: "Слайд 4" },
    ],
  },
]

// Flat list for lightbox
const ALL_SLIDES = SETS.flatMap(s => s.slides)

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } },
}

function TextReveal({ children, delay = 0, className, style }: {
  children: React.ReactNode; delay?: number
  className?: string; style?: React.CSSProperties
}) {
  return (
    <div style={{ overflow: "hidden", display: "block" }}>
      <motion.div
        className={className} style={style}
        initial={{ y: "106%" }} whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, delay, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >{children}</motion.div>
    </div>
  )
}

function FadeIn({ children, delay = 0, className, style }: {
  children: React.ReactNode; delay?: number
  className?: string; style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={className} style={style}
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >{children}</motion.div>
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
      style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} suppressHydrationWarning
    >
      <motion.div
        className="relative"
        style={{ maxWidth: "min(90vw, 600px)", width: "100%" }}
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.93, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_DEFAULT }}
        onClick={e => e.stopPropagation()} suppressHydrationWarning
      >
        {/* Slide image — square 1:1 format */}
        <div style={{ aspectRatio: "1/1", borderRadius: 20, overflow: "hidden", position: "relative", background: "#111" }}>
          <AnimatePresence mode="wait">
            <motion.div key={idx} style={{ position: "absolute", inset: 0 }}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
              suppressHydrationWarning
            >
              <Image src={images[idx].src} alt={images[idx].alt} fill className="object-cover" quality={90} />
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Counter */}
        <div className="absolute top-4 right-4 font-mono text-xs"
          style={{ color: "rgba(255,255,255,0.5)", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 20 }}>
          {idx + 1} / {images.length}
        </div>
        {/* Nav arrows */}
        {images.length > 1 && <>
          <button onClick={prev} aria-label="Предыдущий слайд"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 flex items-center justify-center"
            style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer" }}>
            ←
          </button>
          <button onClick={next} aria-label="Следующий слайд"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 flex items-center justify-center"
            style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer" }}>
            →
          </button>
        </>}
        {/* Close */}
        <button onClick={onClose} aria-label="Закрыть"
          className="absolute -top-12 right-0 font-mono text-sm"
          style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
          ESC ✕
        </button>
        {/* Dots */}
        <div className="flex gap-2 justify-center mt-4">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Слайд ${i + 1}`}
              style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 3, background: i === idx ? "#fff" : "rgba(255,255,255,0.3)", transition: "all 0.2s", border: "none", cursor: "pointer" }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  )
}

// ── SlideCard ──────────────────────────────────────────────────────────────
function SlideCard({ src, alt, onClick }: { src: string; alt: string; onClick: () => void }) {
  return (
    <motion.button type="button" onClick={onClick}
      className="relative overflow-hidden cursor-zoom-in group flex-shrink-0"
      style={{ width: 220, aspectRatio: "1/1", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)" }}
      whileHover={{ y: -5, boxShadow: "0 12px 32px rgba(0,0,0,0.14)" }}
      transition={{ duration: 0.3, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" quality={85} />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />
      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between pointer-events-none">
        <span style={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>{alt}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 12L12 4M12 4H6M12 4V10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
    </motion.button>
  )
}

export default function CarouselCasePage() {
  const [lightbox, setLightbox] = useState<{ slides: { src: string; alt: string }[]; index: number } | null>(null)

  const openLightbox = useCallback((slides: { src: string; alt: string }[], index: number) => {
    setLightbox({ slides, index })
  }, [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(237,234,228,0.88)", backdropFilter: "blur(14px)" }}>
        <Link href="/#works" className="flex items-center gap-2 font-mono text-sm"
          style={{ color: "var(--muted)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Все работы
        </Link>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
          className="btn-primary text-sm px-5 py-2">
          Написать
        </a>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-5xl mx-auto">
        <FadeIn delay={0.05}>
          <div className="font-mono text-xs mb-6 flex gap-3 flex-wrap" style={{ color: "var(--muted)" }}>
            <span>AI Visual</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>2026</span>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>ChatGPT Images 2.0</span>
          </div>
        </FadeIn>

        <h1 style={{ fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.0 }}>
          <TextReveal className="block" style={{ fontSize: "clamp(3rem,8vw,7rem)" }}>
            КАРУСЕЛИ ДЛЯ
          </TextReveal>
          <TextReveal delay={0.08} className="block" style={{ fontSize: "clamp(3rem,8vw,7rem)", color: "#10B981" }}>
            INSTAGRAM
          </TextReveal>
          <TextReveal delay={0.14} className="block" style={{ fontSize: "clamp(3rem,8vw,7rem)" }}>
            & THREADS
          </TextReveal>
        </h1>

        <FadeIn delay={0.25}>
          <p className="mt-8 max-w-xl text-base" style={{ color: "var(--muted)", lineHeight: 1.65 }}>
            Карусели с консистентным визуальным стилем, типографикой и брендингом — полностью через ChatGPT Images 2.0. Без дизайнера, без долгих согласований.
          </p>
        </FadeIn>
      </section>

      {/* ── Cover image ────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-20">
        <FadeIn>
          <div style={{ borderRadius: 24, overflow: "hidden", aspectRatio: "16/7", position: "relative", background: "#111", boxShadow: "0 4px 40px rgba(0,0,0,0.12)" }}>
            <Image
              src="/works/carousel/cover.png"
              alt="AI-карусели для Instagram"
              fill className="object-cover" quality={90}
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
        </FadeIn>
      </section>

      {/* ── 01 Задача ──────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <FadeIn><p className="font-mono text-xs mb-4" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>— 01 ЗАДАЧА</p></FadeIn>
            <TextReveal className="font-black" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}>
              КОНТЕНТ БЕЗ СТУДИИ
            </TextReveal>
          </div>
          <div style={{ paddingTop: "0.5rem" }}>
            <FadeIn delay={0.1}>
              <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: 16 }}>
                Бренды и блогеры тратят дни на съёмки и недели на согласования. ChatGPT Images 2.0 позволяет сгенерировать серию слайдов в едином стиле за час. Консистентный цвет, шрифт, герои — без Photoshop.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Carousel sets ──────────────────────────────────────────────────── */}
      {SETS.map((set, si) => (
        <section key={set.id} className="mb-20">
          <div className="px-6 md:px-12 max-w-5xl mx-auto mb-6">
            <FadeIn>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>0{si + 1}</span>
                <div style={{ height: 1, flex: 1, background: "rgba(0,0,0,0.08)" }} />
                <span className="font-bold text-sm">{set.title}</span>
              </div>
            </FadeIn>
          </div>

          {/* Horizontal scroll row */}
          <div className="px-6 md:px-12">
            <motion.div
              className="flex gap-4 overflow-x-auto pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              variants={staggerContainer} initial="hidden" whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
            >
              {set.slides.map((slide, i) => (
                <motion.div key={slide.src} variants={staggerItem} suppressHydrationWarning>
                  <SlideCard
                    src={slide.src} alt={slide.alt}
                    onClick={() => openLightbox(set.slides, i)}
                  />
                </motion.div>
              ))}
              {/* View all slides hint */}
              <motion.div variants={staggerItem} suppressHydrationWarning
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: 80, opacity: 0.3 }}>
                <span className="font-mono text-xs" style={{ writingMode: "vertical-rl", letterSpacing: "0.1em" }}>СМОТРЕТЬ →</span>
              </motion.div>
            </motion.div>
          </div>
        </section>
      ))}

      {/* ── 02 Как это работает ────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <FadeIn><p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>— 02 КАК ЭТО РАБОТАЕТ</p></FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Промпт", desc: "Описываю стиль, бренд-цвет, тему, количество слайдов. Чем точнее — тем меньше итераций." },
            { n: "02", title: "Генерация", desc: "ChatGPT Images 2.0 создаёт серию слайдов с единым визуальным языком. Текст, иконки, фото — всё в одном запросе." },
            { n: "03", title: "Результат", desc: "Готовые 1:1 или 4:5 изображения для публикации. Обычно 3–4 итерации до финала." },
          ].map(({ n, title, desc }, i) => (
            <motion.div key={n}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_DEFAULT }}
              style={{ borderRadius: 20, padding: "28px 24px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}
              suppressHydrationWarning
            >
              <div className="font-mono font-black mb-4" style={{ fontSize: 40, color: "rgba(0,0,0,0.06)", lineHeight: 1 }}>{n}</div>
              <div className="font-bold text-base mb-2">{title}</div>
              <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65 }}>{desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 03 О проекте ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto mb-24">
        <FadeIn><p className="font-mono text-xs mb-8" style={{ color: "var(--muted)", letterSpacing: "0.1em" }}>— 03 О ПРОЕКТЕ</p></FadeIn>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Задача", value: "Контент для соцсетей без съёмочной команды" },
            { label: "Инструменты", value: "ChatGPT Images 2.0, Figma (компоновка), CapCut (сторис)" },
            { label: "Результат", value: "3 серии каруселей, готовые к публикации в Instagram и Threads" },
          ].map(({ label, value }, i) => (
            <FadeIn key={label} delay={i * 0.08}>
              <div style={{ borderRadius: 20, padding: "28px 24px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)", height: "100%" }}>
                <div className="font-mono text-xs mb-3" style={{ color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                <div className="font-bold" style={{ fontSize: 15, lineHeight: 1.5 }}>{value}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-32">
        <div style={{ borderRadius: 28, background: "#0A0A0A", padding: "clamp(40px,6vw,72px)", textAlign: "center" }}>
          <TextReveal className="font-black text-white mb-6"
            style={{ fontSize: "clamp(2rem,5vw,4rem)", lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            НУЖНЫ КАРУСЕЛИ?
          </TextReveal>
          <FadeIn delay={0.15}>
            <p className="mb-10" style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 2.5rem" }}>
              Расскажи про бренд — сделаю первую серию и покажу что получится.
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                style={{ background: "#fff", color: "#0A0A0A", fontWeight: 700, fontSize: 15, padding: "14px 32px", borderRadius: 100, display: "inline-block" }}>
                Написать в Telegram
              </a>
              <Link href="/#works"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 100, display: "inline-block", border: "1px solid rgba(255,255,255,0.12)" }}>
                ← Все работы
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox images={lightbox.slides} index={lightbox.index} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </div>
  )
}
