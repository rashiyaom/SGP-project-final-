import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturedProducts } from '@/components/featured-products'
import { InspirationsGallery } from '@/components/inspirations-gallery'
import { StyleCollections } from '@/components/style-collections'
import { CalculatorSection } from '@/components/calculator-section'
import { WhyChooseUs } from '@/components/why-choose-us'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <StyleCollections />
      <CalculatorSection />
      <InspirationsGallery />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
