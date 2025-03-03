import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import localFont from 'next/font/local'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ToastContextProvider } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/providers/theme-provider'
import DarkModeToggle from '@/components/ui/dark-mode-toggle'

const drukTextWide = localFont({
  src: '../../public/fonts/Druk Text Wide Heavy.woff2',
  variable: '--font-druk-text-wide',
})

const geist = localFont({
  src: '../../public/fonts/Geist-Regular.woff2',
  variable: '--font-geist',
})

const geistMono = localFont({
  src: '../../public/fonts/GeistMono-Regular.woff2',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'FLOC - Strategic Design Studio',
  description: 'Strategic design systems that scale your business. We create impactful digital experiences through strategy, branding and product design.',
  keywords: 'design studio, branding, digital design, web development, creative services, UI/UX, product design',
  authors: [{ name: 'FLOC Studio' }],
  creator: 'FLOC Studio',
  publisher: 'FLOC Studio',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flocstudio.com',
    title: 'FLOC - Strategic Design Studio',
    description: 'Strategic design systems that scale your business. We create impactful digital experiences through strategy, branding and product design.',
    siteName: 'FLOC Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FLOC Studio - Strategic Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLOC - Strategic Design Studio',
    description: 'Strategic design systems that scale your business',
    images: ['/twitter-image.jpg'],
    creator: '@flocstudio',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`antialiased font-sans ${geist.variable} ${geistMono.variable} ${drukTextWide.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastContextProvider>
            <TooltipProvider>
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-black focus:text-white focus:z-50">
                Skip to main content
              </a>
              <Navbar />
              <div className="fixed top-5 right-5 z-50">
                <DarkModeToggle />
              </div>
              <main id="main-content">
                {children}
              </main>
              <Footer />
              <Toaster position="bottom-right" theme="dark" closeButton richColors />
            </TooltipProvider>
          </ToastContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
