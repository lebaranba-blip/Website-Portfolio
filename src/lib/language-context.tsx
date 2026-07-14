"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type Lang = "ru" | "en"

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  toggleLang: () => void
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: "ru",
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang")
      if (stored === "ru" || stored === "en") setLangState(stored)
    } catch {}
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem("lang", l) } catch {}
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "ru" ? "en" : "ru"
      try { localStorage.setItem("lang", next) } catch {}
      return next
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useDict<T extends { ru: unknown; en: unknown }>(dict: T): T["ru"] {
  const { lang } = useLanguage()
  return dict[lang] as T["ru"]
}
