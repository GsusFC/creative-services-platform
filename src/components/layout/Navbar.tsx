'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// Ya no usamos framer-motion para animaciones
import { Tooltip } from './Tooltip';
import NavLinkItem from './NavLinkItem';
import type { NavLink } from '@/hooks/useNavigation';
import type { UseNavigationReturn } from '@/hooks/useNavigation';

interface NavbarProps {
  navLinks: NavLink[];
  rgbGradient: string;
  navState: UseNavigationReturn;
}

const Navbar = memo<NavbarProps>(({ 
  navLinks,
  rgbGradient,
  navState
}) => {
  const {
    isMenuOpen,
    scrolled,
    tooltipVisible,
    tooltipPosition,
    pathname,
    toggleMenu,
    handleLogoClick,
    handleLogoContextMenu,
    handleTooltipEnter,
    handleTooltipLeave,
    isLinkActive,
    a11y,
    styles
  } = navState;

  // Ya hemos extraído el componente NavLinkItem a un archivo separado

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 ${styles.transitions.standard} ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black'}`}
      role="navigation"
      aria-label={a11y.navbar}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: rgbGradient }} />

      <div className="w-full h-[80px] flex items-center justify-between pl-[40px]">
        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center ${styles.spacing.navLinks}`}>
          {navLinks.map((link, index) => (
            <NavLinkItem key={link.href || `dropdown-${index}`} link={link} navState={navState} />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
          aria-label={isMenuOpen ? a11y.mobileMenu.close : a11y.mobileMenu.open}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-sm"
          tabIndex={0}
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all transform ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all transform ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}
          />
        </button>

        {/* Logo */}
        <button
          onClick={handleLogoClick}
          onContextMenu={handleLogoContextMenu}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleLogoClick();
            if (e.key === 'ContextMenu') {
              e.preventDefault();
              // Creamos un evento sintético para el context menu
              const syntheticEvent = { preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>;
              handleLogoContextMenu(syntheticEvent);
            }
          }}
          aria-label={a11y.logo}
          className={`logo-button absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${styles.transitions.transform} ${isMenuOpen ? 'md:scale-100 scale-0' : 'scale-100'} hover:scale-110 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full p-1`}
          tabIndex={0}
        >
          <Image
            src="/assets/icons/logo.svg"
            alt="FLOC Logo"
            width={40}
            height={40}
            priority
            className={`${styles.transitions.transform} hover:scale-110`}
          />
          {tooltipVisible && <Tooltip text={a11y.logoTooltip} x={tooltipPosition.x} y={tooltipPosition.y - 50} />}
        </button>

        {/* El ShortcutsMenu se maneja ahora desde el NavbarContainer */}

        {/* Admin Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className={`hidden md:flex justify-center items-center w-[200px] h-[80px] ${styles.colors.admin.bg} ${styles.text.navLink} ${styles.colors.admin.text} gap-[10px] hover:${styles.colors.admin.hover} ${styles.transitions.standard} hover:tracking-wider focus:outline-none focus:ring-2 focus:ring-white/20`}
            tabIndex={0}
            aria-label={a11y.adminLink}
          >
            ADMIN
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black pt-[80px] z-40 md:hidden"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={a11y.mobileMenu.menu}
          >
            <nav className={`flex flex-col items-center ${styles.spacing.mobileMenu} pt-12`}>
              {navLinks.map((link, index) => 
                link.isDropdown ? (
                  <div
                    key={`dropdown-${index}`}
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
                          className={`${styles.text.navLink} text-white/60 hover:${styles.colors.hover} ${styles.transitions.color}`}
                          onClick={toggleMenu}
                          tabIndex={0}
                          aria-label={`${link.label} ${child.label}`}
                        >
                          {link.label} {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    key={link.href}
                  >
                    <Link 
                      href={link.href || '#'} 
                      className="block text-center py-4" 
                      tabIndex={0}
                      onClick={toggleMenu}
                      aria-current={pathname === link.href ? 'page' : undefined}
                    >
                      <span className={`${styles.text.navLink} ${isLinkActive(link.href, undefined) ? styles.colors.active : styles.colors.hover}`}>{link.label}</span>
                    </Link>
                  </div>
                )
              )}
              <div>
                <Link
                  href="/admin"
                  className={`inline-flex justify-center items-center px-8 py-4 ${styles.colors.admin.bg} ${styles.text.navLink} ${styles.colors.admin.text} gap-[10px] hover:${styles.colors.admin.hover} ${styles.transitions.standard} hover:tracking-wider`}
                  onClick={toggleMenu}
                  tabIndex={0}
                  aria-label={a11y.adminLink}
                >
                  ADMIN
                </Link>
              </div>
            </nav>
          </div>
        )}
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
