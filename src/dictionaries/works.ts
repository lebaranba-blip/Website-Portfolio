import { pumaYouthDict } from "@/dictionaries/puma-youth"

// Per-language card title, line and tags for cases whose card text is translated
type CardText = { title: string; cat: string; pills: readonly string[] }
const card = (c: { title: string; subtitle: string; tags: readonly string[] }): CardText => ({ title: c.title, cat: c.subtitle, pills: c.tags })

export const worksDict = {
  ru: {
    eyebrow: "— 02 Работы",
    heading1: "Избранные",
    heading2: "проекты",
    viewCase: "Смотреть кейс",
    items: {
      "gump-donuts": "Придуманный с нуля бренд пончиков. Маскот, упаковка, мокапы фургона и фартука, AI-видео кейс.",
      "yandex-october": "Медиафасад кинотеатра «Октябрь» для Дней Яндекс Фабрики. Оживил героя кампании: 12 секунд одним планом, эмоции глазами.",
      "valter": "UGC-ролик для рынка Великобритании. Придумал героя с character sheet, сгенерировал все сцены, сделал lower third на Remotion.",
      "motion-teaser": "Кинетическая типографика + icon animation. Remotion + Claude Code. Полный цикл: концепт → анимация → HQ MP4 рендер.",
      "ai-avatar": "Консистентный AI-персонаж: «паспорт модели» из 5–6 ракурсов. Решает проблему плывущего лица.",
      "showreel": "Семь коротких историй — диапазон жанров, света и монтажа на AI-генерации.",
    } as Record<string, string>,
    cards: {
      "puma-youth": card(pumaYouthDict.ru.card),
    } as Record<string, CardText>,
  },
  en: {
    eyebrow: "— 02 Work",
    heading1: "Selected",
    heading2: "work",
    viewCase: "View case",
    items: {
      "gump-donuts": "A donut brand invented from scratch. Mascot, packaging, van and apron mockups, AI video case.",
      "yandex-october": "Media facade on Moscow's October cinema for Yandex Factory Days. I animated the campaign hero: one 12-second take, all acting in the eyes.",
      "valter": "A UGC ad for the UK market. I created a presenter with a character sheet, generated every scene and built a Remotion lower third.",
      "motion-teaser": "Kinetic typography + icon animation. Remotion + Claude Code. Full cycle: concept → animation → HQ MP4 render.",
      "ai-avatar": "Consistent AI character: a 5–6 angle “model passport.” Solves the drifting-face problem.",
      "showreel": "Seven short stories — a range of genres, light and editing, all AI-generated.",
    } as Record<string, string>,
    cards: {
      "puma-youth": card(pumaYouthDict.en.card),
    } as Record<string, CardText>,
  },
} as const
