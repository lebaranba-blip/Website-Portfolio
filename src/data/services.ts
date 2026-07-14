export interface Service {
  num: string
  label: string
  desc: string
}

export const services: Service[] = [
  { num: "01", label: "AI Video",         desc: "Кинематографичные ролики, реклама, AI-анимация" },
  { num: "02", label: "Visual Production", desc: "Промпт-инжиниринг, генерация, брендовый визуал" },
  { num: "03", label: "Motion & Editing", desc: "Монтаж, цвет, Remotion-анимация" },
  { num: "04", label: "Branding",         desc: "Айдентика, brand kit, упаковка" },
]

export const skills = [
  "Kling 3.0", "Seedance 2.0", "Veo 3.1",
  "Google Flow", "ChatGPT Images", "Nano Banana 2",
  "DaVinci Resolve", "Remotion", "Figma", "Photoshop",
]
