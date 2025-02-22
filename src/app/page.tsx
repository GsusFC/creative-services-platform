import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { CaseStudies } from '@/components/home/CaseStudies'
import { Pricing } from '@/components/pricing/Pricing'
import LogoSlider from '@/components/home/LogoSlider'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FLOC | Strategic Design Studio',
  description: 'Designing the next brands together. A strategic design studio focused on creating innovative digital experiences.',
  keywords: 'design studio, branding, digital design, web development, creative services',
}

export default function Home() {
  return (
    <main className="relative bg-black">
      <Hero />
      <LogoSlider />
      <Services />
      <CaseStudies />
      <Pricing />
    </main>
  )
}
