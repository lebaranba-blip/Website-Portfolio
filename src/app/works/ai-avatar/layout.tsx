import type { Metadata } from "next"

const TITLE = "AI Avatar — консистентный AI-персонаж | Дмитрий Коломиец"
const DESCRIPTION = "Консистентный AI-персонаж: «паспорт модели» из 5–6 ракурсов."
const OG = "https://www.hopelessblessed.online/works/ai-avatar/og.jpg"

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/works/ai-avatar" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.hopelessblessed.online/works/ai-avatar",
    images: [{ url: OG, width: 1200, height: 630, alt: "AI-модель в красном кардигане и очках" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG] },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
