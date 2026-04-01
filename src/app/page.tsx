import StickyNav from "@/components/StickyNav"
import HeroSection from "@/components/ui/hero"
import InfiniteGrid from "@/components/ui/infinite-grid"
import Works from "@/components/Works"
import About from "@/components/About"
import Footer from "@/components/Footer"
export default function Home() {
  return (
    <>
      <InfiniteGrid />
      <StickyNav />
      <main className="relative z-10">
        <HeroSection />
        <Works />
        <About />
      </main>
      <Footer />
    </>
  )
}
