import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Яндекс Маркет · Медиафасад «Октябрь» — Дмитрий",
  description: "AI-анимация героя для медиафасада кинотеатра «Октябрь». Дни Яндекс Фабрики: 12 секунд, один непрерывный план, эмоции глазами.",
  openGraph: {
    title: "Яндекс Маркет · Медиафасад «Октябрь»",
    description: "AI-анимация героя для медиафасада 3232×288. Seedance, first/last frame, режиссура по таймкодам.",
    type: "website",
    images: [
      {
        url: "https://www.hopelessblessed.online/works/yandex-october/og.jpg",
        width: 1200,
        height: 630,
        alt: "Герой кампании Дней Яндекс Фабрики со стикерами скидок на синем фоне",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.hopelessblessed.online/works/yandex-october/og.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
