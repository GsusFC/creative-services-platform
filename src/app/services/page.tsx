'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  BrandStrategyIcon,
  BrandingIcon,
  DigitalProductIcon,
  MotionDesignIcon,
  WebDevelopmentIcon,
  UiUxDesignIcon
} from '@/components/services/ServiceIcons'

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const services = [
    {
      title: "BRAND STRATEGY",
      description: "We define your brand's DNA and build a solid strategy to stand out in the market.",
      icon: BrandStrategyIcon,
      color: 'green' as const,
      features: [
        "Market & competitor research",
        "Value proposition development",
        "Strategic positioning",
        "Brand archetypes & personality",
        "Communication strategy",
        "Brand storytelling"
      ]
    },
    {
      title: "BRANDING",
      description: "We create unique visual identities that convey your brand's essence and values.",
      icon: BrandingIcon,
      color: 'red' as const,
      features: [
        "Logo & visual identity design",
        "Design system & guidelines",
        "Typography & color palette",
        "Brand applications",
        "Packaging & print materials",
        "Brand guidelines"
      ]
    },
    {
      title: "DIGITAL PRODUCT",
      description: "We design and develop user-centered digital products focused on results.",
      icon: DigitalProductIcon,
      color: 'blue' as const,
      features: [
        "UX Research & testing",
        "Information architecture",
        "Wireframing & prototyping",
        "Interface design (UI)",
        "Design systems",
        "Frontend & backend development"
      ]
    },
    {
      title: "MOTION DESIGN",
      description: "We bring your brand to life through movement and interactive experiences.",
      icon: MotionDesignIcon,
      color: 'green' as const,
      features: [
        "Brand animation",
        "Motion graphics",
        "Interaction design",
        "Interactive experiences",
        "Corporate videos",
        "Social media content"
      ]
    },
    {
      title: "WEB DEVELOPMENT",
      description: "We build modern, scalable, and high-performance web applications.",
      icon: WebDevelopmentIcon,
      color: 'blue' as const,
      features: [
        "Custom web applications",
        "E-commerce platforms",
        "Content management systems",
        "API development",
        "Performance optimization",
        "Security implementation"
      ]
    },
    {
      title: "UI/UX DESIGN",
      description: "We create intuitive and engaging user experiences that drive results.",
      icon: UiUxDesignIcon,
      color: 'red' as const,
      features: [
        "User research & testing",
        "User journey mapping",
        "Interface design",
        "Interaction design",
        "Usability testing",
        "Design system creation"
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] md:bg-[size:6rem_6rem] opacity-30 pointer-events-none" />

      {/* Header Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-[40px]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-screen-xl mx-auto"
        >
          <h1 
            className="text-[clamp(2rem,4vw,4rem)] leading-[1] tracking-[0.02em] uppercase mb-6" 
            style={{ fontFamily: 'var(--font-druk-text-wide)' }}
          >
            CORE SERVICES
          </h1>
          <p 
            className="text-sm md:text-lg text-white/70 max-w-2xl"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            STRATEGIC SOLUTIONS TO TRANSFORM YOUR DIGITAL PRESENCE
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-[40px] pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
              onMouseEnter={() => setHoveredService(service.title)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="border border-white/10 bg-white/5 backdrop-blur-sm h-full transition-all duration-300 hover:border-[#00ff00]/30 hover:bg-white/10 overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-white/5">
                  {service.icon && <service.icon 
                    className="w-full h-full" 
                    color={service.color}
                    isHovered={hoveredService === service.title}
                  />}
                </div>
                <div className="p-8">
                <h3 
                  className="text-xl md:text-2xl mb-4 text-white"
                  style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                >
                  {service.title}
                </h3>
                <p 
                  className="text-white/70 mb-6 text-sm md:text-base"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="text-white/50 text-sm flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}
                    >
                      <span className="w-1 h-1 bg-[#00ff00] rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
