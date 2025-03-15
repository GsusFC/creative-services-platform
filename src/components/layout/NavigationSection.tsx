'use client';

import { memo } from 'react';
import Link from 'next/link';
import type { NavigationSectionProps } from '@/hooks/useFooter';

const NavigationSection = memo(function NavigationSection({ 
  title, 
  items, 
  ariaLabel 
}: NavigationSectionProps) {
  return (
    <div>
      <h3
        className="text-sm text-white"
        style={{ fontFamily: 'var(--font-druk-text-wide)' }}
        aria-label={ariaLabel}
      >
        {title}
      </h3>
      <ul role="list" className="mt-3 space-y-2" aria-label={`${ariaLabel} enlaces`}>
        {items.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="text-sm text-white/75 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:text-white rounded px-2 py-1"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
              tabIndex={0}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

NavigationSection.displayName = 'NavigationSection';

export default NavigationSection;
