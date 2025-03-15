import { useState, useCallback } from 'react';
import { CaseStudy, MediaItem } from '@/types/case-study';
import * as caseStudyService from '@/api/caseStudyService';

interface CaseStudyState {
  caseStudy: CaseStudy | null;
  loading: boolean;
  error: string | null;
}

interface CaseStudyFormData extends Omit<CaseStudy, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}

export const useCaseStudy = (initialCaseStudy?: CaseStudy | null) => {
  const [state, setState] = useState<CaseStudyState>({
    caseStudy: initialCaseStudy || null,
    loading: false,
    error: null
  });

  // Cargar un estudio de caso por su slug
  const loadCaseStudyBySlug = useCallback(async (slug: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const caseStudy = await caseStudyService.getCaseStudyBySlug(slug);
      setState({ caseStudy, loading: false, error: null });
      return caseStudy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el estudio de caso';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  // Crear un nuevo estudio de caso
  const createCaseStudy = useCallback(async (formData: Omit<CaseStudyFormData, 'id'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Asegurarse de que mediaItems sea un array
      const safeFormData: Omit<CaseStudy, 'id'> = {
        ...formData,
        mediaItems: formData.mediaItems || [],
        tags: formData.tags || [],
        status: formData.status || 'draft',
        featured: formData.featured || false,
        featuredOrder: formData.featuredOrder || 999
      };
      
      const newCaseStudy = await caseStudyService.createCaseStudy(safeFormData);
      setState({ caseStudy: newCaseStudy, loading: false, error: null });
      return newCaseStudy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el estudio de caso';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  // Actualizar un estudio de caso existente
  const updateCaseStudy = useCallback(async (formData: CaseStudyFormData) => {
    if (!formData.id) {
      setState(prev => ({ ...prev, error: 'No se puede actualizar un estudio sin ID' }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const { id, ...updateData } = formData;
      const updatedCaseStudy = await caseStudyService.updateCaseStudy(id, updateData);
      setState({ caseStudy: updatedCaseStudy, loading: false, error: null });
      return updatedCaseStudy;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el estudio de caso';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, []);

  // Eliminar un estudio de caso
  const deleteCaseStudy = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await caseStudyService.deleteCaseStudy(id);
      setState({ caseStudy: null, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el estudio de caso';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  }, []);

  // Agregar un elemento multimedia al estudio de caso
  const addMediaItem = useCallback((mediaItem: MediaItem) => {
    if (!state.caseStudy) return;
    
    const updatedCaseStudy = {
      ...state.caseStudy,
      mediaItems: [...state.caseStudy.mediaItems, mediaItem]
    };
    
    setState(prev => ({ ...prev, caseStudy: updatedCaseStudy }));
  }, [state.caseStudy]);

  // Actualizar un elemento multimedia en el estudio de caso
  const updateMediaItem = useCallback((updatedItem: MediaItem) => {
    if (!state.caseStudy) return;
    
    const updatedMediaItems = state.caseStudy.mediaItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    
    const updatedCaseStudy = {
      ...state.caseStudy,
      mediaItems: updatedMediaItems
    };
    
    setState(prev => ({ ...prev, caseStudy: updatedCaseStudy }));
  }, [state.caseStudy]);

  // Eliminar un elemento multimedia del estudio de caso
  const removeMediaItem = useCallback((itemId: string) => {
    if (!state.caseStudy) return;
    
    const updatedMediaItems = state.caseStudy.mediaItems.filter(item => item.id !== itemId);
    
    const updatedCaseStudy = {
      ...state.caseStudy,
      mediaItems: updatedMediaItems
    };
    
    setState(prev => ({ ...prev, caseStudy: updatedCaseStudy }));
  }, [state.caseStudy]);

  // Reordenar elementos multimedia
  const reorderMediaItems = useCallback((reorderedItems: MediaItem[]) => {
    if (!state.caseStudy) return;
    
    const updatedCaseStudy = {
      ...state.caseStudy,
      mediaItems: reorderedItems
    };
    
    setState(prev => ({ ...prev, caseStudy: updatedCaseStudy }));
  }, [state.caseStudy]);

  return {
    ...state,
    loadCaseStudyBySlug,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    addMediaItem,
    updateMediaItem,
    removeMediaItem,
    reorderMediaItems
  };
};
