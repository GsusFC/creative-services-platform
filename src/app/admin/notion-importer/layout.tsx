'use client';

import { FEATURES } from '@/config/features';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default function NotionImporterLayout({ children }: { children: ReactNode }) {
  if (!FEATURES.notion.enabled || !FEATURES.notion.importer) {
    redirect('/admin/not-available');
  }
  
  return <>{children}</>;
}
