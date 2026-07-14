"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import AvatarRotator from "@/components/AvatarRotator"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import LanguageToggle from "@/components/ui/language-toggle"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { aiAvatarDict } from "@/dictionaries/ai-avatar"
import { commonDict } from "@/dictionaries/common"

function getRotatorImages(t: ReturnType<typeof useDict<typeof aiAvatarDict>>) {
  return [
    { src: "/works/ai-avatar/360-1.png", alt: t.rotator.front },
    { src: "/works/ai-avatar/360-2.png", alt: t.rotator.threeQuarterLeft },
    { src: "/works/ai-avatar/360-3.png", alt: t.rotator.profile },
    { src: "/works/ai-avatar/360-4.png", alt: t.rotator.threeQuarterRight },
    { src: "/works/ai-avatar/360-5.png", alt: t.rotator.back },
  ]
}

function getGallery(t: ReturnType<typeof useDict<typeof aiAvatarDict>>) {
  return [
    // 360° ракурсы — индексы 0–4
    { src: "/works/ai-avatar/360-1.png", alt: t.gallery.front },
    { src: "/works/ai-avatar/360-2.png", alt: t.gallery.threeQuarterLeft },
    { src: "/works/ai-avatar/360-3.png", alt: t.gallery.profile },
    { src: "/works/ai-avatar/360-4.png", alt: t.gallery.threeQuarterRight },
    { src: "/works/ai-avatar/360-5.png", alt: t.gallery.back },
    // образы — индексы 5–8
    { src: "/works/ai-avatar/clothes.png",      alt: t.gallery.lookbook },
    { src: "/works/ai-avatar/outfit-full.png",  alt: t.gallery.outfitFull },
    { src: "/works/ai-avatar/4k.png",           alt: t.gallery.fullBody },
    { src: "/works/ai-avatar/outfit-split.png", alt: t.gallery.twoPoses },
  ]
}

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
function Lightbox({ images, index, onClose, onNav, labels }: {
  images: { src: string; alt: string }[]
  index: number
  onClose: () => void
  onNav: (i: number) => void
  labels: { close: string; prev: string; next: string }
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
        aria-label={labels.close}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-white opacity-60 hover:opacity-100 transition-opacity"
          style={{ background: "rgba(255,255,255,0.1)" }}
          onClick={(e) => { e.stopPropagation(); onNav((index - 1 + images.length) % images.length) }}
          aria-label={labels.prev}
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
          aria-label={labels.next}
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
  const isTouch = useIsTouch()
  if (isTouch) return <section className={className} style={style}>{children}</section>
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

// ── Page ───────────────────────────────────────────────────────────────────
export default function AiAvatarPage() {
  const t = useDict(aiAvatarDict)
  const tc = useDict(commonDict)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isTouch = useIsTouch()

  const ROTATOR_IMAGES = getRotatorImages(t)
  const GALLERY = getGallery(t)

  const openLightbox = useCallback((i: number) => setLightbox(i), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <>
      {/* Хедер */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{
          background: "rgba(11, 11, 13, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
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
          {tc.allWorks}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle dark />
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-5 py-2.5">
            {tc.write}
          </a>
        </div>
      </header>

      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <FadeSection
          className="px-6 md:px-12 max-w-6xl mx-auto"
          style={{ paddingTop: "100px", paddingBottom: "80px" } as React.CSSProperties}
        >
          {/* Мобиль: текст сверху, фото снизу. Десктоп: фото слева, текст справа */}
          <div className="flex flex-col-reverse md:flex-row gap-10 md:gap-16 items-center">
            {/* Hero image */}
            <GlowCard
              className="w-full rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "var(--surface)", maxWidth: 400 }}
              onClick={() => openLightbox(6)}
            >
              <Image
                src="/works/ai-avatar/outfit-full.png"
                alt={t.hero.heroImageAlt}
                width={480}
                height={640}
                className="w-full h-full object-cover object-top"
                priority
                quality={92}
              />
            </GlowCard>

            <div className="flex-1 flex flex-col justify-center">
              <motion.span
                className="text-xs font-mono uppercase tracking-widest mb-4 block"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {t.hero.eyebrow}
              </motion.span>
              <motion.h1
                className="font-black leading-none mb-6"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.04em", color: "var(--text)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {t.hero.title}
              </motion.h1>
              <motion.p
                className="text-base md:text-xl leading-relaxed"
                style={{ color: "var(--muted)" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE_DEFAULT }}
                suppressHydrationWarning
              >
                {t.hero.description}
              </motion.p>
            </div>
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── 360° Showcase ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>{t.section01.eyebrow}</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              {t.section01.title}
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              {t.section01.description}
            </p>
          </div>
          <AvatarRotator images={ROTATOR_IMAGES} onOpenLightbox={openLightbox} />
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── Outfit 01 ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>{t.section02.eyebrow}</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              {t.section02.title}
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
              {t.section02.description}
            </p>
          </div>

          {/* Три карточки */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { src: "/works/ai-avatar/clothes.png",     alt: t.gallery.lookbook,  galleryIdx: 0 },
              { src: "/works/ai-avatar/outfit-full.png", alt: t.gallery.outfitFull, galleryIdx: 1 },
              { src: "/works/ai-avatar/4k.png",          alt: t.gallery.fullBody,       galleryIdx: 2 },
            ].map((item) => (
              <div key={item.src}>
                <GlowCard
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: "var(--surface)", aspectRatio: "3/4" }}
                  onClick={() => openLightbox(item.galleryIdx + 5)}
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
              </div>
            ))}
          </div>

          {/* Сплит */}
          <div className="flex justify-center mt-4">
            <GlowCard
              className="rounded-2xl overflow-hidden cursor-pointer"
              style={{ background: "var(--surface)", maxWidth: 700 }}
              onClick={() => openLightbox(8)}
            >
              <Image
                src="/works/ai-avatar/outfit-split.png"
                alt={t.gallery.twoPoses}
                width={3072}
                height={5504}
                className="w-full h-auto transition-transform duration-700 hover:scale-[1.02]"
                quality={92}
              />
            </GlowCard>
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── Video ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>{t.section03.eyebrow}</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              {t.section03.title}
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
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── UGC Creator ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest mb-3 block" style={{ color: "var(--muted)" }}>{t.section04.eyebrow}</span>
            <h2 className="font-black leading-none" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
              {t.section04.title}
            </h2>
            <p className="mt-3 text-base" style={{ color: "var(--muted)", maxWidth: 480 }}>
              {t.section04.description}
            </p>
          </div>

          {/* Десктоп: 3 колонки асимметрично */}
          <div
            className="hidden md:grid gap-3"
            style={{ gridTemplateColumns: "1.2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", height: 700 }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ gridRow: "1 / 3", background: "var(--surface)" }}>
              <video src="/works/ai-avatar/ugc/freepik_closeup-portrait-of-woman_2781037723.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781040377.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
              <video src="/works/ai-avatar/ugc/freepik_extreme-macro-of-lips-lip_2781032383.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781042514.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)" }}>
              <video src="/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781057141.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Мобиль: 2 колонки */}
          <div className="grid md:hidden gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {[
              "/works/ai-avatar/ugc/freepik_closeup-portrait-of-woman_2781037723.mp4",
              "/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781040377.mp4",
              "/works/ai-avatar/ugc/freepik_extreme-macro-of-lips-lip_2781032383.mp4",
              "/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781042514.mp4",
              "/works/ai-avatar/ugc/freepik_young-woman-with-curly-bl_2781057141.mp4",
            ].map((src) => (
              <div key={src} className="rounded-xl overflow-hidden" style={{ aspectRatio: "9/16", background: "var(--surface)" }}>
                <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </FadeSection>

        <div className="px-6 md:px-12 max-w-6xl mx-auto">
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── О проекте ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: t.about.task.title,
                content: (
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {t.about.task.description}
                  </p>
                ),
              },
              {
                title: t.about.tools.title,
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {["Freepik Spaces", "Nano Banana 2", "Kling 3.0", "Kling 3.0 Motion Control", "Adobe Photoshop"].map(tool => (
                      <li key={tool} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--cyan)", display: "inline-block", flexShrink: 0 }} />
                        {tool}
                      </li>
                    ))}
                  </ul>
                ),
              },
              {
                title: t.about.useCases.title,
                content: (
                  <ul className="text-sm leading-loose" style={{ color: "var(--muted)" }}>
                    {t.about.useCases.items.map(item => (
                      <li key={item} className="flex items-center gap-2">
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--orange)", display: "inline-block", flexShrink: 0 }} />
                        {item}
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
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
        </div>

        {/* ── CTA ── */}
        <FadeSection className="px-6 md:px-12 max-w-6xl mx-auto py-24 text-center">
          <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "var(--text)" }}>
            {t.cta.title}
          </h2>
          <p className="mb-10 text-base" style={{ color: "var(--muted)" }}>
            {t.cta.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {tc.writeTelegram}
            </a>
            <Link href="/#works" className="btn-secondary">
              ← {tc.allWorks}
            </Link>
          </div>
        </FadeSection>

      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {mounted && lightbox !== null && (
          <Lightbox images={GALLERY} index={lightbox} onClose={closeLightbox} onNav={setLightbox} labels={t.lightbox} />
        )}
      </AnimatePresence>
    </>
  )
}
