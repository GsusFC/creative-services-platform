'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ShortcutsMenu } from './ShortcutsMenu';
import { Tooltip } from './Tooltip';

const navLinks = [
  { href: '/services', label: 'SERVICES' },
  { href: '/cases', label: 'CASES' },
  { href: '/process', label: 'PROCESS' },
  { href: '/pricing', label: 'PRICING' },
  { href: '/game', label: 'GAME' },
  { href: '/flag-system-v3', label: 'FLAGSYSTEM' },
  { href: '/svg', label: 'SVG' },
  { 
    label: 'DO IT YOURSELF', 
    id: 'diy-dropdown',
    isDropdown: true,
    children: [
      { href: '/do-it-yourself', label: 'V1' },
      { href: '/do-it-yourself-v2', label: 'V2' },
      { href: '/do-it-yourself-v3', label: 'V3' }
    ]
  },
  { href: '/firecrawl', label: 'FIRECRAWL' }
];

const rgbGradient = 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(255, 0, 0) 14.12%, rgb(0, 255, 0) 51.80%, rgb(0, 0, 255) 89.37%, rgb(255, 255, 255) 101.35%)';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Referencias para cerrar dropdowns cuando se hace click fuera
  // Referencias para controlar el estado de los dropdowns
  const dropdownRefs = useRef<Map<string, boolean>>(new Map());
  const dropdownContainerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  
  // State para forzar re-renders cuando cambia el estado del dropdown
  const [, setForceUpdate] = useState(false);
  
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

  const NavLink = ({ href, label, isDropdown, children, id }: { 
    href?: string; 
    label: string; 
    isDropdown?: boolean;
    id?: string;
    children?: Array<{ href: string; label: string }>
  }) => {
    const isActive = href ? pathname === href : (children?.some(child => pathname === child.href) || false);
    
    // Inicializar el estado del dropdown si no existe
    if (isDropdown && !dropdownRefs.current.has(label)) {
      dropdownRefs.current.set(label, false);
    }
    
    // Usar tanto el ref como el estado para mayor fiabilidad
    const isDropdownOpen = isDropdown ? (openDropdowns[label] || dropdownRefs.current.get(label)) : false;
    
    const toggleDropdown = () => {
      if (isDropdown) {
        const newState = !isDropdownOpen;
        // Actualizar tanto el ref como el estado
        dropdownRefs.current.set(label, newState);
        setOpenDropdowns(prev => ({
          ...prev,
          [label]: newState
        }));
      }
    };
    
    if (isDropdown) {
      return (
        <div 
          className="relative group"
          id={id || `dropdown-${label.toLowerCase().replace(/\s+/g, '-')}`}
          ref={(el: HTMLDivElement | null) => {
            if (el) dropdownContainerRefs.current.set(label, el);
          }}
        >
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-1 focus:outline-none"
          >
            <span
              className={`text-[13px] font-medium font-mono uppercase transition-colors duration-300 ${isActive ? 'text-[#00ff00]' : 'text-white/75 group-hover:text-white'}`}
            >
              {label}
            </span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="10" 
              height="6" 
              viewBox="0 0 10 6" 
              fill="none" 
              className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 py-2 bg-black border border-white/10 rounded-md min-w-[120px] shadow-xl z-50">
              {children?.map((child) => {
                const isChildActive = pathname === child.href;
                return (
                  <Link 
                    key={child.href} 
                    href={child.href}
                    className="block px-4 py-2 hover:bg-white/5"
                  >
                    <span 
                      className={`text-[13px] font-medium font-mono uppercase transition-colors duration-300 ${isChildActive ? 'text-[#00ff00]' : 'text-white/75 hover:text-white'}`}
                    >
                      {child.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <Link href={href!} className="relative group">
        <span
          className={`text-[13px] font-medium font-mono uppercase transition-colors duration-300 ${isActive ? 'text-[#00ff00]' : 'text-white/75 group-hover:text-white'}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: rgbGradient }} />

      <div className="w-full h-[80px] flex items-center justify-between pl-[40px]">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link, index) => (
            <NavLink key={link.href || `dropdown-${index}`} {...link} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5"
        >
          <motion.span
            animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
          <motion.span
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
          <motion.span
            animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
            className="w-6 h-0.5 bg-white transition-colors"
          />
        </button>

        {/* Logo */}
        <button
          onClick={() => window.location.href = '/'}
          onContextMenu={(e) => {
            e.preventDefault();
            setShortcutsOpen(!shortcutsOpen);
          }}
          onMouseEnter={(e) => {
            setTooltipVisible(true);
            setTooltipPosition({ x: e.clientX, y: e.clientY });
          }}
          onMouseLeave={() => {
            setTooltipVisible(false);
          }}
          className={`logo-button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${isMenuOpen ? 'md:scale-100 scale-0' : 'scale-100'} hover:scale-110 hover:bg-white/10`}
        >
          <Image
            src="/assets/icons/logo.svg"
            alt="FLOC Logo"
            width={40}
            height={40}
            priority
            className="transition-transform duration-300 hover:scale-110"
          />
          {tooltipVisible && <Tooltip text="Click for shortcuts" x={tooltipPosition.x} y={tooltipPosition.y - 50} />}
        </button>

        <AnimatePresence>
          <ShortcutsMenu
            isOpen={shortcutsOpen}
            onClose={() => setShortcutsOpen(false)}
          />
        </AnimatePresence>

        {/* Admin Button y Settings */}
        <div className="flex items-center gap-4">
          <Link
            href="/settings"
            className="hidden md:flex items-center text-[13px] font-medium text-white/75 hover:text-white font-mono uppercase transition-colors duration-300"
          >
            SETTINGS
          </Link>
          <Link
            href="/admin"
            className="hidden md:flex justify-center items-center w-[200px] h-[80px] bg-[#00ff00] text-[13px] font-medium text-black font-mono uppercase gap-[10px] hover:bg-[#00ff00]/90 transition-all duration-300 hover:tracking-wider"
          >
            ADMIN
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black pt-[80px] z-40 md:hidden"
          >
            <nav className="flex flex-col items-center gap-8 pt-12">
              {navLinks.map((link, index) => 
                link.isDropdown ? (
                  <motion.div
                    key={`dropdown-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <span className="text-[13px] font-medium font-mono uppercase text-white/75">
                      {link.label}
                    </span>
                    <div className="flex flex-col items-center gap-4 mt-2">
                      {link.children?.map(child => (
                        <Link 
                          key={child.href} 
                          href={child.href}
                          className="text-[13px] font-medium font-mono uppercase text-white/60 hover:text-white transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.label} {child.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NavLink {...link} />
                  </motion.div>
                )
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Link
                  href="/admin"
                  className="inline-flex justify-center items-center px-8 py-4 bg-[#00ff00] text-[13px] font-medium text-black font-mono uppercase gap-[10px] hover:bg-[#00ff00]/90 transition-all duration-300 hover:tracking-wider"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ADMIN
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
