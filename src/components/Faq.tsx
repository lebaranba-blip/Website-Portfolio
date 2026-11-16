"use client"
import TextReveal from "@/components/ui/TextReveal"
import { useDict } from "@/lib/language-context"
import { faqDict } from "@/dictionaries/faq"

/** Renders only the questions that already have an answer; nothing at all until one does. */
export default function Faq() {
  const t = useDict(faqDict)
  const items = t.items.filter((i) => (i.a as string).trim().length > 0)
  if (items.length === 0) return null

  return (
    <section id="faq" aria-label={t.heading} className="py-24 md:py-32 px-6 md:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-x-16 gap-y-10">
        <div>
          <TextReveal>
            <span className="font-mono text-xs tracking-[0.22em] uppercase block mb-3" style={{ color: "rgba(242,239,233,0.5)" }}>
              {t.eyebrow}
            </span>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2 className="font-black text-[clamp(2.4rem,6vw,5rem)]" style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1 }}>
              {t.heading}
            </h2>
          </TextReveal>
        </div>
        <div className="process-steps">
          {items.map((i) => (
            <details key={i.q} className="faq-item">
              <summary>{i.q}</summary>
              <p>{i.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
