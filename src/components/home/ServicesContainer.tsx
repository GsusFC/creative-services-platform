'use client';

import { useServices } from '@/hooks/useServices';
import { Services } from './Services';

const ServicesContainer = () => {
  // Utilizamos el hook para obtener los datos y configuraciones de animación
  const { services, animationSettings } = useServices();
  
  return (
    <Services 
      services={services}
      animationSettings={animationSettings}
    />
  );
};

export default ServicesContainer;
