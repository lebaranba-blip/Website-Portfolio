"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Work } from "@/data/works"
import { EASE_DEFAULT } from "@/lib/constants"

interface Props {
  work: Work
}

const galleryVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function FeaturedWorkCard({ work }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [muted, setMuted] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Esc to close lightbox + lock body scroll
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowRight" && work.gallery) {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % work.gallery!.length))
      }
      if (e.key === "ArrowLeft" && work.gallery) {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + work.gallery!.length) % work.gallery!.length))
      }
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [lightboxIndex, work.gallery])

  // Auto-play video when expand opens, pause on collapse
  useEffect(() => {
    if (!expanded || !videoRef.current) return
    const v = videoRef.current
    v.muted = true
    v.play().catch((err) => {
      console.warn("Video autoplay failed:", err)
    })
    return () => {
      v.pause()
    }
  }, [expanded])

  const handleToggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCardClick = () => {
    setExpanded((p) => !p)
    if (!expanded && expandRef.current) {
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
      scrollTimer.current = setTimeout(() => {
        expandRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }, 350)
    }
  }

  useEffect(() => {
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current)
    }
  }, [])

  return (
    <div className="col-span-full">
      {/* ── Featured Card ── */}
      <motion.div
        className="group relative cursor-pointer select-none"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
          background: "var(--surface)",
        }}
        onClick={handleCardClick}
        whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.4, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        {/* Poster image */}
        <div className="relative w-full">
          <Image
            src={work.image}
            alt={work.alt}
            width={1800}
            height={600}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
            className="w-full h-auto object-contain"
            priority
            quality={85}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 40%, transparent 75%)" }}
          />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
            <div>
              <span
                className="text-xs font-mono uppercase tracking-widest mb-2 block"
                style={{ color: "rgba(255,255,255,0.6)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              >
                {work.category} · {work.year}
              </span>
              <h3
                className="font-bold leading-none"
                style={{ color: "#fff", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
              >
                {work.title}
              </h3>
              {work.desc && (
                <p className="mt-2 text-sm font-light" style={{ color: "rgba(255,255,255,0.75)", maxWidth: "480px", textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  {work.desc}
                </p>
              )}
            </div>

            {/* Toggle button */}
            <motion.div
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.35, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Expand Panel ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            ref={expandRef}
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_DEFAULT }}
            style={{ overflow: "hidden" }}
            suppressHydrationWarning
          >
            <div
              className="mt-3 rounded-2xl p-5 md:p-8"
              style={{ border: "1px solid rgba(0,0,0,0.07)", background: "var(--surface)" }}
            >
              {/* Masonry gallery */}
              {work.gallery && work.gallery.length > 0 && (
                <motion.div
                  className="columns-2 md:columns-3 lg:columns-4 gap-3"
                  variants={galleryVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {work.gallery.map((item, idx) => (
                    <motion.button
                      type="button"
                      key={item.src}
                      className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]"
                      variants={itemVariants}
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx) }}
                      aria-label={`Открыть ${item.alt} на весь экран`}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={600}
                        height={item.aspect === "portrait" ? 800 : item.aspect === "square" ? 600 : 450}
                        className="w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-500"
                        loading="lazy"
                        quality={85}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}

              {/* Video player */}
              {work.fullVideo && (
                <motion.div
                  className="mt-5 relative rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: EASE_DEFAULT }}
                  suppressHydrationWarning
                >
                  <video
                    ref={videoRef}
                    src={work.fullVideo}
                    loop
                    playsInline
                    muted={muted}
                    className="w-full rounded-xl"
                    style={{ maxHeight: "70vh", background: "#000" }}
                  />
                  {/* Mute/Unmute button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleMute() }}
                    className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(8px)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                    aria-label={muted ? "Включить звук" : "Выключить звук"}
                  >
                    {muted ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                        Звук выкл
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                        Звук вкл
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lightbox ── */}
      {mounted ? createPortal(
      <AnimatePresence>
        {lightboxIndex !== null && work.gallery && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            style={{ background: "rgba(10,10,10,0.92)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_DEFAULT }}
            onClick={() => setLightboxIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={work.gallery[lightboxIndex].alt}
          >
            <motion.div
              key={work.gallery[lightboxIndex].src}
              className="relative max-w-[92vw] max-h-[88vh] flex items-center justify-center"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE_DEFAULT }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={work.gallery[lightboxIndex].src}
                alt={work.gallery[lightboxIndex].alt}
                width={1920}
                height={1920}
                quality={92}
                className="w-auto h-auto max-w-[92vw] max-h-[88vh] object-contain rounded-lg"
                priority
              />
            </motion.div>

            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null) }}
              className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center justify-center w-12 h-12 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--cyan)]"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", zIndex: 10 }}
              aria-label="Закрыть"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Prev */}
            {work.gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i === null ? null : (i - 1 + work.gallery!.length) % work.gallery!.length) }}
                className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--cyan)]"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", zIndex: 10 }}
                aria-label="Предыдущее"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Next */}
            {work.gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => i === null ? null : (i + 1) % work.gallery!.length) }}
                className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--cyan)]"
                style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff", boxShadow: "0 4px 24px rgba(0,0,0,0.5)", zIndex: 10 }}
                aria-label="Следующее"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}

            {/* Counter */}
            <div
              className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-mono"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", zIndex: 10 }}
            >
              {lightboxIndex + 1} / {work.gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>, document.body) : null}
    </div>
  )
}
