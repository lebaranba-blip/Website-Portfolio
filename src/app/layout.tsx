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
  title: "Дмитрий — AI & Design",
  description: "AI-визуал, автоматизация и брендинг для бизнеса. 50+ проектов, 3+ года опыта. Пишите в Telegram.",
  keywords: ["AI визуал", "автоматизация", "брендинг", "дизайн", "портфолио", "Midjourney", "Kling", "нейросети"],
  authors: [{ name: "Дмитрий" }],
  creator: "Дмитрий",
  metadataBase: new URL("https://website-portfolio-y48s.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Дмитрий — AI & Design",
    description: "AI-визуал, автоматизация и брендинг для бизнеса. 50+ проектов, 3+ года опыта.",
    url: "https://website-portfolio-y48s.vercel.app",
    siteName: "Дмитрий — AI & Design",
    type: "website",
    locale: "ru_RU",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Дмитрий — AI & Design",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Дмитрий — AI & Design",
    description: "AI-визуал, автоматизация и брендинг для бизнеса.",
    images: ["/opengraph-image"],
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
  themeColor: "#EDEAE4",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Дмитрий",
  url: "https://website-portfolio-y48s.vercel.app",
  sameAs: ["https://t.me/hopeless_blessed"],
  jobTitle: "AI Designer & Automation Specialist",
  description: "AI-визуал, автоматизация и брендинг для бизнеса.",
  knowsAbout: ["AI Visual", "Branding", "Automation", "Midjourney", "Kling", "n8n", "Figma"],
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
