import type { Metadata } from "next"
import RateCard from "@/components/RateCard"

export const metadata: Metadata = {
  title: "Прайс-лист — Дмитрий Коломиец, AI Director & Visual Artist",
  description: "Стартовые цены на AI-видео, визуал и лендинги.",
  robots: { index: false, follow: false },
}

export default function RateCardRuPage() {
  return <RateCard lang="ru" />
}
