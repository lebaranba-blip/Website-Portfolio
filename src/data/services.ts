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
  "Midjourney", "Runway", "After Effects", "Figma", "n8n",
  "Make", "CapCut", "Stable Diffusion", "Synthesia", "ChatGPT",
  "Claude", "Replicator", "Comfy UI", "Procreate", "Adobe CC",
]
