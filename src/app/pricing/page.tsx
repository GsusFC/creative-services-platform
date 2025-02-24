import { Pricing } from '@/components/pricing/Pricing'
import { PriceAdmin } from '@/components/pricing/PriceAdmin'
import { PricingPlans } from '@/components/pricing/PricingPlans'
import { faqs } from '@/lib/plans'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="pt-32 md:pt-40">
        <Pricing />
        <PriceAdmin />

        {/* Planes y FAQs */}
        <div className="container mx-auto px-4 py-24 space-y-32">
          <div>
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl text-white text-center mb-16"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              Choose Your Plan
            </h2>
            <PricingPlans />
          </div>

          {/* FAQs */}
          <div>
            <h2 
              className="text-3xl text-white mb-8 text-center"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
            >
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={faq.question} 
                  value={`faq-${index}`}
                  className="border border-white/20 hover:border-white/40 transition-all duration-300 bg-black"
                >
                  <AccordionTrigger 
                    className="p-6 text-lg text-white"
                    style={{ fontFamily: 'var(--font-druk-text-wide)' }}
                  >
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent 
                    className="px-6 pb-6 text-white/60"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}
                  >
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  )
}
