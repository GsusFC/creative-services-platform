'use client';

import React, { memo } from 'react';
import type { UseNavigationReturn } from '@/hooks/useNavigation';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  onToggle: () => void;
  a11y: UseNavigationReturn['a11y'];
}

const MobileMenuButton = memo<MobileMenuButtonProps>(({
  isMenuOpen,
  onToggle,
  a11y
}) => {
  return (
    <button
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      aria-label={isMenuOpen ? a11y.mobileMenu.close : a11y.mobileMenu.open}
      aria-expanded={isMenuOpen}
      aria-controls="mobile-menu"
      className="md:hidden relative z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
      tabIndex={0}
    >
      <span
        style={{ width: '1.5rem', height: '0.125rem', backgroundColor: 'white', transform: isMenuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }}
      />
      <span
        style={{ width: '1.5rem', height: '0.125rem', backgroundColor: 'white', opacity: isMenuOpen ? 0 : 1 }}
      />
      <span
        style={{ width: '1.5rem', height: '0.125rem', backgroundColor: 'white', transform: isMenuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }}
      />
    </button>
  );
});

MobileMenuButton.displayName = 'MobileMenuButton';

export default MobileMenuButton;
