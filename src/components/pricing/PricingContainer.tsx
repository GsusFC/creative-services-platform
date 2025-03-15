'use client';

import { usePricing } from '@/hooks/usePricing';
import { Pricing } from './Pricing';

const PricingContainer = () => {
  // Utilizamos el hook para obtener las configuraciones de animación
  const { animationSettings } = usePricing();
  
  return (
    <Pricing 
      animationSettings={animationSettings}
    />
  );
};

export default PricingContainer;
