import Link from 'next/link'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="relative bg-background text-foreground border-t border-border z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-background font-bold text-sm">O</span>
              </div>
              <span className="font-serif text-base sm:text-xl">Omkar Ceramic</span>
            </div>
            <p className="text-foreground/60 text-xs sm:text-sm leading-relaxed">
              Premium ceramic tiles, marble, and bathroom fixtures for spaces that inspire.
            </p>
          </div>

          {/* Navigation */}
          <div className="min-w-0">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-foreground/50 mb-3 sm:mb-4 font-semibold">Navigation</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Home</Link></li>
              <li><Link href="/products" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Shop</Link></li>
              <li><Link href="/collections" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Collections</Link></li>
              <li><Link href="/calculator" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Calculator</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="min-w-0">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-foreground/50 mb-3 sm:mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link href="/about" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Contact</Link></li>
              <li><Link href="/inspiration" className="text-foreground/80 hover:text-foreground text-xs sm:text-sm transition-colors">Inspiration</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 min-w-0">
            <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-foreground/50 mb-3 sm:mb-4 font-semibold">Get in Touch</h4>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <p className="text-foreground/80 truncate">Pardi, Gujarat 396125</p>
              <a href="tel:+919979091885" className="block text-foreground hover:text-foreground/80 transition-colors truncate">+91 9979091885</a>
              <a href="mailto:omkar_cera@gmail.com" className="block text-foreground hover:text-foreground/80 transition-colors truncate">omkar_cera@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-foreground/20 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-foreground/50">
          <p>© {currentYear} Omkar Ceramic. All rights reserved.</p>
          <div className="flex gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
