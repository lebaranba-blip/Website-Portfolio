"use client"
import { useState, useRef, useCallback } from "react"
import { motion, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { TELEGRAM_URL } from "@/lib/constants"

interface TelegramButtonProps {
  className?: string
  size?: "sm" | "md"
}

const STYLES = `
  @keyframes tg-border-spin {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .tg-btn {
    background: linear-gradient(270deg, #0891B2, #EA580C, #1D4ED8, #0891B2);
    background-size: 300% 300%;
    padding: 1.5px;
    border-radius: 9999px;
    animation: tg-border-spin 28s ease infinite !important;
    animation-play-state: running !important;
  }
  @media (prefers-reduced-motion: reduce) {
    .tg-btn { animation: tg-border-spin 28s ease infinite !important; animation-play-state: running !important; }
  }
  @keyframes tg-shimmer {
    0%   { left: -60%; }
    100% { left: 160%; }
  }
  .tg-shimmer-run {
    animation: tg-shimmer 0.65s ease forwards;
  }
`

export default function TelegramButton({ className, size = "md" }: TelegramButtonProps) {
  const pad = size === "md" ? "px-7 py-3.5 text-sm" : "px-4 py-2 text-xs"
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)

  const mx = useSpring(0, { stiffness: 180, damping: 22 })
  const my = useSpring(0, { stiffness: 180, damping: 22 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.2)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.2)
  }, [mx, my])

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    setShimmer(false)
    setTimeout(() => setShimmer(true), 10)
    setTimeout(() => setShimmer(false), 700)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return (
    <>
      <style>{STYLES}</style>
      <motion.a
        ref={ref}
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в Telegram"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ x: mx, y: my }}
        whileTap={{ scale: 0.96 }}
        className={cn("tg-btn group relative inline-flex cursor-pointer select-none", className)}
      >
        <span
          className={cn(
            "relative z-10 flex items-center gap-2 rounded-full font-semibold overflow-hidden",
            pad
          )}
          style={{ background: "var(--bg)", color: "var(--text)" }}
        >
          {/* cyan glow at center on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(8,145,178,0.15), transparent 70%)",
              opacity: hovered ? 1 : 0,
            }}
          />

          {/* shimmer sweep */}
          {shimmer && (
            <span
              aria-hidden="true"
              className="tg-shimmer-run absolute top-0 bottom-0 pointer-events-none"
              style={{
                width: "40%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transform: "skewX(-15deg)",
              }}
            />
          )}

          <svg
            className="shrink-0 relative z-10"
            width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.247l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z" />
          </svg>

          <span className="relative z-10">Написать в Telegram</span>

          <motion.span
            aria-hidden="true"
            className="relative z-10"
            animate={hovered ? { x: 0, opacity: 1 } : { x: -6, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >→</motion.span>
        </span>
      </motion.a>
    </>
  )
}
