import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Valter · Хук на автобане — Дмитрий",
  description: "UGC-ролик для рынка Великобритании: AI-герой с character sheet, сцены в Seedance 2.5, lower third на Remotion.",  openGraph: {
    title: "Valter · Хук на автобане",
    description: "Вертикальный UGC-ролик на 45 секунд. Персонаж, сценарий, генерация и моушн — без съёмок.",
    type: "website",
    images: [
      {
        url: "https://www.hopelessblessed.online/works/valter/og.jpg",
        width: 1200,
        height: 630,
        alt: "Артур в поло Valter на обочине британского автобана",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.hopelessblessed.online/works/valter/og.jpg"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
