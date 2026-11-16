"use client"
import Link from "next/link"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import TextReveal from "@/components/ui/TextReveal"
import { useDict } from "@/lib/language-context"
import { worksDict } from "@/dictionaries/works"

export interface FeaturedItem {
  id: string
  /** Off the home grid; the case page still opens by direct link */
  hidden?: boolean
  cat: string
  title: string
  pills: string[]
  href: string
  bg: string
  image?: string
  imageFit?: "cover" | "contain"
  /** Still shown until the loop starts; the loop is fetched only near the viewport */
  poster?: string
  /** Hover glow, as "r,g,b" */
  glow: string
  video?: string
  videoFit?: "cover" | "contain"
}

const FEATURED: FeaturedItem[] = [
  {
    // Title, line and tags come from worksDict.cards so they switch with the language
    id: "puma-youth",
    cat: "Spec-реклама · AI-фильм · 2:06",
    title: "PUMA Suede — «Молодость»",
    pills: ["Spec", "AI-видео", "Режиссура", "Цветокоррекция"],
    href: "/works/puma-youth",
    bg: "linear-gradient(140deg, #1F4A4C 0%, #2E6B6A 45%, #F2A65A 100%)",
    video: "/works/puma-youth/card-hq.mp4", // cut from the 1080p film, cropped above the subtitles
    poster: "/works/puma-youth/card-poster.webp",
    glow: "242,166,90",
  },
  {
    id: "showreel",
    cat: "AI Video · Showreel · 2026",
    title: "Skills Reel",
    pills: ["Kling 3.0", "Veo 3.1", "Seedance 2.0", "DaVinci Resolve"],
    href: "/works/showreel",
    bg: "linear-gradient(140deg, #0A0A0A 0%, #0E3A44 45%, #22D3EE 100%)",
    video: "/works/showreel/card-bg.mp4",
    poster: "/works/showreel/card-poster.webp",
    glow: "34,211,238",
  },
  {
    id: "gump-donuts",
    cat: "Branding · AI Video · 2026",
    title: "Gump Donuts",
    pills: ["Midjourney", "Nano Banana", "Photoshop", "Figma"],
    href: "/works/gump",
    bg: "linear-gradient(140deg, #FF85A1 0%, #FFA07A 30%, #FFE066 60%, #FF6B6B 100%)",
    video: "/works/gump/space-video.mp4", // same shot as card-bg, 1280px instead of 1000px
    poster: "/works/gump/card-poster.webp",
    glow: "255,133,161",
  },
  {
    id: "ai-avatar",
    cat: "AI Visual · Portrait · 2026",
    title: "AI Avatar",
    pills: ["Freepik Spaces", "AI Portrait"],
    href: "/works/ai-avatar",
    bg: "linear-gradient(135deg, #00C8D7, #3F51B5)",
    video: "/works/ai-avatar/card-bg.mp4",
    poster: "/works/ai-avatar/card-poster.webp",
    glow: "34,211,238",
  },
  {
    id: "motion-teaser",
    cat: "Motion Design · Code · 2026",
    title: "Motion Teaser",
    pills: ["Remotion 4.0", "React", "TypeScript", "Claude Code"],
    href: "/works/motion-teaser",
    bg: "linear-gradient(140deg, #0D0020 0%, #1E0040 35%, #3D1070 65%, #1A0535 100%)",
    video: "/works/motion-teaser/motion-teaser.mp4", // the teaser itself
    poster: "/works/motion-teaser/card-poster.webp",
    glow: "139,92,246",
  },
  {
    id: "valter",
    cat: "AI Video · UGC · 2026",
    title: "Valter",
    pills: ["Seedance 2.5", "Character sheet", "Remotion"],
    href: "/works/valter",
    bg: "linear-gradient(140deg, #0B1530 0%, #14275C 55%, #E4002B 130%)",
    video: "/works/valter/card-bg.mp4",
    poster: "/works/valter/card-poster.webp",
    glow: "96,165,250",
  },
  {
    id: "yandex-october",
    hidden: true, // until the second payment lands
    cat: "AI Video · Media Facade · 2026",
    title: "Yandex Market",
    pills: ["Seedance", "First/Last frame", "Topaz Video AI"],
    href: "/works/yandex-october",
    bg: "#0047FF",
    video: "/works/yandex-october/card-bg.mp4",
    poster: "/works/yandex-october/card-poster.webp",
    glow: "0,71,255",
  },
]

