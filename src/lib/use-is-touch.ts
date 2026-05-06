"use client"
import { useState } from "react"

// Initialised synchronously — no re-render flash
export function useIsTouch() {
  const [isTouch] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches
  )
  return isTouch
}
