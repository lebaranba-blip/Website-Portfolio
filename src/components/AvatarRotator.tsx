"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"

interface RotatorImage {
  src: string
  alt: string
}

interface Props {
  images: RotatorImage[]
}

export default function AvatarRotator({ images }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const dragStart = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const DRAG_THRESHOLD = 40

  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir)
    setCurrent((i) => (i + dir + images.length) % images.length)
  }, [images.length])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  // Pointer drag
  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX
    containerRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    if (Math.abs(delta) >= DRAG_THRESHOLD) go(delta < 0 ? 1 : -1)
    dragStart.current = null
  }

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 30 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -30 }),
  }

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Image container + side arrows */}
      <div className="relative w-full flex items-center gap-3" style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Prev arrow */}
        <button
          onClick={() => go(-1)}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:scale-95"
          style={{ background: "var(--surface)", border: "1px solid rgba(0,0,0,0.08)", color: "var(--text)" }}
          aria-label="Предыдущий ракурс"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
          style={{ aspectRatio: "3/4", background: "var(--surface)", maxHeight: "60vh" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          aria-label="360° вид аватара — перетащите или нажмите стрелки"
          role="img"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: EASE_DEFAULT }}
              className="absolute inset-0"
              suppressHydrationWarning
            >
              <Image
                src={images[current].src}
                alt={images[current].alt}
                fill
                className="object-cover object-top"
                quality={92}
                priority={current === 0}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Drag hint — hidden on touch devices */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-mono px-3 py-1 rounded-full pointer-events-none hidden md:block"
            style={{ background: "rgba(0,0,0,0.35)", color: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)" }}
          >
            ← перетащи →
          </div>
        </div>

        {/* Next arrow */}
        <button
          onClick={() => go(1)}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:scale-95"
          style={{ background: "var(--surface)", border: "1px solid rgba(0,0,0,0.08)", color: "var(--text)" }}
          aria-label="Следующий ракурс"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Ракурсы">
        {images.map((img, i) => (
          <button
            key={img.src}
            role="tab"
            aria-selected={i === current}
            aria-label={img.alt}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? "var(--text)" : "rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="text-sm font-mono" style={{ color: "var(--muted)" }}>
        {current + 1} / {images.length} — {images[current].alt}
      </p>
    </div>
  )
}
