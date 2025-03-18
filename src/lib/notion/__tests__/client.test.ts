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
    }]
  };

  it('should create a case study', async () => {
    const caseStudy = await createCaseStudy(testCaseStudy);
    expect(caseStudy).toBeDefined();
    expect(caseStudy.title).toBe(testCaseStudy.title);
    expect(caseStudy.client).toBe(testCaseStudy.client);
    createdCaseStudyId = caseStudy.id;
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

  it('should delete a case study', async () => {
    await expect(deleteCaseStudy(createdCaseStudyId)).resolves.not.toThrow();
  });
});
