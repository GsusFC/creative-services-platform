'use client';

export interface Logo {
  src: string;
  alt: string;
  url?: string;
}

export const logosConfig = {
  // Configuración de imágenes
  imageConfig: {
    width: 2160,
    height: 2160,
    className: "h-96 sm:h-[28rem] md:h-[32rem] w-auto opacity-100 transition-duration-300"
  },
  // Configuración de animación
  animationConfig: {
    speed: 60, // segundos para completar un ciclo
    pauseOnHover: true,
    spacing: 'space-x-24 sm:space-x-40'
  },
  // Configuración de accesibilidad
  a11y: {
    sliderRegion: 'Carrusel de logos de empresas colaboradoras',
    pauseButtonLabel: 'Pausar/reanudar animación',
    visitLogo: 'Visitar' // Se concatenará con el nombre del logo
  },
  // Textos y etiquetas
  labels: {
    trustedBy: 'Trusted by industry leaders'
  },
  // Lista de logos
  logosList: [
    { src: '/logos/Amazon.svg', alt: 'Amazon' },
    { src: '/logos/ETH Barcelón.svg', alt: 'ETH Barcelona' },
    { src: '/logos/Forbes.svg', alt: 'Forbes' },
    { src: '/logos/Metafactory.svg', alt: 'Metafactory' },
    { src: '/logos/Polygon.svg', alt: 'Polygon' },
    { src: '/logos/Polygonal Mind.svg', alt: 'Polygonal Mind' },
    { src: '/logos/Rarible.svg', alt: 'Rarible' },
  ]
};
