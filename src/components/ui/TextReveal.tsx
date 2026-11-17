"use client"
import { motion } from "framer-motion"
import { useReducedSafe } from "@/lib/use-reduced"
import { EASE_DEFAULT } from "@/lib/constants"
import { useIsTouch } from "@/lib/use-is-touch"

export default function TextReveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const isTouch = useIsTouch()
  const reduced = useReducedSafe()

  const hidden = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 34, clipPath: "inset(0% 0% 100% 0%)", filter: isTouch ? "blur(0px)" : "blur(10px)" }
  const visible = reduced
    ? { opacity: 1 }
    : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)", filter: "blur(0px)", transitionEnd: { clipPath: "none", filter: "none" } }

  return (
    <motion.div
      className={className}
      variants={{ hidden, visible }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduced ? 0.3 : 0.95, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  )
}
