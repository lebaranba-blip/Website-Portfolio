"use client"
import { useRef, useCallback, ReactNode } from "react"

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
}

export default function MagneticWrapper({ children, strength = 0.4 }: MagneticWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)

  const applyOffset = useCallback((clientX: number, clientY: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = wrapperRef.current
    const inner = innerRef.current
    if (!el || !inner) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (clientX - cx) * strength
    const dy = (clientY - cy) * strength

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.style.transform = `translate(${dx}px, ${dy}px)`
      inner.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`
    })
  }, [strength])

  const resetOffset = useCallback(() => {
    const el = wrapperRef.current
    const inner = innerRef.current
    if (!el || !inner) return

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
    inner.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
    el.style.transform = "translate(0px, 0px)"
    inner.style.transform = "translate(0px, 0px)"

    const onEnd = () => {
      el.style.transition = ""
      inner.style.transition = ""
    }
    el.addEventListener("transitionend", onEnd, { once: true })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    applyOffset(e.clientX, e.clientY)
  }, [applyOffset])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    if (touch) applyOffset(touch.clientX, touch.clientY)
  }, [applyOffset])

  const handleMouseEnter = useCallback(() => {
    const el = wrapperRef.current
    if (el) el.style.transition = ""
  }, [])

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetOffset}
      onMouseEnter={handleMouseEnter}
      onTouchMove={handleTouchMove}
      onTouchEnd={resetOffset}
      style={{ display: "inline-block" }}
    >
      <div ref={innerRef} style={{ display: "inline-block" }}>
        {children}
      </div>
    </div>
  )
}
