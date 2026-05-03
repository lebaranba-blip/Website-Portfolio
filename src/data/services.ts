export interface Service {
  num: string
  label: string
  desc: string
}

export const services: Service[] = [
  { num: "01", label: "AI Visual",     desc: "Концепты, рендеры, AI-генерация" },
  { num: "02", label: "Photo & Video", desc: "Фото, видео, монтаж" },
  { num: "03", label: "Branding",      desc: "Логотипы, айдентика, brand kit" },
  { num: "04", label: "Automation",    desc: "Автоматизирую рутину — от лидов до контента" },
]

export const skills = [
  "Midjourney", "Runway", "Figma",
  "CapCut", "Stable Diffusion", "ChatGPT Images",
  "Claude", "Adobe CC", "Freepik Spaces", "Nano banana 2", "Seedance 2.0",
]
