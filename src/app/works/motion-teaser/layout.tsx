import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Motion Teaser — моушн-дизайн на коде | Дмитрий Коломиец",
  alternates: { canonical: "/works/motion-teaser" },
  description: "Motion design на коде. Remotion + TypeScript. Три видео от концепции до HQ рендера.",
  openGraph: {
    title: "Motion Teaser — моушн-дизайн на коде | Дмитрий Коломиец",
    description: "Motion design на коде. Remotion + TypeScript.",
    type: "website",
    images: [
      {
        url: "https://www.hopelessblessed.online/works/motion-teaser/banner-v2.png",
        width: 1200,
        height: 630,
        alt: "Motion Teaser — Remotion demo reel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.hopelessblessed.online/works/motion-teaser/banner-v2.png"],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
