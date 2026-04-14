"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import AvatarRotator from "@/components/AvatarRotator"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"

const ROTATOR_IMAGES = [
  { src: "/works/ai-avatar/360-1.png", alt: "Фронт" },
  { src: "/works/ai-avatar/360-2.png", alt: "3/4 влево" },
  { src: "/works/ai-avatar/360-3.png", alt: "Профиль" },
  { src: "/works/ai-avatar/360-4.png", alt: "3/4 вправо" },
  { src: "/works/ai-avatar/360-5.png", alt: "Спина" },
]

const GALLERY = [
  { src: "/works/ai-avatar/clothes.png",      alt: "Лукбук — Miu Miu Academic" },
  { src: "/works/ai-avatar/outfit-full.png",  alt: "AI Avatar — Miu Miu Academic" },
  { src: "/works/ai-avatar/4k.png",           alt: "AI Avatar — полный рост" },
  { src: "/works/ai-avatar/outfit-split.png", alt: "Две позы — Miu Miu Academic" },
]

// ── Pointer-glow card ──────────────────────────────────────────────────────
function GlowCard({ children, className, style, onClick }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = ref.current
    if (!card) return
    const onMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.backgroundImage = `radial-gradient(320px 320px at ${x}px ${y}px, hsl(185 70% 65% / 0.12), transparent)`
    }
    const onLeave = () => { card.style.backgroundImage = "none" }
    card.addEventListener("pointermove", onMove)
    card.addEventListener("pointerleave", onLeave)
    return () => {
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.35, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────────
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
      {/* Close */}
      <button
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full text-white opacity-60 hover:opacity-100 transition-opacity"
        style={{ background: "rgba(255,255,255,0.1)" }}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      {/* Prev */}
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

      {/* Image */}
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
          width={1200}
          height={1600}
          className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-xl"
          quality={92}
        />
        <p className="text-center text-sm mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
          {images[index].alt} · {index + 1} / {images.length}
        </p>
      </motion.div>

      {/* Next */}
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

// ── Section fade-in wrapper ────────────────────────────────────────────────
function FadeSection({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.section
      className={className}
      style={style}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_DEFAULT }}
    >
      {children}
    </motion.section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AiAvatarPage() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const openLightbox = useCallback((i: number) => setLightbox(i), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      {/* Хедер */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(237, 234, 228, 0.85)",
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
          style={{ paddingTop: "120px", paddingBottom: "80px" } as React.CSSProperties}
        >
          <div className="flex flex-col md:flex-row gap-16 items-center">
            {/* Hero image */}
            <GlowCard
              className="w-full rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "var(--surface)", maxWidth: 400 }}
              onClick={() => openLightbox(1)}
            >
              <Image
                src="/works/ai-avatar/outfit-full.png"
                alt="AI Avatar — Miu Miu Academic образ"
                width={480}
                height={640}
                className="w-full h-full object-cover object-top"
                priority
                quality={92}
              />
            </GlowCard>

            <div className="flex-1 flex flex-col justify-center">
              <motion.span
                className="text-xs font-mono uppercase tracking-widest mb-6 block"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: EASE_DEFAULT }}
              >
                AI Visual · 2026 · Freepik Spaces
              </motion.span>
              <motion.h1
                className="font-black leading-none mb-8"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7rem)", letterSpacing: "-0.04em", color: "var(--text)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: EASE_DEFAULT }}
              >
                AI Avatar
              </motion.h1>
              <motion.p
                className="text-xl leading-relaxed"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE_DEFAULT }}
              >
                AI-модель для брендов — заменяет живую модель в каталогах,
                лукбуках и рекламе. Любой образ, любой формат, без съёмок.
              </motion.p>
            </div>
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── 360° Showcase ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 01</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              360° View
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              Один и тот же персонаж с разных ракурсов — основа консистентности. Перетащи влево или вправо.
            </p>
          </div>
          <AvatarRotator images={ROTATOR_IMAGES} />
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── Outfit 01 ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 02</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              Модель для съёмок
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
              AI-модель заменяет живую модель в каталогах, лукбуках и рекламе.
              Любой образ, любой ракурс — без студии и кастинга.
            </p>
          </div>

          {/* Три карточки */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {[
              { src: "/works/ai-avatar/clothes.png",     alt: "Лукбук — Miu Miu Academic",  galleryIdx: 0 },
              { src: "/works/ai-avatar/outfit-full.png", alt: "AI Avatar — Miu Miu Academic", galleryIdx: 1 },
              { src: "/works/ai-avatar/4k.png",          alt: "AI Avatar — полный рост",       galleryIdx: 2 },
            ].map((item) => (
              <motion.div
                key={item.src}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              >
                <GlowCard
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: "var(--surface)", aspectRatio: "3/4" }}
                  onClick={() => openLightbox(item.galleryIdx)}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                    quality={92}
                  />
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Сплит */}
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE_DEFAULT }}
          >
            <GlowCard
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: "var(--surface)", maxWidth: 700 }}
              onClick={() => openLightbox(3)}
            >
              <Image
                src="/works/ai-avatar/outfit-split.png"
                alt="Две позы — Miu Miu Academic"
                width={3072}
                height={5504}
                className="w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
                quality={92}
              />
            </GlowCard>
          </motion.div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── Video ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 03</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              В движении
            </h2>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
            <video
              src="/works/ai-avatar/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
              style={{ display: "block", maxHeight: "80vh" }}
            />
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── UGC Creator ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>— 04</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              UGC Creator
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              AI-модель в роли UGC-креатора — нативные видео для соцсетей без съёмок.
            </p>
          </div>

          {/* Лэйаут: 3 колонки, все одинаковой высоты */}
          <motion.div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1.2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", height: 700 }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Колонка 1 — один большой на всю высоту */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              className="rounded-2xl overflow-hidden"
              style={{ gridRow: "1 / 3", background: "var(--surface)" }}
            >
              <video src="/works/ai-avatar/ugc/freepik_closeup-portrait-of-woman_2781037723.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>

            {/* Колонка 2 верх */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781040377.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>

            {/* Колонка 3 верх */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <video src="/works/ai-avatar/ugc/freepik_extreme-macro-of-lips-lip_2781032383.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>

            {/* Колонка 2 низ */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781042514.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>

            {/* Колонка 3 низ */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_DEFAULT } } }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--surface)" }}
            >
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781057141.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(0,0,0,0.07)" }} />
        </div>

        {/* ── О проекте ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Задача",
                content: (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    Создать AI-модель для брендов — полноценную замену живой модели
                    в каталогах, лукбуках и рекламных материалах без съёмок.
                  </p>
                ),
              },
              {
                title: "Инструменты",
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {["Freepik Spaces", "Nano Banana 2", "Kling 3.0", "Kling 3.0 Motion Control", "Adobe Photoshop"].map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cyan)", display: "inline-block", flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: "Где применять",
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {["Каталог одежды и аксессуаров", "Лукбук и editorial съёмки", "UGC и нативная реклама", "Видео для соцсетей", "Брендинг и имиджевые материалы"].map(t => (
                      <li key={t} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--orange)", display: "inline-block", flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                ),
              },
            ].map(({ title, content }) => (
              <div key={title} className="p-6 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
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
            Нужна AI-модель для бренда?
          </h2>
          <p className="mb-10 text-base" style={{ color: "var(--muted)" }}>
            Создам модель под ваш стиль — каталог, реклама, соцсети. Без студии и кастинга.
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
          <Lightbox images={GALLERY} index={lightbox} onClose={closeLightbox} onNav={setLightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
