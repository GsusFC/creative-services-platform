'use client'

import React from 'react';
import { FlagHistoryProvider } from '../../contexts/FlagHistoryContext';
import FlagSystem from '../../components/flag-system/FlagSystem';

export default function FlagSystemV3Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4 md:p-8 pt-32">
      <div className="pt-32">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-druk tracking-wider mb-4">FLAG SYSTEM V3</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            International nautical alphabet visualization system.
            Create words and display them with their corresponding signal flags.
          </p>
        </header>
      </div>

      <FlagHistoryProvider>
        <FlagSystem />
      </FlagHistoryProvider>
    </div>
  );
}
