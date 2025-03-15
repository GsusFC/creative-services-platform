'use client';

import React, { memo } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import Navbar from './Navbar';
import { ShortcutsMenu } from './ShortcutsMenu';
import { AnimatePresence } from 'framer-motion';
import { mainNavLinks, navbarGradient } from '@/config/navigation';

const NavbarContainer: React.FC = () => {
  // Utilizamos nuestro hook personalizado para manejar toda la lógica
  const navState = useNavigation(mainNavLinks);

  return (
    <>
      <Navbar 
        navLinks={mainNavLinks}
        rgbGradient={navbarGradient}
        navState={navState}
      />
      
      <AnimatePresence>
        <ShortcutsMenu
          isOpen={navState.shortcutsOpen}
          onClose={navState.closeShortcuts}
        />
      </AnimatePresence>
    </>
  );
};

export default memo(NavbarContainer);
