import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="text-xl"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        >
          FLOC
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/services" className="text-sm hover:text-primary uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Servicios
          </Link>
          <Link href="/cases" className="text-sm hover:text-primary uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Casos
          </Link>
          <Link href="/pricing" className="text-sm hover:text-primary uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            Precios
          </Link>
          <Button asChild>
            <Link href="/contact" style={{ fontFamily: 'var(--font-geist-mono)' }} className="uppercase">Empezar</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
