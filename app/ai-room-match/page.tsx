'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AIRoomMatchPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6 sm:px-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl text-foreground mb-4">
              AI Room Style Match
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a photo of your space and our AI will recommend the perfect tiles and accessories for your style.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <div className="text-8xl mb-6">🤖</div>
            <h2 className="font-serif text-3xl text-foreground mb-2">
              AI-Powered Recommendations
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Our advanced AI analyzes your room&apos;s style, colors, and design to suggest tiles that match perfectly.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mb-8">
              Coming Soon - Get Notified
            </Button>

            <p className="text-sm text-muted-foreground">
              Currently in development. Explore our inspiration gallery or tools in the meantime.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-foreground mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Upload Photo', description: 'Take a photo of your room or space' },
                { step: '2', title: 'AI Analysis', description: 'Our AI analyzes style and colors' },
                { step: '3', title: 'Get Recommendations', description: 'Receive perfect tile matches' },
              ].map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-accent mb-2">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/inspiration">
              <Button
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
              >
                Explore Inspiration Gallery
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
