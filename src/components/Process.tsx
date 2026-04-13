"use client"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"
import TextReveal from "@/components/ui/TextReveal"

export default function Process() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      id="process"
      aria-label="Процесс работы"
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto"
      variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
      initial={prefersReduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {/* Section label */}
      <div className="mb-12">
        <TextReveal>
          <span className="font-mono text-xs tracking-[0.22em] uppercase block mb-3" style={{ color: "rgba(0,0,0,0.5)" }}>
            — 02&nbsp;&nbsp;Процесс
          </span>
        </TextReveal>
      </div>

      {/* Divider */}
      <motion.div
        className="w-full h-px mb-16"
        style={{ background: "var(--border)", transformOrigin: "left" }}
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      />

      {/* Title */}
      <TextReveal delay={0.05} className="mb-10">
        <h2
          className="font-black text-[clamp(2rem,5vw,4rem)]"
          style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: "1.0" }}
        >
          AI Workflow
        </h2>
      </TextReveal>

      {/* Image */}
      <motion.div
        className="overflow-hidden rounded-2xl"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        <Image
          src="/Workflow.png"
          alt="AI Workflow — управляемая генерация для бренда Gump Donuts"
          width={1600}
          height={900}
          quality={90}
          sizes="(max-width: 768px) 100vw, 1280px"
          className="w-full h-auto"
        />
      </motion.div>
    </motion.section>
  )
}
