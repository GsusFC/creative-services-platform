import { Inter, Roboto_Mono } from 'next/font/google'
import localFont from 'next/font/local'

// Fuente principal Inter (sans-serif)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Fuente monoespaciada para código y detalles técnicos
export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

// Fuente para títulos y encabezados
export const drukText = localFont({
  src: [
    {
      path: '../../public/fonts/Druk Text Wide Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-druk-text-wide',
})

// Fuente para texto monoespaciado personalizado
export const geistMono = localFont({
  src: [
    {
      path: '../../public/fonts/GeistMono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-geist-mono',
})
