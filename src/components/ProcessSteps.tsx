"use client"
import TextReveal from "@/components/ui/TextReveal"
import { useDict } from "@/lib/language-context"
import { processDict } from "@/dictionaries/process"
import { useReveal } from "@/lib/use-reveal"

export default function ProcessSteps() {
  const t = useDict(processDict)
  const listRef = useReveal<HTMLOListElement>()

  return (
    <section id="process" aria-label={`${t.heading1} ${t.heading2}`} className="py-16 md:py-24 px-6 md:px-10 max-w-[1280px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-x-16 gap-y-12">
        {/* Heading */}
        <div>
          <TextReveal>
            <span className="font-mono text-xs tracking-[0.22em] uppercase block mb-3" style={{ color: "rgba(242,239,233,0.5)" }}>
              {t.eyebrow}
            </span>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2 className="font-black text-[clamp(2.4rem,6vw,5rem)]" style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: 1 }}>
              {t.heading1}<br /><span className="gradient-text">{t.heading2}</span>
            </h2>
          </TextReveal>
          <p className="mt-6 text-base md:text-lg" style={{ color: "rgba(242,239,233,0.6)", lineHeight: 1.6, maxWidth: "34ch" }}>
            {t.lead}
          </p>
        </div>

        {/* Steps */}
        <ol ref={listRef} className="process-steps">
          {t.steps.map((s, i) => (
            <li key={s.title} className="process-step" data-reveal>
              <span className="font-mono text-xs" style={{ color: "var(--cyan)" }} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-black" style={{ fontSize: "clamp(1.25rem,2vw,1.7rem)", letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1.15 }}>{s.title}</h3>
                <p className="mt-2 text-[15px] md:text-base" style={{ color: "rgba(242,239,233,0.58)", lineHeight: 1.6, maxWidth: "46ch" }}>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
