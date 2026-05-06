"use client"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { Work } from "@/data/works"
import { EASE_DEFAULT } from "@/lib/constants"

interface Props {
  work: Work
  priority?: boolean
}

const galleryVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function FeaturedWorkCard({ work, priority = false }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [muted, setMuted] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [workflowOpen, setWorkflowOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  // Esc to close lightbox + lock body scroll
  useEffect(() => {
    if (lightboxIndex === null && !workflowOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setLightboxIndex(null); setWorkflowOpen(false) }
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
  }, [lightboxIndex, workflowOpen, work.gallery])

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

  const cardContent = (
      <motion.div
        className="group relative cursor-pointer select-none"
        style={{
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "16px",
          overflow: "hidden",
          background: "var(--surface)",
        }}
        onClick={work.href ? undefined : handleCardClick}
        whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.4, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        {/* Preview area */}
        <div className="relative w-full overflow-hidden" style={{ height: "480px" }}>
          {work.previewGrid && work.previewLayout === "mosaic-1L-3R" ? (
            /* Большой портрет слева (60%) + 3 равных строки справа (40%) */
            <div className="absolute inset-0 flex gap-1">
              {/* Left — hero portrait */}
              <div className="relative overflow-hidden" style={{ flex: "3" }}>
                <Image
                  src={work.previewGrid[0]}
                  alt={work.alt}
                  fill
                  sizes="(max-width: 640px) 60vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  quality={82}
                />
              </div>
              {/* Right — 3 stacked rows */}
              <div className="flex flex-col gap-1" style={{ flex: "2" }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative flex-1 overflow-hidden">
                    <Image
                      src={work.previewGrid![i] ?? work.previewGrid![0]}
                      alt=""
                      fill
                      sizes="30vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : work.previewGrid && work.previewLayout === "grid-3T-2B" ? (
            /* 3 сверху + 2 снизу, верхние 60%, нижние 40% */
            <div className="absolute inset-0 flex flex-col gap-1">
              {/* Top row — 3 equal columns, 60% height */}
              <div className="flex gap-1" style={{ flex: "3" }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="relative flex-1 overflow-hidden">
                    <Image
                      src={work.previewGrid![i]}
                      alt=""
                      fill
                      sizes="33vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                      priority={priority && i === 0}
                      loading={priority && i === 0 ? "eager" : "lazy"}
                      quality={80}
                    />
                  </div>
                ))}
              </div>
              {/* Bottom row — 2 equal columns, 40% height */}
              <div className="flex gap-1" style={{ flex: "2" }}>
                {[3, 4].map((i) => (
                  <div key={i} className="relative flex-1 overflow-hidden">
                    <Image
                      src={work.previewGrid![i] ?? work.previewGrid![0]}
                      alt=""
                      fill
                      sizes="50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : work.previewGrid && work.previewGrid.length >= 4 ? (
            /* Default mosaic: large main image left + 2×2 grid right */
            <div className="absolute inset-0 flex gap-1">
              {/* Left — main tall image */}
              <div className="relative flex-[3] overflow-hidden">
                <Image
                  src={work.previewGrid[0]}
                  alt={work.alt}
                  fill
                  sizes="(max-width: 640px) 60vw, 40vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  quality={82}
                />
              </div>
              {/* Right — 2×2 grid */}
              <div className="flex-[2] grid grid-rows-2 gap-1">
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative overflow-hidden">
                    <Image
                      src={work.previewGrid[1]}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                  <div className="relative overflow-hidden">
                    <Image
                      src={work.previewGrid[2]}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="relative overflow-hidden">
                    <Image
                      src={work.previewGrid[3]}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                  <div className="relative overflow-hidden">
                    <Image
                      src={work.previewGrid[4] ?? work.previewGrid[3]}
                      alt=""
                      fill
                      sizes="20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      loading="lazy"
                      quality={78}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Fallback — single banner image */
            <Image
              src={work.image}
              alt={work.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
              className="object-cover object-top"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              quality={82}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.4) 35%, transparent 65%)" }}
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

            {/* Toggle button — only for non-href cards */}
            {!work.href && (
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
            )}
          </div>
        </div>
      </motion.div>
  )

  if (work.href) {
    return (
      <div className="col-span-full">
        <Link href={work.href} className="block">
          {cardContent}
        </Link>
      </div>
    )
  }

  return (
    <div className="col-span-full">
      {cardContent}
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
              {work.fullVideo && (
                <div className="relative mb-6 rounded-xl overflow-hidden" style={{ background: "#000" }}>
                  <video
                    ref={videoRef}
                    src={work.fullVideo}
                    className="w-full h-auto"
                    style={{ display: "block", maxHeight: "70vh" }}
                    muted
                    loop
                    playsInline
                    controls={false}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleMute() }}
                    className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-80"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                    aria-label={muted ? "Включить звук" : "Выключить звук"}
                  >
                    {muted ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                    )}
                  </button>
                </div>
              )}

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
                        quality={78}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
