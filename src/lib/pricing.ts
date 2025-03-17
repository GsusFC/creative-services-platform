export type Currency = {
  symbol: string;
  code: string;
  name: string;
  locale: string;
}

export type VolumeDiscount = {
  minCredits: number;
  discountPercentage: number;
}

const DEFAULT_DISCOUNTS: VolumeDiscount[] = [
  { minCredits: 40, discountPercentage: 0 },
  { minCredits: 80, discountPercentage: 5 },
  { minCredits: 120, discountPercentage: 10 },
  { minCredits: 160, discountPercentage: 15 },
  { minCredits: 200, discountPercentage: 20 },
];

export const getVolumeDiscounts = (): VolumeDiscount[] => {
  if (typeof window === 'undefined') return DEFAULT_DISCOUNTS;
  const stored = window.localStorage.getItem('volumeDiscounts');
  if (stored === null || stored === '') return DEFAULT_DISCOUNTS;
  
  try {
    const parsed: unknown = JSON.parse(stored);
    
    // Verificar que parsed es un array
    if (!Array.isArray(parsed)) return DEFAULT_DISCOUNTS;
    
    // Verificar que cada elemento tiene la estructura correcta de VolumeDiscount
    const isValidDiscountArray = parsed.every((item: unknown) => {
      if (typeof item !== 'object' || item === null) return false;
      
      // Usamos type guard para verificar la estructura
      const discount = item as Record<string, unknown>;
      
      return 'minCredits' in discount && 
             typeof discount['minCredits'] === 'number' &&
             'discountPercentage' in discount &&
             typeof discount['discountPercentage'] === 'number';
    });
    
    if (isValidDiscountArray) {
      // Ahora podemos hacer una conversión segura
      return parsed.map((item: Record<string, unknown>) => ({
        minCredits: Number(item['minCredits']),
        discountPercentage: Number(item['discountPercentage'])
      }));
    }
  } catch (e) {
    console.error('Error al parsear descuentos por volumen:', e);
  }
  
  return DEFAULT_DISCOUNTS;
}

export const setVolumeDiscounts = (discounts: VolumeDiscount[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('volumeDiscounts', JSON.stringify(discounts));
}

export const getDiscountForCredits = (credits: number): number => {
  const discounts = getVolumeDiscounts();
  const discount = [...discounts]
    .reverse()
    .find(d => credits >= d.minCredits);
  return discount?.discountPercentage ?? 0;
}

// Definimos las monedas disponibles en el sistema
export const currencies: Currency[] = [
  { symbol: '€', code: 'EUR', name: 'Euro', locale: 'de-DE' },
  { symbol: '$', code: 'USD', name: 'US Dollar', locale: 'en-US' },
  { symbol: '£', code: 'GBP', name: 'British Pound', locale: 'en-GB' },
];

// Moneda por defecto para casos donde no haya ninguna moneda disponible
const FALLBACK_CURRENCY: Currency = {
  symbol: '€',
  code: 'EUR',
  name: 'Euro',
  locale: 'de-DE'
};

// Default values
const DEFAULT_PRICE = 50;

// Obtenemos la primera moneda del array o usamos la moneda de respaldo si el array está vacío
const getDefaultCurrency = (): Currency => {
  // Verificamos si hay monedas disponibles
  if (currencies.length === 0) {
    return FALLBACK_CURRENCY;
  }
  
  // En este punto sabemos que hay al menos una moneda
  const firstCurrency = currencies[0];
  
  // Verificamos explícitamente que la moneda no sea null o undefined
  if (firstCurrency === null || firstCurrency === undefined) {
    return FALLBACK_CURRENCY;
  }
  
  // Creamos un nuevo objeto Currency para evitar problemas de referencia
  return {
    symbol: firstCurrency.symbol,
    code: firstCurrency.code,
    name: firstCurrency.name,
    locale: firstCurrency.locale
  };
};

// Aseguramos que DEFAULT_CURRENCY siempre sea de tipo Currency
const DEFAULT_CURRENCY: Currency = getDefaultCurrency();

let currentPrice = DEFAULT_PRICE;

// Inicializamos currentCurrency con una copia de DEFAULT_CURRENCY
let currentCurrency: Currency = {
  symbol: DEFAULT_CURRENCY.symbol,
  code: DEFAULT_CURRENCY.code,
  name: DEFAULT_CURRENCY.name,
  locale: DEFAULT_CURRENCY.locale
};

export const getPricePerCredit = (): number => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('pricePerCredit');
    if (stored !== null && stored !== '') {
      const parsedValue = parseFloat(stored);
      if (!isNaN(parsedValue)) {
        currentPrice = parsedValue;
      }
    }
  }
  return currentPrice;
}

