import { render, screen, fireEvent } from '@testing-library/react';
import ProjectSelector from './ProjectSelector';
import { useProjectSearch } from '../../hooks/useProjectSearch';

// Mock del hook useProjectSearch
jest.mock('../../hooks/useProjectSearch', () => ({
  useProjectSearch: jest.fn()
}));

interface NotionProject {
  id: string;
  title: string;
  status: string;
}

const mockProjects: NotionProject[] = [
  { id: '1', title: 'Proyecto 1', status: 'active' },
  { id: '2', title: 'Proyecto 2', status: 'inactive' }
];

describe('ProjectSelector', () => {
  beforeEach(() => {
    (useProjectSearch as jest.Mock).mockReturnValue({
      searchTerm: '',
      filteredProjects: mockProjects,
      handleSearch: jest.fn()
    });
  });

  test('renderiza correctamente', () => {
    const mockOnSelect = jest.fn((projects: string[]) => projects);
    render(<ProjectSelector projects={mockProjects} onSelectProjects={mockOnSelect} />);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  test('maneja la selección de proyectos', () => {
    const mockOnSelect = jest.fn((projects: string[]) => projects);
    render(<ProjectSelector projects={mockProjects} onSelectProjects={mockOnSelect} />);

    const project = screen.getByText('Proyecto 1');
    fireEvent.click(project);

    expect(mockOnSelect).toHaveBeenCalledWith(['1']);
  });

  test('navegación por teclado', () => {
    const mockOnSelect = jest.fn((projects: string[]) => projects);
    render(<ProjectSelector projects={mockProjects} onSelectProjects={mockOnSelect} />);

    const project = screen.getByText('Proyecto 1');
    fireEvent.keyDown(project, { key: 'Enter' });

    expect(project).toHaveAttribute('aria-selected', 'true');
  });
});
