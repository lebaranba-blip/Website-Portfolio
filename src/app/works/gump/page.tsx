"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"

// ── Медиа ─────────────────────────────────────────────────────────────────
const IDENTITY_ITEMS = [
  { src: "/works/gump/logo.png",      alt: "Логотип Gump Donuts",       aspect: "square"    },
  { src: "/works/gump/truck.png",     alt: "Брендированный фургон",     aspect: "landscape" },
  { src: "/works/gump/billboard.png", alt: "Билборд — EAT OR REGRET",   aspect: "landscape" },
  { src: "/works/gump/boxes.png",     alt: "Фирменная упаковка",        aspect: "landscape" },
  { src: "/works/gump/tshirt2.png",   alt: "Мерч — футболки",           aspect: "landscape" },
  { src: "/works/gump/apron.png",     alt: "Фирменный фартук",          aspect: "portrait"  },
  { src: "/works/gump/shopper.png",   alt: "Шоппер",                    aspect: "portrait"  },
  { src: "/works/gump/tshirt.png",    alt: "Футболка",                  aspect: "portrait"  },
  { src: "/works/gump/lifestyle.png", alt: "Лайфстайл — упаковка",     aspect: "landscape" },
  { src: "/works/gump/banner.png",    alt: "Рекламный баннер",          aspect: "landscape" },
]

// ── FadeSection ───────────────────────────────────────────────────────────
function FadeSection({ children, className, style }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.section
      className={className}
      style={style}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {children}
    </motion.section>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onNav }: {
  images: { src: string; alt: string }[]
  index: number
  onClose: () => void
  onNav: (i: number) => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNav((index + 1) % images.length)
      if (e.key === "ArrowLeft") onNav((index - 1 + images.length) % images.length)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [index, images.length, onClose, onNav])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white opacity-60 hover:opacity-100 transition-opacity"
        style={{ background: "rgba(255,255,255,0.1)" }}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-white opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(255,255,255,0.1)" }}
          onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length) }}
          aria-label="Предыдущее"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: EASE_DEFAULT }}
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        suppressHydrationWarning
      >
        <Image
          src={images[index].src}
          alt={images[index].alt}
          width={1400}
          height={1000}
          className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl"
          quality={92}
        />
        <p className="text-center text-sm mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          {images[index].alt} · {index + 1} / {images.length}
        </p>
      </motion.div>

      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-white opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(255,255,255,0.1)" }}
          onClick={(e) => { e.stopPropagation(); onNav((index + 1) % images.length) }}
          aria-label="Следующее"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}
    </motion.div>,
    document.body
  )
}

