'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { keyboardShortcuts } from '@/config/navigation';

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Solo procesar si no hay elementos de formulario activos
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return;
      }

      // Convertir a mayúsculas para comparar con las teclas definidas
      const key = e.key.toUpperCase();

      // Mapeo de teclas a rutas
      switch (key) {
        case 'S':
          router.push('/services');
          break;
        case 'C':
          router.push('/cases');
          break;
        case 'P':
          router.push('/process');
          break;
        case 'A':
          router.push('/admin');
          break;
        case 'F':
          router.push('/flag-system');
          break;
        default:
          // No hacer nada para otras teclas
          break;
      }
    };

    // Añadir el event listener
    document.addEventListener('keydown', handleKeyDown);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  return <>{children}</>;
}
