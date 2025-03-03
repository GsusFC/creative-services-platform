'use client';

import React from 'react';
import FlagGenerator from '@/components/flag-system/FlagGenerator';
import { PageHeader } from '@/components/layout/PageHeader';

export default function FlagSystemPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-[120px] pb-[80px]">
      <PageHeader 
        title="FLAG SYSTEM"
        description="Generador de palabras con banderas náuticas"
      />
      
      <div className="container mx-auto px-4 py-12">
        <FlagGenerator />
      </div>
    </main>
  );
}
