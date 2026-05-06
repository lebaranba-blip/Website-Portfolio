"use client"
import { motion } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"
import { useIsTouch } from "@/lib/use-is-touch"

export default function TextReveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const isTouch = useIsTouch()

  if (isTouch) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, delay, ease: EASE_DEFAULT }}
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  )
}
