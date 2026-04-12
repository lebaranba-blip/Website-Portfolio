"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Work } from "@/data/works"
import { EASE_DEFAULT, CATEGORY_COLORS } from "@/lib/constants"

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
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandRef = useRef<HTMLDivElement>(null)

  // Auto-play video when expand opens, pause on collapse
  useEffect(() => {
    if (!expanded || !videoRef.current) return
    const v = videoRef.current
    v.muted = true
    v.play().catch(() => {})
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
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.4, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        {/* Poster image */}
        <div className="relative w-full" style={{ aspectRatio: "21/9" }}>
          <Image
            src={work.image}
            alt={work.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
            className="object-cover"
            priority
            quality={85}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.1) 50%, transparent 100%)" }}
          />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between gap-4">
            <div>
              <span className={`text-xs font-mono uppercase tracking-widest mb-2 block ${CATEGORY_COLORS[work.category] ?? "opacity-40"}`}>
                {work.category} · {work.year}
              </span>
              <h3
                className="font-bold leading-none"
                style={{ color: "#fff", fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
              >
                {work.title}
              </h3>
              {work.desc && (
                <p className="mt-2 text-sm font-light" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "480px" }}>
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
                  {work.gallery.map((item) => (
                    <motion.div
                      key={item.src}
                      className="mb-3 break-inside-avoid overflow-hidden rounded-xl"
                      variants={itemVariants}
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
                    </motion.div>
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
    </div>
  )
}
