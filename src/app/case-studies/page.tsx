'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function CaseStudiesRedirect() {
  // Redirige automáticamente a la versión nueva
  useEffect(() => {
    redirect('/cases');
  }, []);

  // Esto nunca se renderizará debido a la redirección,
  // pero es necesario para evitar errores durante la compilación
  return null;
}
