'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPricePerCredit, setPricePerCredit, getCurrency, setCurrency, currencies, type Currency, getVolumeDiscounts, setVolumeDiscounts, type VolumeDiscount } from '@/lib/pricing'

export function PriceAdmin() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [price, setPrice] = useState(getPricePerCredit())
  const [selectedCurrency, setSelectedCurrency] = useState(getCurrency())
  const [tempPrice, setTempPrice] = useState(price.toString())
  const [discounts, setDiscounts] = useState<VolumeDiscount[]>(getVolumeDiscounts())
  const [editingDiscount, setEditingDiscount] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
    setDiscounts(getVolumeDiscounts())
  }, [])

  useEffect(() => {
    // Update the form when the price changes
    if (mounted) {
      setTempPrice(price.toString())
    }
  }, [price, mounted])

  if (!mounted) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newPrice = parseFloat(tempPrice)
    if (!isNaN(newPrice) && newPrice > 0) {
      setPricePerCredit(newPrice)
      setCurrency(selectedCurrency)
      setVolumeDiscounts(discounts)
      setPrice(newPrice)
      setIsOpen(false)
      // Reload the page to update all components
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black border border-white/20 text-white px-4 py-2 text-sm font-mono"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        ADMIN
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full right-0 mb-2 bg-black border border-white/20 p-4 w-[300px]"
        >
          <h3 className="text-white font-mono text-sm mb-4">PRICING SETTINGS</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-white/60">
                PRICE PER CREDIT
              </label>
              <input
                type="number"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full bg-black border border-white/20 text-white px-3 py-2 font-mono"
                placeholder="Enter price per credit"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-white/60">
                CURRENCY
              </label>
              <select
                value={selectedCurrency.code}
                onChange={(e) => {
                  const currency = currencies.find(c => c.code === e.target.value)
                  if (currency) setSelectedCurrency(currency)
                }}
                className="w-full bg-black border border-white/20 text-white px-3 py-2 font-mono"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-sm font-mono text-white/60 mb-2 block">
                  VOLUME DISCOUNTS
                </label>
                <div className="space-y-2">
                  {discounts.map((discount, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="number"
                        value={discount.minCredits}
                        onChange={(e) => {
                          const newDiscounts = [...discounts]
                          newDiscounts[index] = { ...discount, minCredits: parseInt(e.target.value) }
                          setDiscounts(newDiscounts)
                        }}
                        className="w-24 bg-black border border-white/20 text-white px-3 py-2 font-mono"
                        placeholder="Min Credits"
                      />
                      <span className="text-white/60">+</span>
                      <input
                        type="number"
                        value={discount.discountPercentage}
                        onChange={(e) => {
                          const newDiscounts = [...discounts]
                          newDiscounts[index] = { ...discount, discountPercentage: parseInt(e.target.value) }
                          setDiscounts(newDiscounts)
                        }}
                        className="w-20 bg-black border border-white/20 text-white px-3 py-2 font-mono"
                        placeholder="Discount %"
                      />
                      <span className="text-white/60">%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-mono text-white/60 hover:text-white"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-mono bg-[#00ff00] text-black hover:bg-[#00ff00]/90"
              >
                SAVE
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  )
}
