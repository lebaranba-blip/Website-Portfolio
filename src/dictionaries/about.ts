export const aboutDict = {
  ru: {
    eyebrowLabel: "Обо мне",
    name: "Дмитрий",
    role: "AI Video · Visual Production",
    bio: [
      "AI Video Producer. Строю AI-видео и визуал с нуля — сценарий, промпт-инжиниринг, генерация, монтаж, цвет.",
      "Начинал с видеомонтажа, потом веб-дизайн, графика, бренд-айдентика. Два года назад полностью перешёл на AI-продакшн. Самоучка — кино, режиссуру и операторскую работу разбирал по фильмам, не по курсам.",
      "Генерация: Kling, Seedance, Veo, Google Flow, ChatGPT Images, Nano Banana.\nМонтаж и цвет: DaVinci Resolve, Remotion, Figma.",
      "AI — не способ сделать картинку красивой, а инструмент полноценного продакшна. Использую его на каждом этапе, а не вместо мастерства.",
    ],
    ctaContact: "Перейти к контакту",
    services: {
      "01": { label: "AI Video", desc: "Кинематографичные ролики, реклама, AI-анимация" },
      "02": { label: "Visual Production", desc: "Промпт-инжиниринг, генерация, брендовый визуал" },
      "03": { label: "Motion & Editing", desc: "Монтаж, цвет, Remotion-анимация" },
      "04": { label: "Branding", desc: "Айдентика, brand kit, упаковка" },
    } as Record<string, { label: string; desc: string }>,
    toolsHeading: "Инструменты",
  },
  en: {
    eyebrowLabel: "About",
    name: "Dmitry",
    role: "AI Video · Visual Production",
    bio: [
      "AI Video Producer. I build AI video and visuals from scratch — script, prompt engineering, generation, edit, color.",
      "Started in video editing, then web design, graphics, brand identity. Moved fully into AI production two years ago. Self-taught — I studied film, direction, and cinematography from films, not courses.",
      "Generation: Kling, Seedance, Veo, Google Flow, ChatGPT Images, Nano Banana.\nEdit and color: DaVinci Resolve, Remotion, Figma.",
      "AI isn't a way to make an image look nice — it's a tool for a full production. I use it at every stage, not instead of craft.",
    ],
    ctaContact: "Go to contact",
    services: {
      "01": { label: "AI Video", desc: "Cinematic clips, ads, AI animation" },
      "02": { label: "Visual Production", desc: "Prompt engineering, generation, brand visuals" },
      "03": { label: "Motion & Editing", desc: "Editing, color, Remotion animation" },
      "04": { label: "Branding", desc: "Identity, brand kit, packaging" },
    } as Record<string, { label: string; desc: string }>,
    toolsHeading: "Tools",
  },
} as const
