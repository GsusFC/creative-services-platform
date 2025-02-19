'use client'

import Link from 'next/link'

const navigation = {
  services: [
    { name: 'STRATEGY', href: '/services#strategy' },
    { name: 'BRANDING', href: '/services#branding' },
    { name: 'DIGITAL PRODUCT', href: '/services#digital' },
  ],
  resources: [
    { name: 'BRAND GUIDE', href: '/resources/brand-guide' },
    { name: 'DESIGN SYSTEM', href: '/resources/design-system' },
    { name: 'CASE STUDIES', href: '/cases' },
  ],
  legal: [
    { name: 'PRIVACY POLICY', href: '/privacy' },
    { name: 'TERMS & CONDITIONS', href: '/terms' },
    { name: 'COOKIE POLICY', href: '/cookies' },
  ],
  contact: [
    { name: 'BOOK A CALL', href: '/contact' },
    { name: 'HELP CENTER', href: '/help' },
    { name: 'EMAIL', href: 'mailto:hello@floc.design' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#333333]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <Link 
              href="/" 
              className="text-2xl text-white hover:text-white/90 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              FLOC*
            </Link>
            <p 
              className="text-white/75 max-w-xs"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              STRATEGIC DESIGN FOR THE NEXT GENERATION OF BRANDS
            </p>

          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  SERVICES
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  {navigation.services.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/75 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  RESOURCES
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  {navigation.resources.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/75 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  LEGAL
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/75 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 md:mt-0">
                <h3 
                  className="text-sm text-white"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  CONTACT
                </h3>
                <ul role="list" className="mt-3 space-y-2">
                  {navigation.contact.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-white/75 hover:text-white transition-colors duration-300"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-400 xl:text-center">
            &copy; {new Date().getFullYear()} FLOC Design Studio. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
