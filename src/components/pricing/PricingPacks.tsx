'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Definición de los packs
const pricingPacks = [
  {
    id: 'basic',
    name: 'PACK BASIC',
    description: 'Ideal para startups y pequeñas empresas',
    price: '1,499€',
    features: [
      'Identidad visual básica',
      'Logotipo principal',
      '3 variaciones de logotipo',
      'Paleta de colores',
      'Tipografía principal',
      'Manual de marca básico',
      'Entrega en 7 días hábiles'
    ],
    cta: 'Contratar Pack Basic'
  },
  {
    id: 'standard',
    name: 'PACK STANDARD',
    description: 'Para empresas en crecimiento',
    price: '2,999€',
    isPopular: true,
    features: [
      'Identidad visual completa',
      'Logotipo principal',
      '5 variaciones de logotipo',
      'Paleta de colores extendida',
      'Sistema tipográfico completo',
      'Manual de marca detallado',
      'Papelería básica (tarjetas, membrete)',
      'Plantillas para redes sociales',
      'Entrega en 14 días hábiles'
    ],
    cta: 'Contratar Pack Standard'
  },
  {
    id: 'premium',
    name: 'PACK PREMIUM',
    description: 'Solución integral para empresas establecidas',
    price: '4,999€',
    features: [
      'Sistema de identidad visual completo',
      'Logotipo principal y secundario',
      'Sistema de iconografía personalizado',
      'Paleta de colores extendida con aplicaciones',
      'Sistema tipográfico completo con jerarquías',
      'Manual de marca exhaustivo',
      'Papelería corporativa completa',
      'Kit de marketing digital (banners, redes sociales)',
      'Presentación de marca animada',
      'Entrega en 21 días hábiles',
      'Soporte post-entrega (30 días)'
    ],
    cta: 'Contratar Pack Premium'
  }
]

export function PricingPacks() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 
          className="text-4xl sm:text-5xl md:text-6xl text-white text-center mb-16"
          style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          data-component-name="druk-heading"
        >
          Packs de Branding
        </h2>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {pricingPacks.map((pack) => (
            <motion.div
              key={pack.id}
              id={pack.id}
              className={`
                relative h-full bg-black border transition-all duration-300
                ${pack.isPopular ? 'border-[#00ff00]' : 'border-white/20 hover:border-white/40'}
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              {pack.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff00] text-black px-3 py-1 text-xs uppercase tracking-wider font-mono">
                  Recomendado
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                    data-component-name="druk-heading"
                  >
                    {pack.name}
                  </h3>
                  <p 
                    className="text-white/60 text-sm mb-4"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {pack.description}
                  </p>
                  <div className="text-4xl text-white font-bold mb-2">
                    {pack.price}
                  </div>
                  <p className="text-white/60 text-xs">Pago único</p>
                </div>

                <div className="space-y-4 mb-8">
                  {pack.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="text-[#00ff00] mr-2">✓</div>
                      <div className="text-white text-sm">{feature}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button 
                    asChild
                    className="w-full bg-white hover:bg-white/90 text-black font-medium py-6"
                  >
                    <Link href={`/contact?pack=${pack.id}`}>
                      {pack.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
