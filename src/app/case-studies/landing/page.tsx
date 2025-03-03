 'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CaseStudyLandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redireccionar a la nueva ruta
    router.replace('/cases');
  }, [router]);

  // Renderizar un componente vacío mientras se realiza la redirección
  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-500">Redireccionando...</p>
    </div>
  );
}
