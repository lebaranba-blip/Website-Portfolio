import type { Metadata, Viewport } from "next";
import { Golos_Text, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const spaceGrotesk = Golos_Text({
  variable: "--font-space-grotesk",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
});

const spaceGroteskDisplay = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Дмитрий Коломиец — AI Video Producer",
  description: "Коммерческое AI-видео и визуал полного цикла: сценарий, промпт-инжиниринг, генерация, монтаж, цвет. Пишите в Telegram.",
  keywords: ["AI Video Producer", "AI видео", "AI Production", "визуал", "брендинг", "портфолио", "Kling", "Veo", "Seedance", "Remotion"],
  authors: [{ name: "Дмитрий Коломиец" }],
  creator: "Дмитрий Коломиец",
  metadataBase: new URL("https://www.hopelessblessed.online"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Дмитрий Коломиец — AI Video Producer",
    description: "Коммерческое AI-видео и визуал полного цикла: сценарий, промпт-инжиниринг, генерация, монтаж, цвет.",
    url: "https://www.hopelessblessed.online",
    siteName: "Дмитрий Коломиец — AI Video Producer",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Дмитрий Коломиец — AI Video Producer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Дмитрий Коломиец — AI Video Producer",
    description: "Коммерческое AI-видео и визуал полного цикла.",
    images: ["/og-banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B0B0D",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий Коломиец",
  url: "https://www.hopelessblessed.online",
  image: "https://www.hopelessblessed.online/about-main.jpg",
  sameAs: [
    "https://www.linkedin.com/in/dmitry-kolomiets-7045a222b/",
    "https://t.me/hopeless_blessed",
    "https://www.instagram.com/kolomiets.ai.prod",
    "https://www.threads.net/@kolomiets.ai.prod",
  ],
  jobTitle: "AI Video Producer",
  description: "Коммерческое AI-видео и визуал полного цикла: сценарий, промпт-инжиниринг, генерация, монтаж, цвет.",
  knowsAbout: ["AI Video Production", "Visual Production", "Motion Design", "Branding", "Kling", "Veo", "Seedance", "Remotion", "DaVinci Resolve"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${spaceGroteskDisplay.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
