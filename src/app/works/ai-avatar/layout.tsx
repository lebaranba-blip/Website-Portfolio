import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Avatar — консистентный AI-персонаж | Дмитрий Коломиец",
  description: "Консистентный AI-персонаж: «паспорт модели» из 5–6 ракурсов.",
  openGraph: { title: "AI Avatar — консистентный AI-персонаж | Дмитрий Коломиец", description: "Консистентный AI-персонаж: «паспорт модели» из 5–6 ракурсов.", type: "website" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
