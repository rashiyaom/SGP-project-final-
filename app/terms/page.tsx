import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-8">Terms of Service</h1>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/80">
            <p className="text-sm leading-relaxed">Last updated: March 2026</p>

            <h2 className="text-lg font-semibold text-foreground mt-8">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">
              By accessing and using the Omkar Ceramic website, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">2. Products & Pricing</h2>
            <p className="text-sm leading-relaxed">
              All product prices are listed in Indian Rupees (₹) and are subject to change without notice. Prices shown are per square foot unless otherwise stated. We reserve the right to correct any pricing errors.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">3. Orders & Availability</h2>
            <p className="text-sm leading-relaxed">
              Product availability is subject to stock levels. We reserve the right to limit quantities or refuse any order. Custom orders may have different lead times and terms.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">4. Shipping & Delivery</h2>
            <p className="text-sm leading-relaxed">
              Delivery times vary by location. Free shipping is available on orders above ₹5,000. Tile products are fragile — we take utmost care in packaging, but damage during transit should be reported within 48 hours of delivery.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">5. Returns & Refunds</h2>
            <p className="text-sm leading-relaxed">
              Unused and undamaged products may be returned within 7 days of delivery. Custom-cut or made-to-order items are non-returnable. Refunds are processed within 7–10 business days.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">6. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">
              Omkar Ceramic shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our liability is limited to the purchase price of the products.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">7. Contact</h2>
            <p className="text-sm leading-relaxed">
              Questions about these terms? Contact us at <a href="mailto:omkar_cera@gmail.com" className="text-foreground underline underline-offset-2">omkar_cera@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
