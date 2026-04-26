"use client"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import type { Work } from "@/data/works"
import { EASE_DEFAULT } from "@/lib/constants"

interface Props {
  work: Work
}

const trackVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const slideVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export default function CarouselWorkCard({ work }: Props) {
  const sets = work.carouselSets ?? []
  const shouldReduce = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div className="col-span-full">
      <Link href={work.href!} className="block group">
        <motion.div
          ref={cardRef}
          className="relative overflow-hidden"
          style={{
            borderRadius: 20,
            background: "#0A0A0A",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          whileHover={shouldReduce ? {} : { scale: 1.004, boxShadow: "0 20px 60px rgba(0,0,0,0.35)" }}
          transition={{ duration: 0.45, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          {/* Subtle top glow on hover — depth-1 atmosphere */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.07), transparent)",
              opacity: 0,
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            aria-hidden="true"
            suppressHydrationWarning
          />

          {/* ── Hero banner ── */}
          <div className="relative w-full overflow-hidden" style={{ maxHeight: 340 }}>
            <Image
              src={work.image}
              alt={work.alt}
              width={1400}
              height={700}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              priority
              quality={90}
              sizes="(max-width: 640px) 100vw, 1280px"
            />
            {/* Gradient fade to card bg */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to bottom, transparent 40%, #0A0A0A 100%)" }}
              aria-hidden="true" />
            {/* Overlay text */}
            <div className="absolute bottom-0 left-0 right-0 px-7 pb-6 flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest block mb-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}>
                  {work.category} · {work.year}
                </span>
                <h3 className="font-black leading-none"
                  style={{ color: "#fff", fontSize: "clamp(1.6rem,3.5vw,2.6rem)", letterSpacing: "-0.035em", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                  {work.title}
                </h3>
                {work.desc && (
                  <p className="mt-2 text-sm font-light" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 480 }}>
                    {work.desc}
                  </p>
                )}
              </div>
              {/* Arrow */}
              <motion.div
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,0.7)",
                }}
                whileHover={shouldReduce ? {} : { scale: 1.1, color: "#fff" }}
                transition={{ duration: 0.22 }}
                suppressHydrationWarning
                aria-hidden="true"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>

          {/* ── Three carousel tracks ── */}
          <div className="pb-7 flex flex-col gap-5">
            {sets.map((set, si) => (
              <motion.div
                key={set.num}
                variants={trackVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                suppressHydrationWarning
              >
                {/* Set label */}
                <div className="px-7 mb-3 flex items-center gap-3">
                  <span className="font-mono text-xs font-bold"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    {set.num}
                  </span>
                  <span className="font-semibold text-sm"
                    style={{ color: "rgba(255,255,255,0.65)" }}>
                    {set.label}
                  </span>
                  <span className="font-mono text-xs"
                    style={{ color: "rgba(255,255,255,0.2)" }}>
                    · {set.tone}
                  </span>
                </div>

                {/* Slides row — horizontally scrollable on mobile */}
                <div className="px-7 flex gap-3 overflow-x-auto"
                  style={{ scrollbarWidth: "none", touchAction: "pan-x" }}>
                  {set.slides.map((slide, i) => (
                    <motion.div
                      key={slide.src}
                      className="relative flex-shrink-0"
                      style={{ width: 160, aspectRatio: "1/1", borderRadius: 12, overflow: "hidden" }}
                      variants={slideVariants}
                      suppressHydrationWarning
                    >
                      <Image
                        src={slide.src}
                        alt={slide.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="160px"
                        quality={78}
                        loading="lazy"
                      />
                      {/* Slide number badge */}
                      <div className="absolute top-2 left-2 font-mono text-[10px] font-bold px-2 py-0.5"
                        style={{
                          background: "rgba(0,0,0,0.5)",
                          backdropFilter: "blur(6px)",
                          borderRadius: 5,
                          color: "rgba(255,255,255,0.6)",
                        }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Track divider — except last */}
                {si < sets.length - 1 && (
                  <div className="mx-7 mt-5 h-px"
                    style={{ background: "rgba(255,255,255,0.05)" }} aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA bar */}
          <div className="px-7 py-4 flex items-center justify-between border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <span className="font-mono text-xs"
              style={{ color: "rgba(255,255,255,0.25)" }}>
              3 серии · 12 слайдов · ChatGPT Images 2.0
            </span>
            <span className="font-mono text-xs flex items-center gap-1.5 transition-all duration-300"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              Смотреть кейс
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </motion.div>
      </Link>
    </div>
  )
}
