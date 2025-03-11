'use client';

import React from 'react';
import DoItYourselfV3App from '@/components/do-it-yourself-v3/DoItYourselfV3App';

export default function DoItYourselfV3Page() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black text-white flex flex-col">
      {/* Sin título ni descripción, y configurado para ocultar el footer */}
      <style jsx global>{`
        footer {
          display: none !important;
        }
      `}</style>
      <div className="container-fluid px-4 py-4 mt-[80px] flex flex-col flex-grow">
        <div className="flex-grow h-full overflow-hidden">
          <DoItYourselfV3App />
        </div>
      </div>
    </main>
  );
}
