'use client';

import React from 'react';
import DoItYourselfV3App from '@/components/do-it-yourself-v3/DoItYourselfV3App';

export default function DoItYourselfV3Page() {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col">
      {/* Sin título ni descripción, y configurado para ocultar el footer */}
      <style jsx global>{`
        footer {
          display: none !important;
        }
        body {
          overflow-x: hidden;
        }
      `}</style>
      <div className="container-fluid px-4 py-4 mt-[80px] flex flex-col">
        <div className="min-h-[600px]">
          <DoItYourselfV3App />
        </div>
      </div>
    </main>
  );
}
