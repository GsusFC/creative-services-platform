'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/hooks/useNavigation';
import type { UseNavigationReturn } from '@/hooks/useNavigation';

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  navState: UseNavigationReturn;
  onClose: () => void;
}

const MobileMenu = memo<MobileMenuProps>(({
  isOpen,
  navLinks,
  navState,
  onClose
}) => {
  if (!isOpen) return null;

  const {
    isLinkActive,
    pathname,
    a11y,
    styles
  } = navState;

  return (
    <div
      className="fixed inset-0 bg-black pt-[80px] z-40 md:hidden"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={a11y.mobileMenu.menu}
    >
      <nav className={`flex flex-col items-center ${styles.spacing.mobileMenu} pt-12`}>
        {/* Sección izquierda */}
        <div className="w-full px-6 mb-8">
          <h3 className="text-[13px] font-medium font-mono uppercase text-white/50 mb-4 text-center">Navegación</h3>
          <div className="flex flex-col items-center gap-6">
            {navLinks.slice(0, 4).map((link, index) => 
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
                        className={`${styles.text.navLink} text-white/60`}
                        onClick={onClose}
                        tabIndex={0}
                        aria-label={`${link.label} ${child.label}`}
                      >
                        {child.label}
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
                    className="block text-center py-2" 
                    tabIndex={0}
                    onClick={onClose}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    <span className={`${styles.text.navLink} ${isLinkActive(link.href, undefined) ? styles.colors.active : styles.colors.inactive}`}>{link.label}</span>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
        
        {/* Sección derecha */}
        <div className="w-full px-6">
          <h3 className="text-[13px] font-medium font-mono uppercase text-white/50 mb-4 text-center">Sistemas</h3>
          <div className="flex flex-col items-center gap-6">
            {navLinks.slice(4).map((link, index) => 
              link.isDropdown ? (
                <div
                  key={`dropdown-${index}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex flex-col items-center gap-4 mt-2">
                    {link.children?.map(child => (
                      <Link 
                        key={child.href} 
                        href={child.href}
                        className={`${styles.text.navLink} text-white/60`}
                        onClick={onClose}
                        tabIndex={0}
                        aria-label={child.label}
                      >
                        {child.label}
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
                    className="block text-center py-2" 
                    tabIndex={0}
                    onClick={onClose}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    <span className={`${styles.text.navLink} ${isLinkActive(link.href, undefined) ? styles.colors.active : styles.colors.inactive}`}>{link.label}</span>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </nav>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
