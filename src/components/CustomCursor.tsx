"use client"
import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [usingKeyboard, setUsingKeyboard] = useState(false)

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return

    const dot = dotRef.current
    const canvas = canvasRef.current
    if (!dot || !canvas) return

    const ctx = canvas.getContext("2d")!
    let mouseX = 0, mouseY = 0, rafId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Trail particles
    const trail: { x: number; y: number; age: number; size: number }[] = []
    const MAX_TRAIL = 28

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setIsVisible(true)
      setUsingKeyboard(false)
      document.body.classList.add("cursor-hidden")
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`

      trail.push({ x: mouseX, y: mouseY, age: 0, size: 3.5 })
      if (trail.length > MAX_TRAIL) trail.shift()
    }

    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setUsingKeyboard(true)
        document.body.classList.remove("cursor-hidden")
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      trail.forEach((p, i) => {
        p.age += 1
        const life = 1 - p.age / MAX_TRAIL
        const size = Math.max(0.01, p.size * life)

        // Glow outer
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0.01, size * 5))
        grad.addColorStop(0, `rgba(255, 255, 255, ${life * 0.35})`)
        grad.addColorStop(0.4, `rgba(200, 220, 255, ${life * 0.12})`)
        grad.addColorStop(1, `rgba(255, 255, 255, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 5, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Core bright dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, size * 0.9, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${life * 0.9})`
        ctx.fill()
      })

      rafId = requestAnimationFrame(draw)
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseleave", onLeave)
    document.addEventListener("mouseenter", onEnter)
    document.addEventListener("keydown", onKeyDown)
    rafId = requestAnimationFrame(draw)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("mouseenter", onEnter)
      document.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(rafId)
      document.body.classList.remove("cursor-hidden")
    }
  }, [])

  return (
    <>
      {/* Dark dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "var(--text)",
          pointerEvents: "none",
          zIndex: 99999,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s",
          willChange: "transform",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.4)",
        }}
      />

      {/* Trail canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 99998,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.3s",
          mixBlendMode: "normal",
        }}
      />

      <style>{`
        @media (pointer: fine) {
          body.cursor-hidden *, body.cursor-hidden *::before, body.cursor-hidden *::after { cursor: none !important; }
        }
        :focus-visible {
          outline: 2px solid var(--cyan) !important;
          outline-offset: 3px !important;
        }
      `}</style>
    </>
  )
}
