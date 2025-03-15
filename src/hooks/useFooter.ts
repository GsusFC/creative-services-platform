import { useMemo } from 'react';
import { footerConfig } from '@/config/footer';
import type { FooterNavigation, NavigationItem } from '@/config/footer';

// Interfaces para los props de los componentes de navegación
export interface NavigationSectionProps {
  title: string;
  items: NavigationItem[];
  ariaLabel: string;
}

interface UseFooterReturn {
  navigation: FooterNavigation;
  companyName: string;
  companyTagline: string;
  currentYear: number;
  copyrightText: string;
  a11y: typeof footerConfig.a11y;
  // En lugar de devolver JSX, devolvemos los props necesarios
  getNavigationSectionProps: (title: string, items: NavigationItem[], ariaLabel: string) => NavigationSectionProps;
}

export const useFooter = (): UseFooterReturn => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const copyrightText = useMemo(() => footerConfig.copyright(currentYear), [currentYear]);
  
  // Función que prepara los props para cada sección de navegación
  const getNavigationSectionProps = (title: string, items: NavigationItem[], ariaLabel: string): NavigationSectionProps => {
    return {
      title,
      items,
      ariaLabel
    };
  };

  return {
    navigation: footerConfig.navigation,
    companyName: footerConfig.companyName,
    companyTagline: footerConfig.companyTagline,
    currentYear,
    copyrightText,
    a11y: footerConfig.a11y,
    getNavigationSectionProps
  };
};
