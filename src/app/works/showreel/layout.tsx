import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Skills Reel — AI-видео шоурил | Дмитрий Коломиец",
  description: "Восемь коротких историй: диапазон жанров, света и монтажа на AI-генерации.",
  openGraph: { title: "Skills Reel — AI-видео шоурил | Дмитрий Коломиец", description: "Восемь коротких историй: диапазон жанров, света и монтажа на AI-генерации.", type: "website" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
