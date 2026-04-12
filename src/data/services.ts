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
  { num: "05", label: "Consulting",    desc: "Стратегия, промпт-инжиниринг, AI-стек" },
]

export const skills = [
  "Midjourney", "Runway", "Figma", "n8n",
  "CapCut", "Stable Diffusion", "ChatGPT",
  "Claude", "Adobe CC", "Freepik Spaces", "Nano banana 2", "Seedance 2.0",
]
