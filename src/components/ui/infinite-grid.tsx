"use client"
import { useEffect } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"

export default function InfiniteGrid() {
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)

  const radius = typeof window !== "undefined" && window.innerWidth < 768 ? 150 : 300
  const maskImage = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const onLeave = () => {
      mouseX.set(-9999)
      mouseY.set(-9999)
    }
    window.addEventListener("mousemove", onMove)
    document.documentElement.addEventListener("mouseleave", onLeave)
    return () => {
      window.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
    }
  }, [mouseX, mouseY])

  const gridSvg = (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="site-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#site-grid)" />
    </svg>
  )

  return (
    <>
      <style>{`
        @keyframes grid-scroll {
          from { transform: translate(0, 0); }
          to   { transform: translate(40px, 40px); }
        }
        .grid-scroll-inner {
          animation: grid-scroll 4s linear infinite;
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          position: absolute;
          top: -40px;
          left: -40px;
        }
      `}</style>

      <div
        className="fixed inset-0 pointer-events-none overflow-hidden text-black z-0"
        aria-hidden="true"
      >
        {/* dim static layer */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="grid-scroll-inner">{gridSvg}</div>
        </div>

        {/* cursor reveal layer — follows mouse anywhere on page */}
        <motion.div
          className="absolute inset-0 opacity-[0.22]"
          style={{ maskImage, WebkitMaskImage: maskImage }}
        >
          <div className="grid-scroll-inner">{gridSvg}</div>
        </motion.div>
      </div>
    </>
  )
}
