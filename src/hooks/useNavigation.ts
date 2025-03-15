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

export interface UseNavigationReturn {
  isMenuOpen: boolean;
  scrolled: boolean;
  shortcutsOpen: boolean;
  tooltipVisible: boolean;
  tooltipPosition: { x: number; y: number };
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});

  // Referencias para los dropdowns
  const dropdownRefs = useRef<Map<string, boolean>>(new Map());
  const dropdownContainerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // State para forzar re-renders cuando cambia el estado del dropdown
  const [, setForceUpdate] = useState(false);
  
  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      dropdownRefs.current.forEach((isOpen, label) => {
        const container = dropdownContainerRefs.current.get(label);
        if (isOpen && container && !container.contains(event.target as Node)) {
          dropdownRefs.current.set(label, false);
          // Forzar re-render
          setForceUpdate(prev => !prev);
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
    dropdownRefs.current.forEach((_, label) => {
      dropdownRefs.current.set(label, false);
    });
    setOpenDropdowns({});
  }, [pathname]);

  // Funciones memorizadas para evitar recreaciones innecesarias
  const handleLogoClick = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleLogoContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShortcutsOpen(!shortcutsOpen);
  }, [shortcutsOpen]);

  const handleTooltipEnter = useCallback((e: React.MouseEvent) => {
    setTooltipVisible(true);
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTooltipLeave = useCallback(() => {
    setTooltipVisible(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleDropdown = useCallback((label: string) => {
    const isDropdownOpen = openDropdowns[label] || dropdownRefs.current.get(label);
    const newState = !isDropdownOpen;
    
    // Actualizar tanto el ref como el estado
    dropdownRefs.current.set(label, newState);
    setOpenDropdowns(prev => ({
      ...prev,
      [label]: newState
    }));
  }, [openDropdowns]);

  const registerDropdownRef = useCallback((label: string, el: HTMLDivElement | null) => {
    if (el) dropdownContainerRefs.current.set(label, el);
  }, []);

  const closeShortcuts = useCallback(() => {
    setShortcutsOpen(false);
  }, []);

  const isLinkActive = useCallback((href?: string, children?: Array<{ href: string; label: string }>) => {
    return href 
      ? pathname === href 
      : (children?.some(child => pathname === child.href) || false);
  }, [pathname]);

  const isDropdownOpen = useCallback((label: string) => {
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
