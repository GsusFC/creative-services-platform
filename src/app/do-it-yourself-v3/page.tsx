'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function DoItYourselfV3Page() {
  // Redirige automáticamente a la nueva versión 
  useEffect(() => {
    redirect('/do-it-yourself');
  }, []);

  // Esto nunca se renderizará debido a la redirección,
  // pero es necesario para evitar errores durante la compilación
  return null;
}
