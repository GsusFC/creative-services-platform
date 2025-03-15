// Configuración de enlaces de navegación para toda la aplicación
import type { NavLink } from '@/hooks/useNavigation';

// Enlaces de navegación principales
export const mainNavLinks: NavLink[] = [
  { href: '/services', label: 'SERVICES' },
  { href: '/cases', label: 'CASES' },
  { href: '/process', label: 'PROCESS' },
  { href: '/pricing', label: 'PRICING' },
  { href: '/packs', label: 'PACKS' },
  { href: '/do-it-yourself', label: 'DO IT YOURSELF' }
];

// Constante del gradiente RGB para la barra de navegación
export const navbarGradient = 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(255, 0, 0) 14.12%, rgb(0, 255, 0) 51.80%, rgb(0, 0, 255) 89.37%, rgb(255, 255, 255) 101.35%)';

// Atajos de teclado que se mostrarán en el menú de atajos
export const keyboardShortcuts = [
  { key: 'ESC', description: 'Cerrar menús/modals' },
  { key: 'S', description: 'Ir a servicios' },
  { key: 'C', description: 'Ir a casos' },
  { key: 'P', description: 'Ir a procesos' },
  { key: 'A', description: 'Ir a admin' }
];

// Configuración de accesibilidad para la navegación
export const navbarA11y = {
  // Etiquetas y descripciones generales
  navbar: 'Navegación principal',
  logo: 'Ir a página principal',
  logoTooltip: 'Click para atajos',
  adminLink: 'Ir a panel de administración',
  // Menú móvil
  mobileMenu: {
    open: 'Abrir menú',
    close: 'Cerrar menú',
    menu: 'Menú de navegación móvil'
  },
  // Dropdown
  dropdown: {
    expanded: 'Expandido',
    collapsed: 'Colapsado'
  }
};

// Configuración de estilos y clases para la navegación
export const navbarStyles = {
  // Colores principales
  colors: {
    active: 'text-[#00ff00]',
    inactive: 'text-white/75',
    hover: 'text-white',
    admin: {
      bg: 'bg-[#00ff00]',
      text: 'text-black',
      hover: 'bg-[#00ff00]/90'
    }
  },
  // Clases para tipografía
  text: {
    navLink: 'text-[13px] font-medium font-mono uppercase'
  },
  // Transiciones
  transitions: {
    standard: 'transition-all duration-300',
    color: 'transition-colors duration-300',
    transform: 'transition-transform duration-300'
  },
  // Espaciado
  spacing: {
    navLinks: 'gap-6',
    mobileMenu: 'gap-8'
  }
};
