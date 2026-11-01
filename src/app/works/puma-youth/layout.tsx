import type { Metadata } from "next"

const TITLE = "PUMA Suede «Молодость» — AI-фильм | Дмитрий Коломиец"
const DESCRIPTION = "Spec-реклама PUMA Suede: AI-фильм 2:08 о молодости, которая не зависит от возраста. Идея, режиссура, AI-продакшн, монтаж и цвет."
const OG = "https://www.hopelessblessed.online/works/puma-youth/og.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/works/puma-youth" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "video.other",
    url: "https://www.hopelessblessed.online/works/puma-youth",
    images: [{ url: OG, width: 1200, height: 630, alt: "Внук и друзья на улице Лос-Анджелеса на закате" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
