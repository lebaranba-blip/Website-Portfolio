"use client"
import { motion } from "framer-motion"
import TextReveal from "@/components/ui/TextReveal"
import TelegramButton from "@/components/ui/telegram-button"
import { TELEGRAM_URL, EASE_DEFAULT, STAGGER_DEFAULT } from "@/lib/constants"
import { useIsTouch } from "@/lib/use-is-touch"
import { useDict } from "@/lib/language-context"
import { servicesDict } from "@/dictionaries/services"

export default function Services() {
  const isTouch = useIsTouch()
  const noAnim = isTouch
  const t = useDict(servicesDict)

  return (
    <section
      id="services"
      aria-label={t.heading1}
      className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto relative"
    >
      {/* Ambient depth — matches About/Footer glow language */}
      <div
        aria-hidden="true"
        className="absolute top-1/4 left-0 w-[460px] h-[460px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          filter: "blur(90px)",
          transform: "translate(-40%, -20%)",
        }}
      />

      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-14 md:mb-20 relative z-10">
        <div>
          <TextReveal>
            <span
              className="font-mono text-xs tracking-[0.22em] uppercase block mb-3"
              style={{ color: "rgba(242,239,233,0.5)" }}
            >
              {t.eyebrow}
            </span>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2
              className="font-black text-[clamp(2.4rem,7.5vw,6.5rem)]"
              style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: "1.0" }}
            >
              {t.heading1}<br />{t.heading2}
            </h2>
          </TextReveal>
        </div>
        <span
          className="hidden md:block font-black leading-none pb-2"
          style={{ fontSize: "clamp(3rem,6vw,6rem)", color: "var(--text)", opacity: 0.05 }}
          aria-hidden="true"
        >
          03
        </span>
      </div>

      {/* ── Catalog rows ── */}
      <motion.div
        className="relative z-10"
        style={{ boxShadow: "0 -1px 0 0 var(--border)" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: STAGGER_DEFAULT } } }}
        initial={noAnim ? false : "hidden"}
        animate={noAnim ? "visible" : undefined}
        whileInView={noAnim ? undefined : "visible"}
        viewport={{ once: true, margin: "-60px" }}
        suppressHydrationWarning
      >
        {t.items.map((item) => (
          <motion.a
            key={item.num}
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.title} — ${item.price}. ${t.discuss}`}
            className="group relative grid grid-cols-1 md:grid-cols-[3rem_1fr_auto] gap-x-8 lg:gap-x-14 gap-y-3 py-8 md:py-10 no-underline overflow-hidden"
            style={{ boxShadow: "0 1px 0 0 var(--border)", color: "inherit" }}
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, ease: EASE_DEFAULT }}
            suppressHydrationWarning
          >
            {/* Hover wash */}
            <span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(90deg, rgba(34,211,238,0.055) 0%, transparent 55%)" }}
            />
            {/* Cyan edge */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 bottom-0 w-px origin-center scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"
              style={{ background: "var(--cyan)" }}
            />

            {/* Number */}
            <span
              className="font-mono text-xs pt-1.5 relative text-[rgba(242,239,233,0.32)] group-hover:text-[var(--cyan)] transition-colors duration-300"
              aria-hidden="true"
            >
              {item.num}
            </span>

            {/* Title + desc + tags */}
            <div className="relative">
              <h3
                className="font-black mb-2.5"
                style={{
                  fontSize: "clamp(1.45rem,2.6vw,2.15rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--text)",
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {item.title}
              </h3>
              <p
                className="text-[15px] md:text-base leading-relaxed mb-5"
                style={{ color: "rgba(242,239,233,0.55)", maxWidth: "44ch" }}
              >
                {item.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      padding: "5px 13px",
                      borderRadius: 100,
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(242,239,233,0.45)",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price + affordance */}
            <div className="relative flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-start gap-x-4 gap-y-1.5 md:pt-1 md:min-w-[9.5rem]">
              <span
                className="font-black tabular-nums whitespace-nowrap"
                style={{
                  fontSize: "clamp(1.15rem,1.8vw,1.6rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  fontFamily: "var(--font-display), sans-serif",
                }}
              >
                {item.price}
              </span>
              {item.priceAlt && (
                <span
                  className="font-mono whitespace-nowrap"
                  style={{ fontSize: 12, color: "rgba(242,239,233,0.38)" }}
                >
                  {item.priceAlt}
                </span>
              )}
              <span
                className="font-mono inline-flex items-center gap-1.5 md:mt-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                style={{ fontSize: 12, color: "var(--cyan)" }}
                aria-hidden="true"
              >
                {t.discuss}
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>

      {/* ── Note + CTA ── */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-12 relative z-10"
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
        initial={noAnim ? false : "hidden"}
        animate={noAnim ? "visible" : undefined}
        whileInView={noAnim ? undefined : "visible"}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(242,239,233,0.45)", maxWidth: "52ch" }}
        >
          {t.note}
        </p>
        <div className="flex-shrink-0">
          <TelegramButton />
        </div>
      </motion.div>
    </section>
  )
}
