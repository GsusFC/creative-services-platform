import { NextResponse } from 'next/server';
import { featuredProjects } from '@/data/projects';

// API handler que redirige la solicitud para mantener compatibilidad con componentes existentes
// que usan /api/case-studies en lugar de /api/cases
// Esta implementación previene peticiones a http://localhost:3001/cases
export async function GET() {
  try {
    // Utilizamos los proyectos definidos localmente
    const projects = featuredProjects.map(project => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      tags: project.tags
    }));

    return NextResponse.json({
      success: true,
      caseStudies: projects
    });
  } catch (error) {
    console.error('Error al obtener los case studies:', error);
    return NextResponse.json(
      { success: false, message: 'Error al obtener los case studies' },
      { status: 500 }
    );
  }
}
