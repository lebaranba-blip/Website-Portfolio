"use client"
import { useLanguage } from "@/lib/language-context"

export default function LanguageToggle({ className, dark }: { className?: string; dark?: boolean }) {
  const { lang, toggleLang } = useLanguage()
  const base = dark ? "rgba(255,255,255,0.7)" : "var(--text)"
  const dim = dark ? "rgba(255,255,255,0.3)" : "var(--muted)"

  return (
    <button
      onClick={toggleLang}
      className={`font-mono text-xs font-bold tracking-wider inline-flex items-center gap-1 px-3 py-2 rounded-full transition-colors hover:opacity-80 ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", minHeight: 36 }}
      aria-label={lang === "ru" ? "Switch to English" : "Переключить на русский"}
    >
      <span style={{ color: lang === "ru" ? base : dim }}>RU</span>
      <span style={{ color: dim }}>/</span>
      <span style={{ color: lang === "en" ? base : dim }}>EN</span>
    </button>
  )
}
