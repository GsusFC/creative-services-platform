'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CaseStudy } from '@/types/case-study';
import EditCaseStudyForm from './EditCaseStudyForm';
// Comentamos la importación de la función que ya no se exporta
// import { updateCaseStudy } from '@/app/admin/case-studies/actions';
import { toast } from 'sonner';

interface EditCaseStudyFormWrapperProps {
  caseStudy: CaseStudy;
}

export default function EditCaseStudyFormWrapper({ caseStudy }: EditCaseStudyFormWrapperProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleSaveAction = async (updatedStudy: CaseStudy) => {
    setIsSaving(true);
    setErrorMessage(null);
    
    // Comentamos la lógica que usaba updateCaseStudy para evitar errores
    /*
    try {
      // // Intentamos actualizar el caso de estudio
      // await updateCaseStudy(updatedStudy);
      
      // // Guardamos también en localStorage como respaldo
      // saveToLocalStorage(updatedStudy);
      
      // // Mostramos mensaje de éxito
      // toast.success('Caso de estudio guardado correctamente');
      
      // // Redirigimos a la lista de casos de estudio
      // router.push('/admin/case-studies');

      // Placeholder temporal: Simula un guardado local y muestra advertencia
      console.warn("La funcionalidad de guardar/sincronizar está deshabilitada temporalmente.");
      saveToLocalStorage(updatedStudy); // Guardar localmente
      const errorMsg = "La sincronización con Notion está deshabilitada temporalmente.";
      setErrorMessage(errorMsg);
      toast.warning(
        'Se guardaron los cambios localmente, pero la sincronización con Notion está deshabilitada. ' +
        'Los cambios estarán disponibles en tu navegador.'
      );
      // No redirigimos para que el usuario vea el mensaje

    } catch (error) {
      // Este bloque catch probablemente no se ejecutará con la lógica comentada,
      // pero lo dejamos por si se descomenta en el futuro.
      console.error('Error al guardar el caso de estudio:', error);
      
      // Guardamos en localStorage como respaldo
      saveToLocalStorage(updatedStudy);
      
      // Mostramos mensaje de advertencia
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setErrorMessage(errorMsg);
      
      toast.warning(
        'Se guardaron los cambios localmente, pero hubo un error. ' +
        'Los cambios estarán disponibles en tu navegador.'
      );
    } finally {
      setIsSaving(false);
    }
    */
    // Código ejecutado al estar la funcionalidad comentada:
    console.warn("La funcionalidad de guardar/sincronizar está deshabilitada temporalmente.");
    saveToLocalStorage(updatedStudy); // Guardar localmente de todas formas
    const errorMsg = "La sincronización con Notion está deshabilitada temporalmente.";
    setErrorMessage(errorMsg);
    toast.warning(
      'Se guardaron los cambios localmente, pero la sincronización con Notion está deshabilitada. ' +
      'Los cambios estarán disponibles en tu navegador.'
    );
    setIsSaving(false); // Asegurarse de que el estado de guardado se desactive
  };

  const saveToLocalStorage = (study: CaseStudy) => {
    try {
      // Obtenemos los estudios actuales
      const storageKey = 'syncedStudies';
      const savedStudies = localStorage.getItem(storageKey);
      const studies = savedStudies ? JSON.parse(savedStudies) : [];
      
      // Actualizamos el estudio en la lista
      const updatedStudies = studies.map((s: CaseStudy) => 
        s.id === study.id ? { ...study, updatedAt: new Date().toISOString(), synced: false } : s
      );
      
      // Guardamos la lista actualizada
      localStorage.setItem(storageKey, JSON.stringify(updatedStudies));
      console.log('Caso de estudio guardado en localStorage:', study.title);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };

  const handleCancelAction = async () => {
    router.push('/admin/case-studies');
  };
  
  return (
    <>
      {errorMessage && (
        <div className="mb-4 p-4 border border-yellow-500 bg-yellow-50 text-yellow-800 rounded-md">
          <p className="font-medium">Advertencia</p>
          <p>Los cambios se han guardado localmente, pero no se pudieron sincronizar con Notion.</p>
          <p className="mt-2 text-sm text-yellow-700">{errorMessage}</p>
        </div>
      )}
      
      <EditCaseStudyForm 
        caseStudy={caseStudy} 
        onSaveAction={handleSaveAction} 
        onCancelAction={handleCancelAction}
        isSaving={isSaving}
      />
    </>
  );
}
