import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gump Donuts — брендинг и AI-видео | Дмитрий Коломиец",
  description: "Придуманный с нуля бренд пончиков: маскот, упаковка, мокапы, AI-видео.",
  openGraph: { title: "Gump Donuts — брендинг и AI-видео | Дмитрий Коломиец", description: "Придуманный с нуля бренд пончиков: маскот, упаковка, мокапы, AI-видео.", type: "website" },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
