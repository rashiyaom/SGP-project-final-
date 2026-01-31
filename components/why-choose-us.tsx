'use client'

import { AnimatedSection } from './animated-section'

const features = [
  { title: 'Premium Quality', description: 'International standards with certifications' },
  { title: 'Fast Delivery', description: 'Quick shipping with real-time tracking' },
  { title: 'Expert Support', description: 'Dedicated design consultants available' },
  { title: '15-Year Warranty', description: 'Hassle-free returns guaranteed' },
]

export function WhyChooseUs() {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 bg-background border-t border-border z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left - Heading */}
          <AnimatedSection animation="fade-up">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">Why Us</p>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-foreground mb-4 sm:mb-6">
              The <span className="italic">difference</span> is in the details.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              Every thriving space is based on the symbiosis of a refined strategy and remarkable 
              visual aesthetic. We do both. Every thriving experience is based on the symbiosis 
              of quality and design.
            </p>
          </AnimatedSection>

          {/* Right - Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <h3 className="font-medium text-foreground text-sm sm:text-base mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{feature.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
