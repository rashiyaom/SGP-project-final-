import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />
      <section className="flex-1 py-10">
        <div className="max-w-3xl mx-auto px-6 sm:px-12">
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-8">Privacy Policy</h1>

          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/80">
            <p className="text-sm leading-relaxed">Last updated: March 2026</p>

            <h2 className="text-lg font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p className="text-sm leading-relaxed">
              When you use Omkar Ceramic, we may collect personal information such as your name, email address, phone number, and shipping address that you voluntarily provide when creating an account, placing an order, or contacting us.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed">
              We use the information we collect to process orders, communicate with you about your purchases, improve our website experience, and send promotional communications if you have opted in.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">3. Data Storage</h2>
            <p className="text-sm leading-relaxed">
              Your data is stored locally on your device using browser localStorage. We do not transmit personal data to external servers. Profile information, cart data, and preferences remain on your device.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">4. Cookies</h2>
            <p className="text-sm leading-relaxed">
              We use essential cookies for theme preferences and session management. No third-party tracking cookies are used.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">5. Your Rights</h2>
            <p className="text-sm leading-relaxed">
              You can delete all your stored data at any time through your Profile → Settings → Delete Account. You may also clear your browser&apos;s localStorage to remove all data.
            </p>

            <h2 className="text-lg font-semibold text-foreground mt-8">6. Contact</h2>
            <p className="text-sm leading-relaxed">
              For any privacy-related questions, contact us at <a href="mailto:omkar_cera@gmail.com" className="text-foreground underline underline-offset-2">omkar_cera@gmail.com</a> or call <a href="tel:+919979091885" className="text-foreground underline underline-offset-2">+91 9979091885</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
