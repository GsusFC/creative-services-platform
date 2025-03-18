'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Tooltip } from './Tooltip';
import type { UseNavigationReturn } from '@/hooks/useNavigation';

interface NavbarLogoProps {
  isMenuOpen: boolean;
  navState: UseNavigationReturn;
}

const NavbarLogo = memo<NavbarLogoProps>(({
  isMenuOpen,
  navState
}) => {
  const {
    tooltipVisible,
    tooltipPosition,
    handleLogoClick,
    handleLogoContextMenu,
    handleTooltipEnter,
    handleTooltipLeave,
    a11y
  } = navState;

  return (
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
      className={`logo-button ${isMenuOpen ? 'md:opacity-100 opacity-0' : 'opacity-100'} focus:outline-none rounded-full p-0 m-0 flex items-center justify-center`}
      tabIndex={0}
    >
      <Image
        src="/assets/icons/logo.svg"
        alt="FLOC Logo"
        width={40}
        height={40}
        priority
        className="m-0 p-0"
      />
      {tooltipVisible && <Tooltip text={a11y.logoTooltip} x={tooltipPosition.x} y={tooltipPosition.y - 50} />}
    </button>
  );
});

NavbarLogo.displayName = 'NavbarLogo';

export default NavbarLogo;
