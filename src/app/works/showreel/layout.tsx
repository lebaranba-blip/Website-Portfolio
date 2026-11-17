import type { Metadata } from "next"

const TITLE = "Skills Reel — AI-видео шоурил | Дмитрий Коломиец"
const DESCRIPTION = "Восемь коротких историй: диапазон жанров, света и монтажа на AI-генерации."
const OG = "https://www.hopelessblessed.online/works/showreel/og.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/works/showreel" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.hopelessblessed.online/works/showreel",
    images: [{ url: OG, width: 1200, height: 630, alt: "Кадр из Skills Reel: всадник в свете фар" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
