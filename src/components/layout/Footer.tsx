'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useFooter } from '@/hooks/useFooter';
import NavigationSection from './NavigationSection';

const Footer = memo(function Footer() {
  const {
    navigation,
    companyName,
    companyTagline,
    copyrightText,
    a11y,
    getNavigationSectionProps
  } = useFooter();

  return (
    <footer className="bg-black border-t border-[#333333]" aria-label="Pie de página">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Sección de información de la compañía */}
          <div className="space-y-4 xl:col-span-1" aria-labelledby="company-info">
            <h2 id="company-info" className="sr-only">{a11y.companyInfo}</h2>
            <Link
              href="/"
              className="text-2xl text-white hover:text-white/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 rounded px-2 py-1"
              style={{ fontFamily: 'var(--font-druk-text-wide)' }}
              tabIndex={0}
            >
              {companyName}
            </Link>
            <p
              className="text-white/75 max-w-xs"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              {companyTagline}
            </p>
          </div>
          
          {/* Sección de enlaces de navegación */}
          <nav 
            className="mt-6 grid grid-cols-2 gap-6 xl:col-span-2 xl:mt-0"
            aria-label={a11y.footerNav}
          >
            {/* Primera columna: Servicios y Recursos */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <NavigationSection 
                {...getNavigationSectionProps('SERVICES', navigation.services, a11y.servicesSection)} 
              />
              <div className="mt-6 md:mt-0">
                <NavigationSection 
                  {...getNavigationSectionProps('RESOURCES', navigation.resources, a11y.resourcesSection)} 
                />
              </div>
            </div>
            
            {/* Segunda columna: Legal y Contacto */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <NavigationSection 
                {...getNavigationSectionProps('LEGAL', navigation.legal, a11y.legalSection)} 
              />
              <div className="mt-6 md:mt-0">
                <NavigationSection 
                  {...getNavigationSectionProps('CONTACT', navigation.contact, a11y.contactSection)} 
                />
              </div>
            </div>
          </nav>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-400 xl:text-center">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export { Footer };
