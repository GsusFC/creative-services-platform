import HeroContainer from '@/components/home/HeroContainer'
import ServicesContainer from '@/components/home/ServicesContainer'
// import CaseStudiesContainer from '@/components/home/CaseStudiesContainer' // Eliminado
import PricingContainer from '@/components/pricing/PricingContainer'
import LogoSliderContainer from '@/components/home/LogoSliderContainer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FLOC | Strategic Design Studio',
  description: 'Designing the next brands together. A strategic design studio focused on creating innovative digital experiences.',
  keywords: 'design studio, branding, digital design, web development, creative services',
}

export default function Home() {
  return (
    <main className="relative bg-black">
      <HeroContainer />
      <LogoSliderContainer />
      <ServicesContainer />
      {/* <CaseStudiesContainer /> // Eliminado */}
      <PricingContainer />
    </main>
  )
}
