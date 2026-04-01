import { Briefcase, User, Mail } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

export const TELEGRAM_URL = "https://t.me/hopeless_blessed"

// Единые константы анимации для всего сайта
export const EASE_DEFAULT = [0.16, 1, 0.3, 1] as [number, number, number, number]
export const STAGGER_DEFAULT = 0.07

export interface NavItem {
  icon: LucideIcon | FC
  label: string
  href: string
  sectionId: string
  gradient: string
  iconColor: string
}

// Цвета категорий карточек
export const CATEGORY_COLORS: Record<string, string> = {
  "AI Visual":     "text-cyan-600",
  "Photo & Video": "text-blue-600",
  "Branding":      "text-orange-600",
  "Promo":         "text-cyan-700",
  "Automation":    "opacity-40",
}

export const CATEGORY_HUE: Record<string, number> = {
  "AI Visual":     185,
  "Photo & Video": 215,
  "Branding":      25,
  "Promo":         185,
  "Automation":    215,
}

// Единый список nav-items (hero.tsx + StickyNav.tsx)
export const NAV_ITEMS: NavItem[] = [
  {
    icon: Briefcase,
    label: "Работы",
    href: "#works",
    sectionId: "works",
    gradient: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(109,40,217,0.1) 60%, transparent 80%)",
    iconColor: "text-violet-500",
  },
  {
    icon: User,
    label: "Обо мне",
    href: "#about",
    sectionId: "about",
    gradient: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, rgba(8,145,178,0.1) 60%, transparent 80%)",
    iconColor: "text-cyan-600",
  },
  {
    icon: Mail,
    label: "Контакт",
    href: "#contact",
    sectionId: "contact",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(29,78,216,0.1) 60%, transparent 80%)",
    iconColor: "text-blue-600",
  },
]
