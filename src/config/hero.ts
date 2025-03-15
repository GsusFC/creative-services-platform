export interface HeroConfig {
  tagline: {
    mobile: string;
    desktop: string;
  };
  headline: {
    mobile: string;
    desktop: string;
  };
  scroll: {
    text: string;
    ariaLabel: string;
  };
  video: {
    src: string;
    fallbackText: string;
  };
  a11y: {
    heroSectionLabel: string;
    videoSectionLabel: string;
  };
}

export const heroConfig: HeroConfig = {
  tagline: {
    mobile: 'STRATEGIC DESIGN STUDIO',
    desktop: 'STRATEGIC DESIGN STUDIO'
  },
  headline: {
    mobile: 'CRAFTING TOMORROW\'S\nICONIC BRANDS',
    desktop: 'DESIGNING THE NEXT\nBRANDS TOGETHER'
  },
  scroll: {
    text: 'SCROLL',
    ariaLabel: 'Desplázate hacia abajo para ver más contenido'
  },
  video: {
    src: '/video.mp4',
    fallbackText: 'Tu navegador no soporta el tag de video.'
  },
  a11y: {
    heroSectionLabel: 'Sección principal - Creative Services Platform',
    videoSectionLabel: 'Animación de fondo'
  }
};
