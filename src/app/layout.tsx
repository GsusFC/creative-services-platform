import type { Metadata } from 'next'
import '../styles/main.css'
import NavbarContainer from '@/components/layout/NavbarContainer'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Providers } from './providers'
import { inter, drukText, geistMono, robotoMono } from './fonts'

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
      <body className={`antialiased ${inter.variable} ${geistMono.variable} ${drukText.variable} ${robotoMono.variable}`}>
        <Providers>
          <TooltipProvider>
            <NavbarContainer />
            {children}
            <Footer />
            <Toaster position="bottom-right" theme="dark" closeButton richColors />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  )
}
