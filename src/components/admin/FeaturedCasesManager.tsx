"use client";

import { useState, useEffect } from "react";
import { CaseStudy, FeaturedCaseUpdate } from "@/types/case-study";
import Image from "next/image";
import { getAllCaseStudies, updateFeaturedCaseStudies } from "@/lib/case-studies/service";

/**
 * Componente para administrar los casos destacados en la página principal
 * Implementa funcionalidad de arrastrar y soltar para seleccionar hasta 4 casos
 */
export default function FeaturedCasesManager() {
  const [allCases, setAllCases] = useState<CaseStudy[]>([]);
  const [featuredCases, setFeaturedCases] = useState<CaseStudy[]>([]);
  const [availableCases, setAvailableCases] = useState<CaseStudy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Cargar los case studies al montar el componente
  useEffect(() => {
    const loadCases = async () => {
      try {
        setIsLoading(true);
        const cases = await getAllCaseStudies();
        
        // Separar los casos en destacados y disponibles
        const featured = cases.filter(c => c.featured).sort((a, b) => a.featuredOrder - b.featuredOrder);
        const available = cases.filter(c => !c.featured);
        
        setAllCases(cases);
        setFeaturedCases(featured);
        setAvailableCases(available);
      } catch (error) {
        console.error("Error al cargar los case studies:", error);
        setErrorMessage("Error al cargar los case studies. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCases();
  }, []);

  // Mover un caso de estudio hacia arriba en la lista de destacados
  const moveUp = (index: number) => {
    if (index <= 0) return;
    
    const newFeatured = [...featuredCases];
    [newFeatured[index - 1], newFeatured[index]] = [newFeatured[index], newFeatured[index - 1]];
    
    // Actualizar los órdenes
    const updatedFeatured = newFeatured.map((item, idx) => ({
      ...item,
      featuredOrder: idx + 1,
    }));
    
    setFeaturedCases(updatedFeatured);
  };
  
  // Mover un caso de estudio hacia abajo en la lista de destacados
  const moveDown = (index: number) => {
    if (index >= featuredCases.length - 1) return;
    
    const newFeatured = [...featuredCases];
    [newFeatured[index], newFeatured[index + 1]] = [newFeatured[index + 1], newFeatured[index]];
    
    // Actualizar los órdenes
    const updatedFeatured = newFeatured.map((item, idx) => ({
      ...item,
      featuredOrder: idx + 1,
    }));
    
    setFeaturedCases(updatedFeatured);
  };
  
  // Añadir un caso de estudio a la lista de destacados
  const addToFeatured = (caseStudy: CaseStudy) => {
    if (featuredCases.length >= 4) {
      setErrorMessage("Solo se pueden destacar 4 casos de estudio.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const newFeatured = [...featuredCases];
    const newAvailable = availableCases.filter(item => item.id !== caseStudy.id);
    
    // Marcar como destacado y asignar orden
    const updatedItem = {
      ...caseStudy,
      featured: true,
      featuredOrder: newFeatured.length + 1,
    };
    
    newFeatured.push(updatedItem);
    
    setFeaturedCases(newFeatured);
    setAvailableCases(newAvailable);
  };
  
  // Quitar un caso de estudio de la lista de destacados
  const removeFromFeatured = (caseStudy: CaseStudy) => {
    const newFeatured = featuredCases.filter(item => item.id !== caseStudy.id);
    const newAvailable = [...availableCases];
    
    // Quitar destacado
    const updatedItem = {
      ...caseStudy,
      featured: false,
      featuredOrder: 0,
    };
    
    newAvailable.push(updatedItem);
    
    // Actualizar órdenes en los destacados
    const updatedFeatured = newFeatured.map((item, index) => ({
      ...item,
      featuredOrder: index + 1,
    }));
    
    setFeaturedCases(updatedFeatured);
    setAvailableCases(newAvailable);
  };
  
  // Guardar los cambios
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(null);
      
      // Crear arreglo con los cambios para enviar a la API
      const updates: FeaturedCaseUpdate[] = allCases.map((caseStudy) => {
        const isFeatured = featuredCases.some(fc => fc.id === caseStudy.id);
        const featuredItem = featuredCases.find(fc => fc.id === caseStudy.id);
        
        return {
          id: caseStudy.id,
          featured: isFeatured,
          featuredOrder: isFeatured ? featuredItem?.featuredOrder || 0 : 0,
        };
      });
      
      const result = await updateFeaturedCaseStudies(updates);
      
      if (result.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(null), 3000);
      } else {
        setSaveSuccess(false);
        setErrorMessage("Error al guardar los cambios. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      setSaveSuccess(false);
      setErrorMessage("Error al guardar los cambios. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Encontrar la primera imagen para usar como miniatura
  const getThumbnail = (caseStudy: CaseStudy) => {
    const image = caseStudy.mediaItems.find(m => m.type === "image");
    return image ? image.url : "/placeholder.jpg"; // Imagen predeterminada si no hay ninguna
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-gray-400 rounded-full mb-4"></div>
        <p>Cargando casos de estudio...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white">
      <h2 className="text-3xl font-druk mb-6">ADMINISTRAR CASOS DESTACADOS</h2>
      
      {/* Mensaje de error */}
      {errorMessage && (
        <div className="bg-red-900/50 text-white p-4 mb-6 rounded">
          <p>{errorMessage}</p>
        </div>
      )}
      
      {/* Mensaje de éxito */}
      {saveSuccess && (
        <div className="bg-green-900/50 text-white p-4 mb-6 rounded">
          <p>Cambios guardados correctamente.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de casos destacados */}
        <div className="border border-gray-800 rounded-lg p-4 bg-black">
          <h3 className="text-xl font-druk mb-4">DESTACADOS (MAX 4)</h3>
          <p className="text-gray-400 mb-4 font-mono text-sm">
            Selecciona hasta 4 casos de estudio para mostrarlos en la página principal.
            Puedes reordenarlos usando las flechas.
          </p>
          
          <div className="min-h-[200px] bg-gray-900/30 p-2 rounded-lg">
            {featuredCases.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-mono">
                No hay casos destacados
              </div>
            ) : (
              featuredCases.map((caseStudy, index) => (
                <div
                  key={caseStudy.id}
                  className="p-3 mb-2 bg-gray-800 rounded-lg flex items-center"
                >
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={getThumbnail(caseStudy)}
                      alt={caseStudy.title}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h4 className="font-druk text-sm">{caseStudy.title}</h4>
                    <p className="text-gray-400 text-xs">{caseStudy.client}</p>
                  </div>
                  <div className="ml-auto flex items-center">
                    <span className="font-druk text-2xl text-gray-500 mr-4">{index + 1}</span>
                    <div className="flex flex-col">
                      <button 
                        onClick={() => moveUp(index)}
                        className="text-gray-400 hover:text-white disabled:opacity-30"
                        disabled={index === 0}
                        aria-label="Mover arriba"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => moveDown(index)}
                        className="text-gray-400 hover:text-white disabled:opacity-30"
                        disabled={index === featuredCases.length - 1}
                        aria-label="Mover abajo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromFeatured(caseStudy)}
                      className="ml-2 text-red-500 hover:text-red-400"
                      aria-label="Quitar de destacados"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Sección de casos disponibles */}
        <div className="border border-gray-800 rounded-lg p-4 bg-black">
          <h3 className="text-xl font-druk mb-4">DISPONIBLES</h3>
          <p className="text-gray-400 mb-4 font-mono text-sm">
            Todos los casos de estudio disponibles para destacar.
          </p>
          
          <div className="min-h-[200px] bg-gray-900/30 p-2 rounded-lg overflow-y-auto max-h-[400px]">
            {availableCases.length === 0 ? (
              <div className="text-center py-8 text-gray-500 font-mono">
                No hay casos disponibles
              </div>
            ) : (
              availableCases.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className="p-3 mb-2 bg-gray-800 rounded-lg flex items-center"
                >
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={getThumbnail(caseStudy)}
                      alt={caseStudy.title}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h4 className="font-druk text-sm">{caseStudy.title}</h4>
                    <p className="text-gray-400 text-xs">{caseStudy.client}</p>
                  </div>
                  <div className="ml-auto">
                    <button 
                      onClick={() => addToFeatured(caseStudy)}
                      className="text-green-500 hover:text-green-400"
                      disabled={featuredCases.length >= 4}
                      aria-label="Añadir a destacados"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Botón guardar */}
      <div className="mt-8 text-right">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-druk rounded-lg transition-colors"
        >
          {isSaving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
        </button>
      </div>
    </div>
  );
}
