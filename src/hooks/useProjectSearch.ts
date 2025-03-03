import { useState, useCallback, ChangeEvent } from 'react';
import { NotionProject } from '../components/notion-importer/ProjectSelector';

interface UseProjectSearch {
  searchTerm: string;
  filteredProjects: NotionProject[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useProjectSearch = (initialProjects: NotionProject[]): UseProjectSearch => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const filteredProjects = initialProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    filteredProjects,
    handleSearch
  };
};
