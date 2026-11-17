"use client"
import { useRef } from "react"
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion"
import { useReducedSafe } from "@/lib/use-reduced"

/**
 * Letters start scattered apart and slide together as the block scrolls in,
 * landing exactly when it is fully on screen. Scroll-linked, transform only.
 */
function Letter({ ch, i, n, progress }: { ch: string; i: number; n: number; progress: MotionValue<number> }) {
  const off = (i - (n - 1) / 2) / n // -0.5 … 0.5
  const x = useTransform(progress, [0, 1], [`${off * 260}%`, "0%"])
  const y = useTransform(progress, [0, 1], [`${((i * 37) % 7 - 3) * 14}%`, "0%"])
  const rotate = useTransform(progress, [0, 1], [((i * 53) % 9 - 4) * 4, 0])
  const opacity = useTransform(progress, [0, 0.55], [0.15, 1])
  return (
    <motion.span style={{ x, y, rotate, opacity, display: "inline-block", whiteSpace: "pre" }}>
      {ch}
    </motion.span>
  )
}

export default function AssembleText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useReducedSafe()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 75%"] })
  const done = useMotionValue(1)
  const progress = reduced ? done : scrollYProgress
  const chars = [...text]
  return (
    <span ref={ref} aria-label={text} style={{ display: "inline-block" }}>
      <span aria-hidden="true">
        {chars.map((ch, i) => <Letter key={i} ch={ch} i={i} n={chars.length} progress={progress} />)}
      </span>
    </span>
  )
}
