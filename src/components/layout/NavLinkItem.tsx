'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import type { NavLink } from '@/hooks/useNavigation';
import { UseNavigationReturn } from '@/hooks/useNavigation';

interface NavLinkItemProps {
  link: NavLink;
  navState: UseNavigationReturn;
}

const NavLinkItem = memo<NavLinkItemProps>(({ 
  link,
  navState
}) => {
  const { 
    isLinkActive, 
    isDropdownOpen, 
    toggleDropdown, 
    registerDropdownRef,
    styles,
    a11y
  } = navState;

  const { href, label, isDropdown, children, id } = link;
  const isActive = isLinkActive(href, children);
  const dropdownOpen = isDropdown ? isDropdownOpen(label) : false;
  const itemId = id || `dropdown-${label.toLowerCase().replace(/\\s+/g, '-')}`;
  
  if (isDropdown) {
    return (
      <div 
        className="relative group"
        id={itemId}
        ref={(el: HTMLDivElement | null) => registerDropdownRef(label, el)}
      >
        <button
          onClick={() => toggleDropdown(label)}
          onKeyDown={(e) => e.key === 'Enter' && toggleDropdown(label)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          aria-controls={itemId}
          className="flex items-center gap-1 focus:outline-none"
          tabIndex={0}
          aria-label={`${label} ${dropdownOpen ? a11y.dropdown.expanded : a11y.dropdown.collapsed}`}
        >
          <span
            className={`${styles.text.navLink} ${isActive ? styles.colors.active : styles.colors.inactive}`}
          >
            {label}
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-hidden="true"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        {dropdownOpen && (
          <div 
            className="absolute top-full left-0 mt-2 py-2 bg-black border border-white/10 rounded-md min-w-[120px] shadow-xl z-50"
            role="menu"
            aria-labelledby={itemId}
          >
            {children?.map((child) => {
              const isChildActive = isLinkActive(child.href, undefined);
              return (
                <Link 
                  key={child.href} 
                  href={child.href}
                  className="block px-4 py-2 hover:bg-white/5 focus:outline-none"
                  tabIndex={0}
                  aria-current={isChildActive ? 'page' : undefined}
                  role="menuitem"
                >
                  <span 
                    className={`${styles.text.navLink} ${isChildActive ? styles.colors.active : styles.colors.inactive}`}
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
    <Link 
      href={href!} 
      className="relative group focus:outline-none"
      tabIndex={0} 
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`${styles.text.navLink} ${isActive ? styles.colors.active : styles.colors.inactive}`}
      >
        {label}
      </span>
    </Link>
  );
});

NavLinkItem.displayName = 'NavLinkItem';

export default NavLinkItem;
