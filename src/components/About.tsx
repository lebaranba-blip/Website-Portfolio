"use client"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"
import { useLenis } from "@/lib/lenis-context"
import TextReveal from "@/components/ui/TextReveal"
import { services, skills } from "@/data/services"

export default function About() {
  const prefersReduced = useReducedMotion()
  const lenis = useLenis()

  return (
    <motion.section
      id="about"
      aria-label="Обо мне"
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto relative"
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
      {/* Depth-1 atmosphere */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          transform: "translate(35%, -30%)",
        }}
      />

      {/* Section label */}
      <div className="mb-12">
        <TextReveal>
          <span className="font-mono text-xs tracking-[0.22em] uppercase block mb-3" style={{ color: "rgba(0,0,0,0.5)" }}>
            — 02&nbsp;&nbsp;Обо мне
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

      {/* layout: на мобиле — стек, на планшете — 2 кол, на десктопе — 3 кол */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr_1fr] gap-10 lg:gap-14 relative z-10 items-start">

        {/* Col 1 — фото */}
        <motion.div
          className="flex-shrink-0"
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          {/* Мобиль: фото 160px + имя рядом */}
          <div className="flex items-end gap-5 md:block">
            <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,0.14)", aspectRatio: "3/4", width: "clamp(140px, 42vw, 360px)", flexShrink: 0, position: "relative" }}>
              <Image
                src="/about.webp"
                alt="Дмитрий"
                width={720}
                height={960}
                priority
                quality={85}
                sizes="(max-width: 768px) 42vw, 360px"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", display: "block" }}
              />
            </div>
            {/* Имя — только на мобиле (рядом с фото) */}
            <div className="md:hidden pb-2">
              <h2
                className="font-black"
                style={{ fontSize: "clamp(2rem,8vw,3rem)", lineHeight: "0.92", letterSpacing: "-0.04em", color: "var(--text)" }}
              >
                Дмитрий
              </h2>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase mt-2" style={{ color: "rgba(0,0,0,0.42)" }}>
                AI&nbsp;Visual · Design
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
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <h2
              className="font-black"
              style={{ fontSize: "clamp(2.6rem,3.5vw,4rem)", lineHeight: "0.92", letterSpacing: "-0.04em", color: "var(--text)" }}
            >
              Дмитрий
            </h2>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase mt-3" style={{ color: "rgba(0,0,0,0.42)" }}>
              AI&nbsp;Visual · Design · Automation
            </p>
          </motion.div>

          {/* Bio text */}
          <motion.div
            className="flex flex-col text-[clamp(14px,1.5vw,16px)]"
            style={{ color: "rgba(0,0,0,0.72)", gap: "1.2em", lineHeight: "1.85", fontFamily: "var(--font-space-grotesk), sans-serif" }}
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            <p>26&nbsp;лет, Омск. Дизайнер. Не&nbsp;случайно сюда попал, а&nbsp;выбрал.</p>
            <p>Дизайн для бизнеса. Не&nbsp;украшательство, а&nbsp;инструмент который приводит клиентов и&nbsp;экономит бюджет. Логотипы, айдентика, визуал, бренд-платформы. Каждый проект начинаю с&nbsp;вопроса «зачем», а&nbsp;не «как будет выглядеть».</p>
            <p>Нейросети встроены в&nbsp;каждый этап. Видео генерирую через Kling, Seedance, код пишу с&nbsp;Claude Code, рутину отдаю ботам. Промты для меня это техзадание. Чем точнее сформулируешь, тем меньше переделок.</p>
            <p>Figma, Photoshop. Инструменты меняются, подход нет. Сначала разобраться в&nbsp;задаче, потом открывать редактор. Красивая картинка без стратегии это просто красивая картинка.</p>
            <p>Не&nbsp;жду пока клиент объяснит всё сам. Задаю вопросы, смотрю на&nbsp;бизнес изнутри, предлагаю то, до&nbsp;чего бриф не&nbsp;дотянулся. Обычно именно это и&nbsp;оказывается самым ценным.</p>
          </motion.div>

          {/* CTA — anchor scroll to contact */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            initial="hidden"
            whileInView="visible"
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
              <span>Перейти к контакту</span>
            </a>
          </motion.div>
        </div>

        {/* Right — services list */}
        <motion.div
          className="flex flex-col justify-between h-full"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          suppressHydrationWarning
        >
          {services.map((s) => (
            <motion.div
              key={s.num}
              className="flex items-center gap-5 py-5 border-b group cursor-default relative overflow-hidden"
              style={{ borderColor: "var(--border)" }}
              variants={{ hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0 } }}
              transition={{ duration: 0.55, ease: EASE_DEFAULT }}
              whileHover={{ x: 5 }}
              suppressHydrationWarning
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(0,0,0,0.025)" }}
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
                  {s.label}
                </p>
                {/* Описания темнее (пункт 2) */}
                <p className="text-sm mt-0.5 leading-relaxed" style={{ color: "rgba(0,0,0,0.55)" }}>
                  {s.desc}
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
        </motion.div>
      </div>

      {/* Skills section */}
      <div className="mt-24 pt-16 border-t" style={{ borderColor: "var(--border)" }}>
        <TextReveal className="mb-8">
          <h3
            className="font-semibold text-sm tracking-[0.2em] uppercase"
            style={{ color: "rgba(0,0,0,0.5)" }}
          >
            Инструменты
          </h3>
        </TextReveal>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          suppressHydrationWarning
        >
          {skills.map((skill, i) => (
            <motion.div
              key={skill}
              className="px-4 py-3 rounded-lg text-center group cursor-default relative overflow-hidden"
              style={{
                background: "rgba(0,0,0,0.03)",
                border: "1px solid rgba(0,0,0,0.06)",
                color: "var(--text)",
              }}
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.04, background: "rgba(8,145,178,0.08)", borderColor: "rgba(8,145,178,0.3)" }}
              suppressHydrationWarning
            >
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, rgba(8,145,178,0.15), transparent 70%)" }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
              />
              <p className="text-sm font-mono leading-tight relative z-10">{skill}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
