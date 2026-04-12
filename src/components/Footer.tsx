"use client"
import { motion } from "framer-motion"
import { TELEGRAM_URL, EASE_DEFAULT } from "@/lib/constants"
import TelegramButton from "@/components/ui/telegram-button"

const MARQUEE_ITEMS = ["AI Visual", "Брендинг", "Автоматизация", "Photo & Video", "Промо", "AI Workflow", "Brand Kit", "Концепты"]
const DOTS = ["var(--cyan)", "var(--orange)", "var(--blue)"]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="relative pt-24 pb-10 px-6 md:px-10 overflow-x-hidden" style={{ borderTop: "1px solid var(--border)" }}>
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--orange), var(--cyan))",
          filter: "blur(140px)",
          opacity: 0.07,
          transform: "translate(30%, 30%)",
        }}
      />

      {/* Faded background text — depth element */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-end pr-6 md:pr-10 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <span
          className="font-black select-none"
          style={{
            fontSize: "clamp(8rem, 22vw, 20rem)",
            letterSpacing: "-0.06em",
            lineHeight: "1",
            color: "var(--text)",
            opacity: 0.03,
            whiteSpace: "nowrap",
          }}
        >
          AI&amp;Design
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="mb-10"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          {/* Bleed typography */}
          <h2
            className="font-black"
            style={{
              letterSpacing: "-0.04em",
              color: "var(--text)",
              lineHeight: "0.95",
              fontSize: "clamp(2.2rem, 11.5vw, 10.5rem)",
              width: "100vw",
              marginLeft: "calc(-1 * (50vw - 50%))",
              paddingLeft: "calc(50vw - 50% + 1.5rem)",
            }}
          >
            Есть проект?
          </h2>
          <p
            className="font-mono mt-4 opacity-50"
            style={{
              fontSize: "clamp(0.85rem, 1.5vw, 1.1rem)",
              letterSpacing: "0.01em",
              color: "var(--text)",
            }}
          >
            Напишите — обсудим.
          </p>
        </motion.div>

        {/* Marquee strip — анимированная бегущая строка */}
        <div
          className="relative overflow-hidden mb-14 py-3"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
          aria-hidden="true"
        >
          <div
            className="marquee-track"
            style={{
              display: "flex",
              width: "max-content",
              animation: "marquee 28s linear infinite",
            }}
          >
            {[...Array(3)].map((_, ri) => (
              <div key={ri} style={{ display: "flex" }}>
                {MARQUEE_ITEMS.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0 2.5rem",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      fontSize: "0.7rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      opacity: 0.75,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: DOTS[i % 3],
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>

        </div>

        {/* CTA — только Telegram */}
        <motion.div
          className="flex flex-wrap gap-4 mb-20"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_DEFAULT }}
          suppressHydrationWarning
        >
          <TelegramButton size="md" />
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs font-mono opacity-65">© {year} Дмитрий — AI & Design</p>
          <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-xs font-mono opacity-85 hover:opacity-100 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cyan)]" style={{ color: "inherit" }}>TG</a>
        </div>
      </div>
    </footer>
  )
}
