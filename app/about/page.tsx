'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl text-foreground mb-4">
              About Luxe Tiles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're passionate about bringing premium tiles and luxury design to discerning homeowners and professionals worldwide.
            </p>
          </div>

          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="font-serif text-3xl text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2008, Luxe Tiles began with a simple mission: to provide access to the world's finest tiles and home accessories at competitive prices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Over 15 years, we've built relationships with premium suppliers across Italy, Spain, and around the world, curating collections that inspire and transform spaces.
              </p>
            </div>

            <div className="h-80 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center text-8xl">
              🏛️
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Quality First',
                  description: 'Every product is hand-selected and tested for durability and beauty.',
                  icon: '⭐',
                },
                {
                  title: 'Customer Focused',
                  description: 'Your satisfaction is our priority. We listen and adapt.',
                  icon: '👥',
                },
                {
                  title: 'Sustainability',
                  description: 'We partner with suppliers committed to ethical and sustainable practices.',
                  icon: '🌱',
                },
              ].map((value, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">15+</p>
                <p className="text-muted-foreground">Years in Business</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">10K+</p>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">500+</p>
                <p className="text-muted-foreground">Premium Products</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">50+</p>
                <p className="text-muted-foreground">Countries Served</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl text-foreground mb-8 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Sarah Johnson', role: 'Founder & CEO', emoji: '👩‍💼' },
                { name: 'Marco Rossi', role: 'Head of Design', emoji: '👨‍🎨' },
                { name: 'Lisa Chen', role: 'Customer Success', emoji: '👩‍💻' },
                { name: 'Antonio Silva', role: 'Operations', emoji: '👨‍⚙️' },
              ].map((member, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">{member.emoji}</div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="font-serif text-3xl text-foreground mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start exploring our collections or book a design consultation with our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Shop Now
                </Button>
              </Link>
              <Link href="/booking">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 bg-transparent"
                >
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
