import type { Metadata } from "next"

const TITLE = "Gump Donuts — брендинг и AI-видео | Дмитрий Коломиец"
const DESCRIPTION = "Придуманный с нуля бренд пончиков: маскот, упаковка, мокапы, AI-видео."
const OG = "https://www.hopelessblessed.online/works/gump/og.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/works/gump" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.hopelessblessed.online/works/gump",
    images: [{ url: OG, width: 1200, height: 630, alt: "Фургон Gump Donuts летит в космосе" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
