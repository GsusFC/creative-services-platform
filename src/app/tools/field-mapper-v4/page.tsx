'use client';

import FieldMapperV4 from '@/components/field-mapper-v4/client/FieldMapperV4';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function FieldMapperV4Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra de navegación */}
      <div className="bg-gray-900 text-white p-4 flex items-center">
        <Link 
          href="/admin" 
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Volver a Admin</span>
        </Link>
        <h1 className="text-xl font-bold mx-auto">Field Mapper V4</h1>
      </div>
      
      {/* Contenedor principal para el Field Mapper */}
      <div className="flex-1 flex">
        <FieldMapperV4 />
      </div>
    </div>
  );
}
