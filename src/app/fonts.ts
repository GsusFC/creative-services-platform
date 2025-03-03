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

// En vez de usar la fuente local con una ruta que podría no ser correcta,
// vamos a quitar esta configuración y usar directamente className="font-mono"
// que es la clase por defecto para fuentes monoespaciadas en Tailwind
