"use client"
import Link from "next/link"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import TextReveal from "@/components/ui/TextReveal"
import { useDict } from "@/lib/language-context"
import { worksDict } from "@/dictionaries/works"

interface FeaturedItem {
  id: string
  idx: string
  cat: string
  title: string
  pills: string[]
  href: string
  bg: string
  image?: string
  imageFit?: "cover" | "contain"
  video?: string
  videoFit?: "cover" | "contain"
  flip?: boolean
}

const FEATURED: FeaturedItem[] = [
  {
    id: "showreel",
    idx: "01",
    cat: "AI Video · Showreel · 2026",
    title: "Skills Reel",
    pills: ["Kling 3.0", "Veo 3.1", "Seedance 2.0", "DaVinci Resolve"],
    href: "/works/showreel",
    bg: "linear-gradient(140deg, #0A0A0A 0%, #0E3A44 45%, #22D3EE 100%)",
    video: "/works/showreel/card-bg.mp4",
  },
  {
    id: "motion-teaser",
    idx: "02",
    cat: "Motion Design · Code · 2026",
    title: "Motion Teaser",
    pills: ["Remotion 4.0", "React", "TypeScript", "Claude Code"],
    href: "/works/motion-teaser",
    bg: "linear-gradient(140deg, #0D0020 0%, #1E0040 35%, #3D1070 65%, #1A0535 100%)",
    video: "/works/motion-teaser/card-bg.mp4",
    videoFit: "contain",
    flip: true,
  },
  {
    id: "ai-avatar",
    idx: "03",
    cat: "AI Visual · Portrait · 2026",
    title: "AI Avatar",
    pills: ["Freepik Spaces", "AI Portrait"],
    href: "/works/ai-avatar",
    bg: "linear-gradient(135deg, #00C8D7, #3F51B5)",
    image: "/works/ai-avatar/banner.png",
    imageFit: "contain",
  },
  {
    id: "gump-donuts",
    idx: "04",
    cat: "Branding · AI Video · 2026",
    title: "Gump Donuts",
    pills: ["Midjourney", "Nano Banana", "Photoshop", "Figma"],
    href: "/works/gump",
    bg: "linear-gradient(140deg, #FF85A1 0%, #FFA07A 30%, #FFE066 60%, #FF6B6B 100%)",
    video: "/works/gump/card-bg.mp4",
    flip: true,
  },
]

function FeaturedCard({ p, i, mounted }: { p: typeof FEATURED[0]; i: number; mounted: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })
  const [hovered, setHovered] = useState(false)
  const t = useDict(worksDict)

  const show = mounted && inView

  return (
    <article
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-2 overflow-hidden relative"
      style={{
        minHeight: 540,
        direction: p.flip ? "rtl" : "ltr",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(36px)",
        transition: `opacity 0.85s ${i * 0.08}s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.85s ${i * 0.08}s cubic-bezier(0.25,0.46,0.45,0.94)`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual */}
      <div className="relative overflow-hidden" style={{ background: "#0C0B09", direction: "ltr", minHeight: 360 }}>
        {p.video ? (
          <video
            className="absolute inset-0 w-full h-full"
            style={{
              objectFit: p.videoFit ?? "cover",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
            src={p.video}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: p.bg,
              backgroundImage: p.image ? `url(${p.image})` : undefined,
              backgroundSize: p.imageFit ?? "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        )}
        {/* Overlay shimmer on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>

      {/* Info */}
      <div
        className="relative overflow-hidden flex flex-col justify-center"
        style={{
          background: "#0C0B09",
          padding: "clamp(44px,5vw,80px) clamp(40px,5vw,80px)",
          direction: "ltr",
        }}
      >
        {/* Subtle gradient accent on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 20% 50%, ${p.id === "gump-donuts" ? "rgba(255,133,161,0.06)" : "rgba(61,16,112,0.12)"} 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />

        <span
          className="absolute font-black"
          style={{ top: 28, right: 28, fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}
        >
          {p.idx}
        </span>
        <div className="relative font-mono text-[10px] font-bold tracking-[0.14em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          {p.cat}
        </div>
        <h3
          className="relative font-black mb-5"
          style={{ fontSize: "clamp(34px,3.2vw,52px)", letterSpacing: "-0.035em", color: "#fff", lineHeight: 1.05 }}
        >
          {p.title}
        </h3>
        <p className="relative mb-8" style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: 360 }}>
          {t.items[p.id]}
        </p>
        <div className="relative flex flex-wrap gap-2 mb-12">
          {p.pills.map(t => (
            <span
              key={t}
              className="font-semibold"
              style={{
                fontSize: 11, padding: "5px 13px", borderRadius: 100,
                border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.03em",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <Link
          href={p.href}
          className="relative inline-flex items-center gap-2 font-semibold w-fit"
          style={{
            fontSize: 14, color: "#fff", padding: "13px 26px",
            border: `1px solid ${hovered ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
            borderRadius: 100,
            textDecoration: "none",
            background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
            transition: "border-color 0.3s ease, background 0.3s ease",
          }}
        >
          {t.viewCase} <span style={{ transform: hovered ? "translateX(3px)" : "translateX(0)", transition: "transform 0.3s ease", display: "inline-block" }}>→</span>
        </Link>
      </div>
    </article>
  )
}

export default function Works() {
  const [mounted, setMounted] = useState(false)
  const t = useDict(worksDict)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section id="works" className="py-32 md:py-44">

      {/* Header */}
      <div className="flex items-end justify-between mb-16 md:mb-20 px-6 md:px-10 max-w-7xl mx-auto">
        <div>
          <TextReveal>
            <span className="font-mono text-xs tracking-[0.22em] uppercase opacity-35 block mb-3">
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
        >
          02
        </span>
      </div>

      {/* Featured cards stack */}
      <div className="flex flex-col gap-1">
        {FEATURED.map((p, i) => (
          <FeaturedCard key={p.id} p={p} i={i} mounted={mounted} />
        ))}
      </div>
    </section>
  )
}
