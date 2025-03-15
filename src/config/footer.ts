export interface NavigationItem {
  name: string;
  href: string;
}

export interface FooterNavigation {
  services: NavigationItem[];
  resources: NavigationItem[];
  legal: NavigationItem[];
  contact: NavigationItem[];
}

export const footerConfig = {
  navigation: {
    services: [
      { name: 'STRATEGY', href: '/services#strategy' },
      { name: 'BRANDING', href: '/services#branding' },
      { name: 'DIGITAL PRODUCT', href: '/services#digital' }
    ],
    resources: [
      { name: 'BRAND GUIDE', href: '/resources/brand-guide' },
      { name: 'DESIGN SYSTEM', href: '/resources/design-system' },
      { name: 'CASE STUDIES', href: '/cases' }
    ],
    legal: [
      { name: 'PRIVACY POLICY', href: '/privacy' },
      { name: 'TERMS & CONDITIONS', href: '/terms' },
      { name: 'COOKIE POLICY', href: '/cookies' }
    ],
    contact: [
      { name: 'BOOK A CALL', href: '/contact' },
      { name: 'HELP CENTER', href: '/help' },
      { name: 'EMAIL', href: 'mailto:hello@floc.design' }
    ]
  },
  a11y: {
    footerNav: 'Navegación principal del pie de página',
    servicesSection: 'Enlaces a servicios',
    resourcesSection: 'Enlaces a recursos',
    legalSection: 'Enlaces a información legal',
    contactSection: 'Enlaces de contacto',
    companyInfo: 'Información de la empresa',
  },
  companyName: 'FLOC*',
  companyTagline: 'STRATEGIC DESIGN FOR THE NEXT GENERATION OF BRANDS',
  copyright: (year: number) => `© ${year} FLOC Design Studio. Todos los derechos reservados.`
};
