export interface Work {
  id: string
  title: string
  category: "AI Visual" | "Photo & Video" | "Branding" | "Promo" | "Automation"
  image: string
  alt: string
  year: number
  desc?: string
  featured?: boolean
}

export const works: Work[] = [
  {
    id: "ai-concept-01",
    title: "AI Концепт",
    category: "AI Visual",
    image: "/works/placeholder-ai.svg",
    alt: "AI концепт — генеративная визуализация",
    year: 2025,
    desc: "Генеративная визуализация для продуктового запуска. Midjourney + After Effects.",
    featured: true,
  },
  {
    id: "brand-01",
    title: "Брендинг",
    category: "Branding",
    image: "/works/placeholder-brand.svg",
    alt: "Брендинг — логотип и айдентика",
    year: 2025,
    desc: "Полный brand kit: логотип, типографика, цвета, гайдлайн.",
    featured: true,
  },
  {
    id: "promo-01",
    title: "Промо-кампания",
    category: "Promo",
    image: "/works/placeholder-promo.svg",
    alt: "Промо-кампания — визуальная стратегия",
    year: 2025,
    desc: "Визуальная стратегия и контент для запуска продукта в соцсетях.",
  },
]
