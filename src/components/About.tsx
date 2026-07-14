"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"
import { useLenis } from "@/lib/lenis-context"
import TextReveal from "@/components/ui/TextReveal"
import { services, skills } from "@/data/services"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { aboutDict } from "@/dictionaries/about"

interface CompanionPhoto {
  src: string
  cls: "float-card" | "float-card-alt"
  objectPosition: string
  scale?: number
  pos: React.CSSProperties
}

const COMPANION_PHOTOS: CompanionPhoto[] = [
  { src: "/about-7.png", cls: "float-card", objectPosition: "center 15%", pos: { bottom: -30, left: -34, width: "44%" } },
  { src: "/about-candid.png", cls: "float-card-alt", objectPosition: "center 15%", pos: { bottom: -46, right: -34, width: "48%" } },
]

export default function About() {
  const lenis = useLenis()
  const isTouch = useIsTouch()
  const noAnim = isTouch
  const t = useDict(aboutDict)

  return (
    <section
      id="about"
      aria-label="Обо мне"
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto relative"
    >
      {/* Depth-1 atmosphere */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: "translate(35%, -30%)",
        }}
      />

      {/* Section label */}
      <div className="mb-12">
        <TextReveal>
          <span className="font-mono text-xs tracking-[0.22em] uppercase block mb-3" style={{ color: "rgba(242,239,233,0.5)" }}>
            — 03&nbsp;&nbsp;{t.eyebrowLabel}
          </span>
        </TextReveal>
      </div>

      {/* Divider */}
      <motion.div
        className="w-full h-px mb-16"
        style={{ background: "var(--border)", transformOrigin: "left" }}
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1 } }}
        initial={noAnim ? false : "hidden"}
        whileInView={noAnim ? undefined : "visible"}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      />

      {/* layout: на мобиле — стек, на планшете — 2 кол, на десктопе — 3 кол */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[420px_1fr_1fr] gap-10 lg:gap-14 relative z-10 items-start">

        {/* Col 1 — фото */}
        <motion.div
          className="flex-shrink-0"
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          initial={noAnim ? false : "hidden"}
          whileInView={noAnim ? undefined : "visible"}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          {/* Мобиль: фото 160px + имя рядом */}
          <div className="flex items-center gap-5 md:block">
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)", aspectRatio: "3/4", width: "clamp(140px, 46vw, 420px)", position: "relative" }}>
                <Image
                  src="/about-main.jpg"
                  alt={t.name}
                  width={720}
                  height={960}
                  loading="lazy"
                  quality={82}
                  sizes="(max-width: 768px) 46vw, 420px"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", display: "block" }}
                />
              </div>
              {/* Фото-компаньоны — разлетаются по углам, только на десктопе */}
              {COMPANION_PHOTOS.map((c) => (
                <div
                  key={c.src}
                  className={`${c.cls} hidden md:block`}
                  style={{
                    position: "absolute",
                    ...c.pos,
                    aspectRatio: "3/4",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.55), 0 0 0 4px var(--bg)",
                    zIndex: 2,
                  }}
                >
                  <Image
                    src={c.src}
                    alt={t.name}
                    width={480}
                    height={640}
                    loading="lazy"
                    quality={78}
                    sizes="160px"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: c.objectPosition, display: "block", transform: c.scale ? `scale(${c.scale})` : undefined }}
                  />
                </div>
              ))}
            </div>
            {/* Имя — только на мобиле (рядом с фото) */}
            <div className="md:hidden pb-2">
              <h2
                className="font-black"
                style={{ fontSize: "clamp(2rem,8vw,3rem)", lineHeight: "0.92", letterSpacing: "-0.04em", color: "var(--text)", fontFamily: "var(--font-display), sans-serif" }}
              >
                {t.name}
              </h2>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase mt-2" style={{ color: "rgba(242,239,233,0.6)" }}>
                {t.role}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Col 2 — имя + bio + CTA */}
        <div className="flex flex-col gap-8">

          {/* Имя — только на планшете и десктопе */}
          <motion.div
            className="hidden md:block"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            initial={noAnim ? false : "hidden"}
            whileInView={noAnim ? undefined : "visible"}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <h2
              className="font-black"
              style={{ fontSize: "clamp(2.6rem,3.5vw,4rem)", lineHeight: "0.92", letterSpacing: "-0.04em", color: "var(--text)", fontFamily: "var(--font-display), sans-serif" }}
            >
              {t.name}
            </h2>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mt-3" style={{ color: "rgba(242,239,233,0.42)" }}>
              {t.role}
            </p>
          </motion.div>

          {/* Bio text */}
          <motion.div
            className="flex flex-col text-[clamp(14px,1.5vw,16px)]"
            style={{ color: "rgba(242,239,233,0.72)", gap: "1.2em", lineHeight: "1.85", fontFamily: "var(--font-space-grotesk), sans-serif" }}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            initial={noAnim ? false : "hidden"}
            whileInView={noAnim ? undefined : "visible"}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            {t.bio.map((para, i) => (
              <p key={i}>
                {para.split("\n").map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </motion.div>

          {/* CTA — anchor scroll to contact */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            initial={noAnim ? false : "hidden"}
            whileInView={noAnim ? undefined : "visible"}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-wide transition-opacity hover:opacity-60"
              style={{ color: "var(--text)" }}
              onClick={(e) => {
                e.preventDefault()
                if (lenis) lenis.scrollTo("#contact")
                else document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span>↓</span>
              <span>{t.ctaContact}</span>
            </a>
          </motion.div>
        </div>

        {/* Right — services list */}
        <div className="flex flex-col justify-between h-full">
          {services.map((s) => (
            <motion.div
              key={s.num}
              className="flex items-center gap-5 py-3.5 md:py-5 group cursor-default relative overflow-hidden"
              style={{ boxShadow: "0 1px 0 0 var(--border)" }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.55, ease: EASE_DEFAULT }}
              suppressHydrationWarning
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(255,255,255,0.03)" }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <span
                className="font-mono text-xs flex-shrink-0 w-8 relative z-10"
                style={{ color: "var(--cyan)", opacity: 0.7 }}
              >
                {s.num}
              </span>
              <div className="relative z-10">
                <p
                  className="font-semibold text-lg leading-tight transition-colors duration-200 group-hover:text-[var(--cyan)]"
                  style={{ color: "var(--text)" }}
                >
                  {t.services[s.num]?.label ?? s.label}
                </p>
                <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "rgba(242,239,233,0.55)" }}>
                  {t.services[s.num]?.desc ?? s.desc}
                </p>
              </div>
              <motion.span
                className="ml-auto flex-shrink-0 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ color: "var(--cyan)" }}
                aria-hidden="true"
              >
                →
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills section */}
      <div className="mt-24 pt-16" style={{ boxShadow: "0 -1px 0 0 var(--border)" }}>
        <TextReveal className="mb-8">
          <h3
            className="font-semibold text-sm tracking-[0.2em] uppercase"
            style={{ color: "rgba(242,239,233,0.5)" }}
          >
            {t.toolsHeading}
          </h3>
        </TextReveal>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {skills.map((skill) => (
            <motion.div
              key={skill}
              className="px-4 py-3 rounded-lg text-center group cursor-default relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text)",
              }}
              whileHover={{ scale: 1.04, background: "rgba(34,211,238,0.1)", borderColor: "rgba(34,211,238,0.35)" }}
              transition={{ duration: 0.2 }}
              suppressHydrationWarning
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(8,145,178,0.15), transparent 70%)" }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
              <p className="text-xs md:text-sm font-mono leading-tight relative z-10">{skill}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
