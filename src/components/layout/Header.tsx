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
          <Link href="/services" className="text-sm font-medium hover:text-primary">
            Servicios
          </Link>
          <Link href="/cases" className="text-sm font-medium hover:text-primary">
            Casos
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Precios
          </Link>
          <Button asChild>
            <Link href="/contact">Empezar</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