// ── VideoPlayer ───────────────────────────────────────────────────────────
function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto"
        style={{ display: "block", maxHeight: "80vh" }}
        muted
        loop
        playsInline
        controls={false}
      />
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        aria-label={muted ? "Включить звук" : "Выключить звук"}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
        )}
      </button>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function GumpDonutsPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const openLightbox = useCallback((i: number) => setLightbox(i), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(237,234,228,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Link
          href="/#works"
          className="inline-flex items-center gap-2 text-sm font-mono transition-opacity hover:opacity-60"
          style={{ color: "var(--muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Все работы
        </Link>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-5 py-2.5">
          Написать
        </a>
      </header>

      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <FadeSection
          className="px-6 md:px-12 max-w-6xl mx-auto"
          style={{ paddingTop: "100px", paddingBottom: "80px" } as React.CSSProperties}
        >
          <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center">
            {/* Hero image */}
            <motion.div
              className="w-full rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
              style={{ background: "var(--surface)", maxWidth: 480 }}
              onClick={() => openLightbox(2)}
              whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.35, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <Image
                src="/works/gump/poster.png"
                alt="Gump Donuts — Glazing Through the Galaxy"
                width={960}
                height={1280}
                className="w-full h-auto"
                priority
                quality={92}
              />
            </motion.div>

            <div className="flex-1 flex flex-col justify-center">
              <motion.span
                className="text-xs font-mono uppercase tracking-widest mb-4 block"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                Branding · 2026 · Concept
              </motion.span>
              <motion.h1
                className="font-black leading-none mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.04em", color: "var(--text)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                Gump Donuts
              </motion.h1>
              <motion.p
                className="text-base md:text-xl leading-relaxed"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                Концептуальный брендинг для сети пончиков. Персонаж, айдентика,
                упаковка, мерч и промо-видео — всё через AI.
              </motion.p>
            </div>
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── Концепция ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 01</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              Идея
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: "var(--muted)", maxWidth: 560 }}>
              Gump — отсыл к Форресту Гампу. Простой, честный, с душой.
              Маскот-бегун с пончиком в руке: не фастфуд-корпорация, а персонаж
              с историей. Бренд иронизирует над культурой ЗОЖ — не запрещает
              вкусное, а предлагает заработать его бегом.
            </p>
          </div>

          {/* Логотип + слоган */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ gridAutoRows: "1fr" }}>
            {/* Логотип */}
            <motion.div
              className="rounded-2xl overflow-hidden flex items-center justify-center p-12 cursor-pointer"
              style={{ background: "var(--surface)", aspectRatio: "3/2" }}
              onClick={() => openLightbox(0)}
              whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.35, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <Image
                src="/works/gump/logo.png"
                alt="Логотип Gump Donuts"
                width={400}
                height={400}
                className="w-full max-w-xs h-auto"
                quality={92}
              />
            </motion.div>

            {/* Билборд — слоган */}
            <motion.div
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: "var(--surface)", aspectRatio: "3/2" }}
              onClick={() => openLightbox(2)}
              whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              transition={{ duration: 0.35, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <Image
                src="/works/gump/billboard.png"
                alt="Билборд — EAT OR REGRET"
                width={960}
                height={640}
                className="w-full h-full object-cover"
                quality={92}
              />
            </motion.div>
          </div>

          {/* Слоган — bleed типографика */}
          <div className="mt-12 overflow-hidden">
            <motion.p
              className="font-black leading-none text-center"
              style={{
                fontSize: "clamp(2.5rem, 10vw, 8rem)",
                letterSpacing: "-0.04em",
                color: "var(--text)",
                opacity: 0.08,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 0.08, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              EAT OR REGRET.
            </motion.p>
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── Identity ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 02</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              Identity
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              Фирменный стиль на основе двух цветов: насыщенный синий и розовый.
              Маскот — единый визуальный якорь на всех носителях.
            </p>
          </div>

          {/* Цветовая палитра */}
          <div className="flex gap-3 mb-10">
            {[
              { color: "#1B3FD8", label: "Gump Blue" },
              { color: "#F472B6", label: "Donut Pink" },
              { color: "#0A0A0A", label: "Night" },
              { color: "#FFFFFF", label: "Glaze" },
            ].map(({ color, label }) => (
              <div key={color} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 md:w-16 md:h-16 rounded-xl"
                  style={{ background: color, border: color === "#FFFFFF" ? "1px solid rgba(0,0,0,0.1)" : undefined }}
                />
                <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Галерея носителей */}
          <motion.div
            className="columns-2 md:columns-3 gap-3"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            suppressHydrationWarning
          >
            {IDENTITY_ITEMS.map((item, idx) => (
              <motion.button
                key={item.src}
                type="button"
                className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } } }}
                onClick={() => openLightbox(idx)}
                aria-label={`Открыть: ${item.alt}`}
                suppressHydrationWarning
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={600}
                  height={item.aspect === "portrait" ? 800 : item.aspect === "square" ? 600 : 450}
                  className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
                  quality={92}
                />
              </motion.button>
            ))}
          </motion.div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── AI Pipeline ── */}
        <motion.section
          className="py-20"
          style={{ background: "#0D0D0D" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          <div className="px-6 md:px-12 max-w-6xl mx-auto">
            <div className="mb-12">
              <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "rgba(255,255,255,0.35)" }}>— 03</span>
              <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "#fff" }}>
                AI Pipeline
              </h2>
              <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.5)", maxWidth: 520 }}>
                Управляемая генерация с сохранением 100% айдентики бренда.
                Логотип и фургон — жёсткие референсы, нейросеть не фантазирует.
              </p>
            </div>

            {/* Схема воркфлоу */}
            <motion.div
              className="rounded-2xl overflow-hidden mb-8 cursor-zoom-in"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <Image
                src="/works/gump/pipeline.png"
                alt="AI Pipeline — схема воркфлоу Gump Donuts"
                width={2303}
                height={2207}
                className="w-full h-auto"
                quality={92}
              />
            </motion.div>

            {/* Видео воркфлоу */}
            <motion.div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#000" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <video
                src="/works/gump/pipeline.mp4"
                className="w-full h-auto"
                style={{ display: "block", maxHeight: "80vh" }}
                autoPlay
                muted
                loop
                playsInline
              />
            </motion.div>

            {/* 3 тезиса */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              suppressHydrationWarning
            >
              {[
                {
                  title: "100% сохранение айдентики",
                  text: "Нейросеть не фантазирует. Логотип и фургон используются как жёсткие референсы — бренд узнаваем в любой сцене.",
                },
                {
                  title: "Инженерный промптинг",
                  text: "Каждая сцена строится через точную настройку физики света, ракурсов камеры и взаимодействия объектов.",
                },
                {
                  title: "Альтернатива 3D-продакшену",
                  text: "Качество CGI-уровня без студии и месяцев работы. Предсказуемый результат, готовый к запуску в рекламе.",
                },
              ].map(({ title, text }) => (
                <motion.div
                  key={title}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_DEFAULT } } }}
                  className="p-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  suppressHydrationWarning
                >
                  <h3 className="font-black mb-3 text-sm uppercase tracking-wide" style={{ color: "#F472B6" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── Промо-видео ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 04</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              В движении
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              Рекламный ролик создан через AI — от концепции до финального рендера.
              Пончик в невесомости как визуальная метафора слогана «Glazing Through the Galaxy».
            </p>
          </div>
          <VideoPlayer src="/works/gump/ad.mp4" />
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── О проекте ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Задача",
                content: (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Создать концептуальный бренд пончиков с характером — маскот,
                    айдентика, носители и промо-видео. Показать, что AI-инструменты
                    дают результат уровня профессиональной студии.
                  </p>
                ),
              },
              {
                title: "Инструменты",
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {["Figma", "Freepik Spaces", "Nano Banana 2", "Kling 3.0", "Adobe Photoshop", "DaVinci Resolve"].map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cyan)", display: "inline-block", flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Результат",
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {["Логотип и маскот", "Фирменный стиль", "Упаковка и мерч", "Наружная реклама", "Промо-видео"].map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--orange)", display: "inline-block", flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ].map(({ title, content }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <h3 className="font-black mb-4" style={{ fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--text)" }}>{title}</h3>
                {content}
              </div>
            ))}
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── CTA ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-24 text-center">
          <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
            Хотите такой же бренд?
          </h2>
          <p className="mb-10 text-base" style={{ color: "var(--muted)" }}>
            Концепция, маскот, айдентика и промо — всё через AI. Быстро и без студии.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Написать в Telegram
            </a>
            <Link href="/#works" className="btn-secondary">
              ← Все работы
            </Link>
          </div>
        </FadeSection>

      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {mounted && lightbox !== null && (
          <Lightbox images={IDENTITY_ITEMS} index={lightbox} onClose={closeLightbox} onNav={setLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
