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
  description: "AI-визуал, автоматизация и брендинг для бизнеса. Делаю сложное красиво.",
  keywords: ["AI визуал", "автоматизация", "брендинг", "дизайн"],
  openGraph: {
    title: "Дмитрий — AI & Design",
    description: "AI-визуал, автоматизация и брендинг для бизнеса.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#EDEAE4",
  colorScheme: "light",
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
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
