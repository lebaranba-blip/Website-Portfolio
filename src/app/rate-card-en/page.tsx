import type { Metadata } from "next"
import RateCard from "@/components/RateCard"

export const metadata: Metadata = {
  title: "Rate Card — Dmitry Kolomiets, AI Video Producer",
  description: "Starting rates for AI video, visuals and landing pages.",
  robots: { index: false, follow: false },
}

export default function RateCardEnPage() {
  return <RateCard lang="en" />
}
