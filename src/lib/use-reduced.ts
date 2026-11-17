"use client"
import { useEffect, useState } from "react"

/**
 * prefers-reduced-motion that is always false on the server and on the first
 * client render, so the markup hydrates identically; the real value applies
 * right after mount and follows live changes of the OS setting.
 */
export function useReducedSafe() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])
  return reduced
}
