"use client"
import { motion, useReducedMotion } from "framer-motion"
import WorkCard from "@/components/WorkCard"
import FeaturedWorkCard from "@/components/FeaturedWorkCard"
import { works } from "@/data/works"
import { EASE_DEFAULT } from "@/lib/constants"
import TextReveal from "@/components/ui/TextReveal"

export default function Works() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.section
      id="works"
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto"
      variants={{
        hidden: { clipPath: "inset(5% 2% 0% 2% round 20px)", opacity: 0.4 },
        visible: { clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 },
      }}
      initial={prefersReduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.0, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >

      {/* Section header */}
      <div className="flex items-end justify-between mb-14 gap-4">
        <div>
          <TextReveal>
            <span className="font-mono text-xs tracking-[0.22em] uppercase opacity-35 block mb-3">
              — 01 Портфолио
            </span>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2
              className="font-black text-[clamp(2.4rem,7.5vw,6.5rem)]"
              style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: "1.0" }}
            >
              Избранные работы
            </h2>
          </TextReveal>
        </div>

        {/* Count badge */}
        <motion.div
          className="hidden md:flex flex-col items-end flex-shrink-0 pb-2"
          variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          <span className="font-black text-[clamp(3rem,6vw,6rem)] leading-none opacity-[0.1]" style={{ color: "var(--text)" }}>
            {String(works.length).padStart(2, "0")}
          </span>
          <span className="font-mono text-xs opacity-40 tracking-widest uppercase mt-1">проектов</span>
        </motion.div>
      </div>

      {/* Divider */}
      <motion.div
        className="w-full h-px mb-12"
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_DEFAULT }}
        style={{ background: "var(--border)", transformOrigin: "left" }}
        suppressHydrationWarning
      />

      {/* Grid — stagger per card */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 mb-20"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        suppressHydrationWarning
      >
        {works.map((work, i) =>
          work.gallery ? (
            <FeaturedWorkCard key={work.id} work={work} />
          ) : (
            <WorkCard key={work.id} work={work} index={i} />
          )
        )}
      </motion.div>

    </motion.section>
  )
}
