import { Pricing } from '@/components/pricing/Pricing'
import { PriceAdmin } from '@/components/pricing/PriceAdmin'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="pt-[120px]">
        <Pricing />
        <PriceAdmin />
      </div>
    </main>
  )
}
