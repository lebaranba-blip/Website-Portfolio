"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { Work } from "@/data/works"
import { EASE_DEFAULT, CATEGORY_COLORS, CATEGORY_HUE } from "@/lib/constants"

interface WorkCardProps {
  work: Work
  index: number
}

export default function WorkCard({ work, index }: WorkCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const hue = CATEGORY_HUE[work.category] ?? 185

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    let cachedRect = card.getBoundingClientRect()
    const ro = new ResizeObserver(() => { cachedRect = card.getBoundingClientRect() })
    ro.observe(card)

    const onMove = (e: PointerEvent) => {
      const x = e.clientX - cachedRect.left
      const y = e.clientY - cachedRect.top
      card.style.backgroundImage = `radial-gradient(240px 240px at ${x}px ${y}px, hsl(${hue} 70% 65% / 0.13), transparent)`
    }
    const onLeave = () => { card.style.backgroundImage = "none" }

    card.addEventListener("pointermove", onMove)
    card.addEventListener("pointerleave", onLeave)
    return () => {
      ro.disconnect()
      card.removeEventListener("pointermove", onMove)
      card.removeEventListener("pointerleave", onLeave)
    }
  }, [hue])

  return (
    <motion.div
      ref={cardRef}
      className="work-card group relative"
      tabIndex={0}
      role="article"
      aria-label={work.title}
      style={{
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "12px",
        outline: "none",
      }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      suppressHydrationWarning
    >
      {/* Image */}
      <div className="overflow-hidden relative" style={{ aspectRatio: "4/3", borderRadius: "11px 11px 0 0" }}>
        <div className="w-full h-full">
          <Image
            src={work.image}
            alt={work.alt}
            width={800}
            height={600}
            loading={index === 0 ? "eager" : "lazy"}
            priority={index === 0}
            quality={92}
            sizes="(max-width: 640px) calc(100vw - 24px), (max-width: 1024px) calc(50vw - 16px), calc(33.33vw - 18px)"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>

        {work.desc && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-5"
            style={{ background: "linear-gradient(to top, rgba(10,10,10,0.75) 0%, transparent 55%)" }}
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            whileFocus={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.p
              className="text-sm leading-relaxed font-light"
              style={{ color: "rgba(255,255,255,0.88)" }}
              initial={{ y: 8, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              whileFocus={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.05, ease: EASE_DEFAULT }}
            >
              {work.desc}
            </motion.p>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-mono uppercase tracking-widest ${CATEGORY_COLORS[work.category] ?? "opacity-40"}`}>
            {work.category}
          </span>
          <span className="text-xs font-mono opacity-25" style={{ color: "var(--text)" }}>
            {work.year}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <h3
            className="font-semibold text-lg leading-snug transition-colors duration-200 group-hover:opacity-70"
            style={{ color: "var(--text)" }}
          >
            {work.title}
          </h3>
          <motion.span
            className="text-base flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "var(--muted)" }}
            aria-hidden="true"
            initial={{ x: -4 }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