// Number and alternate sides by position among visible cards, so hiding one never leaves a gap
export const VISIBLE = FEATURED.filter(p => !p.hidden)

function FeaturedCard({ p, i }: { p: FeaturedItem; i: number }) {
  const flip = i % 2 === 1
  const idx = String(i + 1).padStart(2, "0")
  const ref = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // Fetch the loop a little before the card arrives, play it only while on screen
  const near = useInView(ref, { once: true, margin: "40% 0px 40% 0px" })
  const onScreen = useInView(ref, { amount: 0.25 })
  const [ready, setReady] = useState(false)
  const t = useDict(worksDict)
  const loc = t.cards[p.id]
  const desc = t.items[p.id]

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (onScreen) {
      v.muted = true
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [onScreen, near])

  // Pointer position as CSS vars — rect cached on enter, no layout reads per move
  const rectRef = useRef<DOMRect | null>(null)
  const onEnter = (e: React.MouseEvent<HTMLElement>) => { rectRef.current = e.currentTarget.getBoundingClientRect() }
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = rectRef.current
    if (!r) return
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`)
  }

  return (
    <article ref={ref} className="featured-card" style={{ ["--glow" as string]: p.glow }} onMouseEnter={onEnter} onMouseMove={onMove}>
      <span className="featured-spot" aria-hidden="true" />
      <Link href={p.href} className={"grid grid-cols-1 h-full " + (flip ? "md:grid-cols-[1fr_1.1fr]" : "md:grid-cols-[1.1fr_1fr]")} style={{ color: "inherit", textDecoration: "none" }}>
        {/* Visual */}
        <div className={"featured-visual relative overflow-hidden" + (flip ? " md:order-2" : "")} style={{ background: p.bg }}>
          {p.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.poster} srcSet={p.poster ? `${p.poster.replace(".webp", "-760.webp")} 760w, ${p.poster} 1300w` : undefined} sizes="(max-width: 768px) 100vw, 52vw" alt="" loading="lazy" decoding="async" className="featured-media absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
          )}
          {p.video && near && (
            <video
              ref={videoRef}
              className="featured-media absolute inset-0 w-full h-full"
              style={{ objectFit: p.videoFit ?? "cover", opacity: ready ? 1 : 0 }}
              src={p.video}
              loop
              muted
              playsInline
              preload="metadata"
              onPlaying={() => setReady(true)}
              aria-hidden="true"
            />
          )}
          <span className="featured-idx font-mono" aria-hidden="true">{idx}</span>
        </div>

        {/* Info */}
        <div className="relative flex flex-col justify-center" style={{ padding: "clamp(28px,4vw,64px) clamp(24px,3.6vw,60px)" }}>
          <div className="font-mono text-[10.5px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.62)" }}>
            {loc?.cat ?? p.cat}
          </div>
          <h3 className="featured-title font-black mb-5" style={{ fontSize: "clamp(30px,3vw,50px)", letterSpacing: "-0.035em", color: "#fff", lineHeight: 1.04 }}>
            {loc?.title ?? p.title}
          </h3>
          {desc && (
            <p className="mb-7" style={{ fontSize: 16, color: "rgba(255,255,255,0.58)", lineHeight: 1.65, maxWidth: 400 }}>
              {desc}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-9">
            {(loc?.pills ?? p.pills).map((pill) => (
              <span key={pill} className="font-semibold" style={{ fontSize: 11, padding: "5px 13px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)", letterSpacing: "0.03em" }}>
                {pill}
              </span>
            ))}
          </div>
          <span className="featured-cta inline-flex items-center gap-2 font-semibold w-fit">
            {t.viewCase} <span className="featured-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
  )
}

export default function Works() {
  const t = useDict(worksDict)

  return (
    <section id="works" className="py-16 md:py-28">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 md:mb-16 px-6 md:px-10 max-w-[1280px] mx-auto">
        <div>
          <TextReveal>
            <span className="font-mono text-xs tracking-[0.22em] uppercase opacity-50 block mb-3">
              {t.eyebrow}
            </span>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2 className="font-black text-[clamp(2.4rem,7.5vw,6.5rem)]" style={{ letterSpacing: "-0.04em", color: "var(--text)", lineHeight: "1.0" }}>
              {t.heading1}<br /><span className="gradient-text">{t.heading2}</span>
            </h2>
          </TextReveal>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4 md:gap-6 px-4 md:px-10 max-w-[1280px] mx-auto">
        {VISIBLE.map((p, i) => (
          <FeaturedCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  )
}
