import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno antes de importar el cliente
dotenv.config({
  path: path.resolve(process.cwd(), '.env.test')
});

import { getAllCaseStudies, createCaseStudy, getCaseStudy, updateCaseStudy, deleteCaseStudy } from '../client';
import { CreateCaseStudyInput } from '../types';

describe('Notion Client', () => {
  let createdCaseStudyId: string;

  const testCaseStudy: CreateCaseStudyInput = {
    title: 'Test Case Study',
    client: 'Test Client',
    description: 'Test Description',
    description2: 'Test Long Description',
    status: 'draft',
    tags: ['test'],
    order: 1,
    featured: false,
    featuredOrder: 0,
    mediaItems: [{
      type: 'image',
      url: 'https://example.com/image.jpg',
      alt: 'Test Image',
      width: 800,
      height: 600,
      order: 1
    }],
    slug: 'test-case-study'
  };

  // Crear un case study antes de las pruebas
  beforeAll(async () => {
    const caseStudy = await createCaseStudy(testCaseStudy);
    createdCaseStudyId = caseStudy.id;
  });

  // Eliminar el case study después de las pruebas
  afterAll(async () => {
    if (createdCaseStudyId) {
      await deleteCaseStudy(createdCaseStudyId);
    }
  });

  it('should get all case studies', async () => {
    const caseStudies = await getAllCaseStudies();
    expect(Array.isArray(caseStudies)).toBe(true);
    expect(caseStudies.length).toBeGreaterThan(0);
  });

  it('should get a single case study', async () => {
    const caseStudy = await getCaseStudy(createdCaseStudyId);
    expect(caseStudy).toBeDefined();
    expect(caseStudy.id).toBe(createdCaseStudyId);
    expect(caseStudy.title).toBe(testCaseStudy.title);
  });

  it('should update a case study', async () => {
    const updatedTitle = 'Updated Test Case Study';
    const updatedCaseStudy = await updateCaseStudy({
      id: createdCaseStudyId,
      title: updatedTitle
    });

    expect(updatedCaseStudy).toBeDefined();
    expect(updatedCaseStudy.title).toBe(updatedTitle);
  });

  it('should create a new case study', async () => {
    const newCaseStudy = await createCaseStudy({
      ...testCaseStudy,
      title: 'Another Test Case Study'
    });

    expect(newCaseStudy).toBeDefined();
    expect(newCaseStudy.title).toBe('Another Test Case Study');
    expect(newCaseStudy.client).toBe(testCaseStudy.client);

    // Limpiar
    await deleteCaseStudy(newCaseStudy.id);
  });

  it('should delete a case study', async () => {
    // Crear un nuevo case study para eliminar
    const caseStudyToDelete = await createCaseStudy({
      ...testCaseStudy,
      title: 'Case Study To Delete'
    });

    await expect(deleteCaseStudy(caseStudyToDelete.id)).resolves.not.toThrow();
  });
});
