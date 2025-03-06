import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from './providers'

const drukTextWide = localFont({
  src: '../../public/fonts/Druk Text Wide Heavy.woff2',
  variable: '--font-druk-text-wide',
})

const geistMono = localFont({
  src: '../../public/fonts/GeistMono-Regular.woff2',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'FLOC - Strategic Design Studio',
  description: 'Strategic design systems that scale your business. We create impactful digital experiences through strategy, branding and product design.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${geistMono.variable} ${drukTextWide.variable}`}>
        <Providers>
          <TooltipProvider>
            <Navbar />
            {children}
            <Footer />
            <Toaster position="bottom-right" theme="dark" closeButton richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
