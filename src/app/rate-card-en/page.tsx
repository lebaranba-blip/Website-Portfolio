import type { Metadata } from "next"
import RateCard from "@/components/RateCard"

export const metadata: Metadata = {
  title: "Rate Card — Dmitry Kolomiets, AI Director & Visual Artist",
  description: "Starting rates for AI video, visuals and landing pages.",
  robots: { index: false, follow: false },
}

export default function RateCardEnPage() {
  return <RateCard lang="en" />
}
