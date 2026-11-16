"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDict, useLanguage } from "@/lib/language-context"
import { worksDict } from "@/dictionaries/works"
import { VISIBLE } from "@/components/Works"
import LazyVideo from "@/components/LazyVideo"

const LABELS = {
  ru: { next: "Следующий кейс", all: "Все работы" },
  en: { next: "Next case", all: "All work" },
} as const

/** Footer of every case page: the next case and a way to get in touch */
export default function NextCase() {
  const pathname = usePathname()
  const { lang } = useLanguage()
  const t = useDict(worksDict)
  const l = LABELS[lang]
  // A hidden (link-only) case is not in VISIBLE, so it simply leads to the first one
  const i = VISIBLE.findIndex((c) => pathname.startsWith(c.href))
  const next = VISIBLE[(i + 1) % VISIBLE.length]
  const loc = t.cards[next.id]

  return (
    <section aria-label={l.next} className="px-4 md:px-10 pt-6 pb-28 md:pb-20" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 px-2">
          <span className="font-mono text-xs tracking-[0.22em] uppercase" style={{ color: "rgba(242,239,233,0.5)" }}>— {l.next}</span>
          <Link href="/#works" className="inline-flex items-center min-h-[44px] font-mono text-xs tracking-[0.12em] uppercase" style={{ color: "rgba(242,239,233,0.6)", textDecoration: "none" }}>← {l.all}</Link>
        </div>
        <article className="featured-card" style={{ ["--glow" as string]: next.glow }}>
          <Link href={next.href} className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]" style={{ color: "inherit", textDecoration: "none" }}>
            <div className="featured-visual relative overflow-hidden" style={{ background: next.bg }}>
              {next.video ? (
                <LazyVideo src={next.video} poster={next.poster} className="featured-media absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
              ) : next.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={next.poster} alt="" loading="lazy" decoding="async" className="featured-media absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
              ) : null}
            </div>
            <div className="flex flex-col justify-center" style={{ padding: "clamp(28px,4vw,64px) clamp(24px,3.6vw,60px)" }}>
              <div className="font-mono text-[10.5px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.62)" }}>{loc?.cat ?? next.cat}</div>
              <h2 className="featured-title font-black mb-8" style={{ fontSize: "clamp(30px,3vw,50px)", letterSpacing: "-0.035em", color: "#fff", lineHeight: 1.04 }}>{loc?.title ?? next.title}</h2>
              <span className="featured-cta inline-flex items-center gap-2 font-semibold w-fit">
                {t.viewCase} <span className="featured-arrow" aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </article>
      </div>
    </section>
  )
}
