import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { navbarA11y, navbarStyles } from '@/config/navigation';

// Tipos para los enlaces de navegación
export interface NavLink {
  href?: string;
  label: string;
  isDropdown?: boolean;
  id?: string;
  children?: Array<{ href: string; label: string }>;
}

interface DropdownState {
  [key: string]: boolean;
}

interface TooltipPosition {
  x: number;
  y: number;
}

export interface UseNavigationReturn {
  isMenuOpen: boolean;
  scrolled: boolean;
  shortcutsOpen: boolean;
  tooltipVisible: boolean;
  tooltipPosition: TooltipPosition;
  pathname: string;
  a11y: typeof navbarA11y;
  styles: typeof navbarStyles;
  toggleMenu: () => void;
  toggleDropdown: (label: string) => void;
  registerDropdownRef: (label: string, el: HTMLDivElement | null) => void;
  handleLogoClick: () => void;
  handleLogoContextMenu: (e: React.MouseEvent) => void;
  handleTooltipEnter: (e: React.MouseEvent) => void;
  handleTooltipLeave: () => void;
  closeShortcuts: () => void;
  isLinkActive: (href?: string, children?: Array<{ href: string; label: string }>) => boolean;
  isDropdownOpen: (label: string) => boolean;
}

export const useNavigation = (_navLinks: NavLink[]): UseNavigationReturn => {
  const pathname = usePathname();
  
  // Estados principales
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [shortcutsOpen, setShortcutsOpen] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ x: 0, y: 0 });
  const [openDropdowns, setOpenDropdowns] = useState<DropdownState>({});

  // Referencias para los dropdowns
  const dropdownRefs = useRef<Map<string, boolean>>(new Map());
  const dropdownContainerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      dropdownRefs.current.forEach((isOpen, label) => {
        const container = dropdownContainerRefs.current.get(label);
        if (isOpen && container && !container.contains(event.target as Node)) {
          dropdownRefs.current.set(label, false);
          
          // Actualizar el estado para reflejar el cambio
          setOpenDropdowns(prev => ({
            ...prev,
            [label]: false
          }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menús al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
    
    // Cerrar todos los dropdowns
    const updatedDropdowns: DropdownState = {};
    
    dropdownRefs.current.forEach((_, label) => {
      dropdownRefs.current.set(label, false);
      updatedDropdowns[label] = false;
    });
    
    setOpenDropdowns(updatedDropdowns);
  }, [pathname]);

  // Funciones memorizadas para evitar recreaciones innecesarias
  const handleLogoClick = useCallback((): void => {
    window.location.href = '/';
  }, []);

  const handleLogoContextMenu = useCallback((e: React.MouseEvent): void => {
    e.preventDefault();
    setShortcutsOpen(prev => !prev);
  }, []);

  const handleTooltipEnter = useCallback((e: React.MouseEvent): void => {
    setTooltipVisible(true);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTooltipLeave = useCallback((): void => {
    setTooltipVisible(false);
  }, []);

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleDropdown = useCallback((label: string): void => {
    const isCurrentlyOpen = openDropdowns[label] || dropdownRefs.current.get(label) || false;
    const newState = !isCurrentlyOpen;
    
    // Actualizar tanto el ref como el estado
    dropdownRefs.current.set(label, newState);
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: newState
    }));
  }, [openDropdowns]);

  const registerDropdownRef = useCallback((label: string, el: HTMLDivElement | null): void => {
    if (el) dropdownContainerRefs.current.set(label, el);
  }, []);

  const closeShortcuts = useCallback((): void => {
    setShortcutsOpen(false);
  }, []);

  const isLinkActive = useCallback((href?: string, children?: Array<{ href: string; label: string }>): boolean => {
    if (href) {
      return pathname === href;
    }
    
    if (children?.length) {
      return children.some(child => pathname === child.href);
    }
    
    return false;
  }, [pathname]);

  const isDropdownOpen = useCallback((label: string): boolean => {
    // Inicializar el estado del dropdown si no existe
    if (!dropdownRefs.current.has(label)) {
      dropdownRefs.current.set(label, false);
    }
    
    return openDropdowns[label] || dropdownRefs.current.get(label) || false;
  }, [openDropdowns]);

  return {
    isMenuOpen,
    scrolled,
    shortcutsOpen,
    tooltipVisible,
    tooltipPosition,
    pathname,
    a11y: navbarA11y,
    styles: navbarStyles,
    toggleMenu,
    toggleDropdown,
    registerDropdownRef,
    handleLogoClick,
    handleLogoContextMenu,
    handleTooltipEnter,
    handleTooltipLeave,
    closeShortcuts,
    isLinkActive,
    isDropdownOpen
  };
};
