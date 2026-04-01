"use client"
import { motion } from "framer-motion"
import { EASE_DEFAULT } from "@/lib/constants"

export default function TextReveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        variants={{ hidden: { y: "100%" }, visible: { y: "0%" } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, delay, ease: EASE_DEFAULT }}
        suppressHydrationWarning
      >
        {children}
      </motion.div>
    </div>
  )
}
