'use client';

import React, { memo, useCallback } from 'react';
import NavLinkItem from './NavLinkItem';
import MobileMenu from './MobileMenu';
import NavbarLogo from './NavbarLogo';
import MobileMenuButton from './MobileMenuButton';
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
    toggleMenu,
    a11y,
    styles
  } = navState;

  const handleMenuToggle = useCallback(() => {
    toggleMenu();
  }, [toggleMenu]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 no-transitions ${scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-black'}`}
      role="navigation"
      aria-label={a11y.navbar}
    >
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: rgbGradient }} />

      {/* Simple navbar with fixed positioning */}
      <div className="h-[80px] relative">
        {/* Left side navigation */}
        <div className="absolute left-[40px] top-0 h-full flex items-center">
          {/* Desktop Navigation - Left Side */}
          <nav className={`hidden md:flex items-center ${styles.spacing.navLinks}`}>
            {navLinks.slice(0, 4).map((link, index) => (
              <NavLinkItem 
                key={link.href || `dropdown-${index}`} 
                link={link} 
                navState={navState} 
              />
            ))}
          </nav>
          
          {/* Mobile Menu Button - Only visible on mobile */}
          <div className="md:hidden">
            <MobileMenuButton 
              isMenuOpen={isMenuOpen} 
              onToggle={handleMenuToggle} 
              a11y={a11y} 
            />
          </div>
        </div>
        
        {/* Logo - Fixed position in exact center */}
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <NavbarLogo 
              isMenuOpen={isMenuOpen} 
              navState={navState} 
            />
          </div>
        </div>
        
        {/* Right side navigation */}
        <div className="absolute right-[40px] top-0 h-full flex items-center">
          {/* Desktop Navigation - Right Side */}
          <nav className={`hidden md:flex items-center ${styles.spacing.navLinks}`}>
            {navLinks.slice(4).map((link, index) => (
              <NavLinkItem 
                key={link.href || `dropdown-${index}`} 
                link={link} 
                navState={navState} 
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        navLinks={navLinks} 
        navState={navState} 
        onClose={handleMenuToggle} 
      />
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
