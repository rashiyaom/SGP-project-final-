import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/auth-context'
import { CartProvider } from '@/contexts/cart-context'
import { DreamsProvider } from '@/contexts/dreams-context'
import { AdminProvider } from '@/contexts/admin-context'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Luxe Tiles - Premium Tiles & Home Accessories',
  description: 'Discover luxury tiles, marble, and premium home accessories for your dream space. Expert design consultation, AR visualization, and seamless checkout.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9f7f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1815' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${_geist.variable} ${_geistMono.variable} ${_playfair.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                <DreamsProvider>
                  {children}
                  <MobileBottomNav />
                </DreamsProvider>
              </CartProvider>
            </AdminProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
