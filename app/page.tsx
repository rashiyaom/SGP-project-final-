import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturedProducts } from '@/components/featured-products'
import { StyleCollections } from '@/components/style-collections'
import { WhyChooseUs } from '@/components/why-choose-us'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <StyleCollections />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
