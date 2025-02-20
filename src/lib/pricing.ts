export type Currency = {
  symbol: string
  code: string
  name: string
  locale: string
}

export type VolumeDiscount = {
  minCredits: number
  discountPercentage: number
}

const DEFAULT_DISCOUNTS: VolumeDiscount[] = [
  { minCredits: 40, discountPercentage: 0 },
  { minCredits: 80, discountPercentage: 5 },
  { minCredits: 120, discountPercentage: 10 },
  { minCredits: 160, discountPercentage: 15 },
  { minCredits: 200, discountPercentage: 20 },
]

export const getVolumeDiscounts = (): VolumeDiscount[] => {
  if (typeof window === 'undefined') return DEFAULT_DISCOUNTS
  const stored = window.localStorage.getItem('volumeDiscounts')
  return stored ? JSON.parse(stored) : DEFAULT_DISCOUNTS
}

export const setVolumeDiscounts = (discounts: VolumeDiscount[]) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem('volumeDiscounts', JSON.stringify(discounts))
}

export const getDiscountForCredits = (credits: number): number => {
  const discounts = getVolumeDiscounts()
  const discount = [...discounts]
    .reverse()
    .find(d => credits >= d.minCredits)
  return discount?.discountPercentage || 0
}

export const currencies: Currency[] = [
  { symbol: '€', code: 'EUR', name: 'Euro', locale: 'de-DE' },
  { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' },
  { symbol: '£', code: 'GBP', name: 'British Pound', locale: 'en-GB' },
]

// Default values
const DEFAULT_PRICE = 50
const DEFAULT_CURRENCY = currencies[0]

let currentPrice = DEFAULT_PRICE
let currentCurrency = DEFAULT_CURRENCY

export const getPricePerCredit = () => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('pricePerCredit')
    if (stored) {
      currentPrice = parseFloat(stored)
    }
  }
  return currentPrice
}

export const setPricePerCredit = (price: number) => {
  currentPrice = price
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('pricePerCredit', price.toString())
  }
}

export const getCurrency = (): Currency => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('currency')
    if (stored) {
      currentCurrency = JSON.parse(stored)
    }
  }
  return currentCurrency
}

export const setCurrency = (currency: Currency) => {
  currentCurrency = currency
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('currency', JSON.stringify(currency))
  }
}
