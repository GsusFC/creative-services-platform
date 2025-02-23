import { Pricing } from '@/components/pricing/Pricing'
import { PriceAdmin } from '@/components/pricing/PriceAdmin'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="pt-32 md:pt-40">
        <Pricing />
        <PriceAdmin />
      </div>
    </main>
  )
}