export const setPricePerCredit = (price: number): void => {
  currentPrice = price;
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('pricePerCredit', price.toString());
  }
}

/**
 * Obtiene la moneda actual configurada en el sistema.
 * Si no hay una moneda válida almacenada, devuelve la moneda por defecto.
 */
/**
 * Verifica si un valor tiene la estructura de Currency.
 * @param value - El valor a verificar
 * @returns true si el valor es de tipo Currency, false en caso contrario
 */
const isCurrency = (value: unknown): value is Currency => {
  // Verificamos que value no sea null o undefined y que sea un objeto
  if (value === null || value === undefined || typeof value !== 'object') return false;
  
  // Convertimos a Record para acceder a las propiedades de forma segura
  const obj = value as Record<string, unknown>;
  
  // Verificamos que tenga todas las propiedades requeridas con los tipos correctos
  return 'symbol' in obj && typeof obj['symbol'] === 'string' &&
         'code' in obj && typeof obj['code'] === 'string' &&
         'name' in obj && typeof obj['name'] === 'string' &&
         'locale' in obj && typeof obj['locale'] === 'string';
};

export const getCurrency = (): Currency => {
  // Usamos la función getDefaultCurrency para obtener una moneda válida
  const defaultCurrency: Currency = getDefaultCurrency();

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('currency');
    if (stored !== null && stored !== '') {
      try {
        // Tipamos parsed como unknown para manejar de forma segura
        const parsed: unknown = JSON.parse(stored);
        
        // Verificamos si parsed tiene la estructura de Currency
        if (isCurrency(parsed)) {
          // Ahora TypeScript sabe que parsed es de tipo Currency
          // Creamos un nuevo objeto Currency con los valores del objeto parseado
          const validCurrency: Currency = {
            symbol: parsed.symbol,
            code: parsed.code,
            name: parsed.name,
            locale: parsed.locale
          };
          
          // Asignamos el objeto validado a currentCurrency
          currentCurrency = validCurrency;
          return validCurrency;
        }
      } catch (e) {
        // Si hay un error al parsear, usamos el valor por defecto
        console.error('Error al parsear la moneda almacenada:', e);
      }
    }
  }
  
  // Asegurarnos de que currentCurrency es válido
  if (!isCurrency(currentCurrency)) {
    // Si no es válido, actualizamos currentCurrency y devolvemos la moneda por defecto
    currentCurrency = defaultCurrency;
    return defaultCurrency;
  }
  
  // En este punto, TypeScript sabe que currentCurrency es de tipo Currency
  return {
    symbol: currentCurrency.symbol,
    code: currentCurrency.code,
    name: currentCurrency.name,
    locale: currentCurrency.locale
  };
}

/**
 * Establece la moneda actual en el sistema y la guarda en localStorage.
 */
export const setCurrency = (currency: Currency): void => {
  // Creamos una copia explícita para asegurar que todas las propiedades están presentes
  currentCurrency = {
    symbol: currency.symbol,
    code: currency.code,
    name: currency.name,
    locale: currency.locale
  };
  
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('currency', JSON.stringify(currentCurrency));
  }
}
