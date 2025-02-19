import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const clash = localFont({
  src: '../fonts/ClashDisplay-Variable.woff2',
  display: 'swap',
  variable: '--font-clash',
})
