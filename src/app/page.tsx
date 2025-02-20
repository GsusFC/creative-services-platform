import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { CaseStudies } from '@/components/home/CaseStudies'
import { Pricing } from '@/components/pricing/Pricing'
import LogoSlider from '@/components/home/LogoSlider'

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <LogoSlider />
      <Services />
      <CaseStudies />
      <Pricing />
    </main>
  )
}
