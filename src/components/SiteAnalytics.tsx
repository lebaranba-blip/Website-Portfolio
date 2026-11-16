"use client"
import { useEffect } from "react"
import { Analytics, track } from "@vercel/analytics/react"

/**
 * Vercel Analytics plus one "contact" event for every click on a Telegram,
 * email or WhatsApp link — with the section it came from, so the dashboard
 * shows which block actually brings messages.
 */
export default function SiteAnalytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a")
      const href = a?.getAttribute("href") ?? ""
      const channel = href.startsWith("mailto:") ? "email"
        : href.includes("t.me/") ? "telegram"
        : href.includes("wa.me/") || href.includes("whatsapp") ? "whatsapp"
        : href.endsWith(".pdf") ? "pdf"
        : null
      if (!channel || !a) return
      const place = a.closest("section[id], footer, nav, header")
      track("contact", {
        channel,
        place: place?.id || place?.tagName.toLowerCase() || "unknown",
        page: window.location.pathname,
      })
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  // Dev would pull a debug script from va.vercel-scripts.com, which the CSP blocks
  return process.env.NODE_ENV === "production" ? <Analytics /> : null
}
