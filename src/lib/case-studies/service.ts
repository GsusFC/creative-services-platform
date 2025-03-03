import { connectToDatabase } from '../db/mongodb';
import { CaseStudyModel } from './schema';
import { CaseStudyDataV4 } from './mapper-utils';
import { v4 as uuidv4 } from 'uuid';
import { FileService } from './file-service';
import { VersionService } from './version-service';

/**
 * Servicio para gestionar operaciones CRUD de casos de estudio
 */
export class CaseStudyService {
  /**
   * Obtiene todos los casos de estudio
   * @param onlyPublished Si es true, solo devuelve los casos de estudio publicados
   * @param limit Número máximo de resultados a devolver
   * @param skip Número de resultados a saltar (para paginación)
   */
  static async getAllCaseStudies(
    onlyPublished: boolean = false,
    limit: number = 100,
    skip: number = 0
  ): Promise<CaseStudyDataV4[]> {
    await connectToDatabase();
    
    const query = onlyPublished ? { published: true } : {};
    
    const caseStudies = await CaseStudyModel
      .find(query)
      .sort({ created_at: -1 }) // Ordenar por fecha de creación descendente
      .limit(limit)
      .skip(skip);
      
    return caseStudies;
  }
  
  /**
   * Obtiene un caso de estudio por su slug
   * @param slug Slug único del caso de estudio
   * @param requirePublished Si es true, solo devuelve el caso si está publicado
   */
  static async getCaseStudyBySlug(
    slug: string,
    requirePublished: boolean = false
  ): Promise<CaseStudyDataV4 | null> {
    await connectToDatabase();
    
    const query = requirePublished 
      ? { slug, published: true } 
      : { slug };
      
    const caseStudy = await CaseStudyModel.findOne(query);
    
    return caseStudy;
  }
  
  /**
   * Crea un nuevo caso de estudio
   * @param caseStudyData Datos del caso de estudio a crear
   * @param createVersion Si es true, crea una versión inicial (por defecto: true)
   * @param versionComment Comentario opcional para la versión
   * @param createdBy Usuario que creó el caso de estudio (opcional)
   */
  static async createCaseStudy(
    caseStudyData: Partial<CaseStudyDataV4>,
    createVersion: boolean = true,
    versionComment?: string,
    createdBy?: string
  ): Promise<CaseStudyDataV4> {
    await connectToDatabase();
    
    // Generar ID y slug si no se proporcionan
    const id = caseStudyData.id || uuidv4();
    const slug = caseStudyData.slug || this.generateSlug(caseStudyData.project_name || 'case-study');
    
    // Crear el nuevo documento
    const newCaseStudy = new CaseStudyModel({
      ...caseStudyData,
      id,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    await newCaseStudy.save();
    
    // Crear versión inicial si se solicita
    if (createVersion) {
      await VersionService.createVersion(
        id,
        newCaseStudy.toJSON(),
        versionComment || 'Versión inicial',
        createdBy
      );
    }
    
    return newCaseStudy;
  }
  
  /**
   * Actualiza un caso de estudio existente
   * @param slug Slug del caso de estudio a actualizar
   * @param caseStudyData Datos actualizados del caso de estudio
   * @param createVersion Si es true, crea una nueva versión (por defecto: true)
   * @param versionComment Comentario opcional para la versión
   * @param updatedBy Usuario que actualizó el caso de estudio (opcional)
   */
  static async updateCaseStudy(
    slug: string,
    caseStudyData: Partial<CaseStudyDataV4>,
    createVersion: boolean = true,
    versionComment?: string,
    updatedBy?: string
  ): Promise<CaseStudyDataV4 | null> {
    await connectToDatabase();
    
    // Actualizar el documento
    const updatedCaseStudy = await CaseStudyModel.findOneAndUpdate(
      { slug },
      {
        ...caseStudyData,
        updated_at: new Date().toISOString()
      },
      { new: true } // Devolver el documento actualizado
    );
    
    if (updatedCaseStudy && createVersion) {
      // Crear nueva versión
      await VersionService.createVersion(
        updatedCaseStudy.id,
        updatedCaseStudy.toJSON(),
        versionComment || 'Actualización',
        updatedBy
      );
    }
    
    return updatedCaseStudy;
  }
  
  /**
   * Elimina un caso de estudio
   * @param slug Slug del caso de estudio a eliminar
   * @param deleteVersions Si es true, elimina también todas las versiones (por defecto: true)
   */
  static async deleteCaseStudy(slug: string, deleteVersions: boolean = true): Promise<boolean> {
    await connectToDatabase();
    
    // Obtener el ID del caso de estudio antes de eliminarlo
    const caseStudy = await CaseStudyModel.findOne({ slug });
    const caseStudyId = caseStudy?.id;
    
    // Eliminar el caso de estudio de la base de datos
    const result = await CaseStudyModel.deleteOne({ slug });
    
    // Si se eliminó correctamente, eliminar también los archivos asociados
    if (result.deletedCount === 1) {
      // Eliminar todos los archivos del caso de estudio
      FileService.deleteAllFiles(slug);
      
      // Eliminar versiones si se solicita y si se encontró el caso de estudio
      if (deleteVersions && caseStudyId) {
        await VersionService.deleteAllVersions(caseStudyId);
      }
    }
    
    return result.deletedCount === 1;
  }
  
  /**
   * Cambia el estado de publicación de un caso de estudio
   * @param slug Slug del caso de estudio
   * @param published Nuevo estado de publicación
   */
  static async togglePublishStatus(
    slug: string,
    published: boolean
  ): Promise<CaseStudyDataV4 | null> {
    await connectToDatabase();
    
    const updatedCaseStudy = await CaseStudyModel.findOneAndUpdate(
      { slug },
      { 
        published,
        updated_at: new Date().toISOString()
      },
      { new: true }
    );
    
    return updatedCaseStudy;
  }
  
  /**
   * Busca casos de estudio por texto
   * @param searchTerm Término de búsqueda
   * @param onlyPublished Si es true, solo busca en casos publicados
   */
  static async searchCaseStudies(
    searchTerm: string,
    onlyPublished: boolean = false
  ): Promise<CaseStudyDataV4[]> {
    await connectToDatabase();
    
    const query = onlyPublished 
      ? { 
          published: true,
          $or: [
            { project_name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        } 
      : {
          $or: [
            { project_name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        };
    
    const caseStudies = await CaseStudyModel
      .find(query)
      .sort({ created_at: -1 });
      
    return caseStudies;
  }
  
  /**
   * Filtra casos de estudio por categoría y/o tags
   * @param category Categoría para filtrar
   * @param tags Tags para filtrar
   * @param onlyPublished Si es true, solo incluye casos publicados
   */
  static async filterCaseStudies(
    category?: string,
    tags?: string[],
    onlyPublished: boolean = false
  ): Promise<CaseStudyDataV4[]> {
    await connectToDatabase();
    
    const query: Record<string, unknown> = onlyPublished ? { published: true } : {};
    
    if (category) {
      query.category = category;
    }
    
    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    const caseStudies = await CaseStudyModel
      .find(query)
      .sort({ created_at: -1 });
      
    return caseStudies;
  }
  
  /**
   * Genera un slug a partir del nombre del proyecto
   * @param name Nombre del proyecto
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Eliminar guiones múltiples
      .trim();
  }

  /**
   * Obtiene todas las versiones de un caso de estudio
   * @param slug Slug del caso de estudio
   * @param limit Número máximo de versiones a devolver
   * @param skip Número de versiones a saltar (para paginación)
   */
  static async getCaseStudyVersions(slug: string, limit: number = 10, skip: number = 0) {
    await connectToDatabase();
    
    // Obtener el caso de estudio
    const caseStudy = await CaseStudyModel.findOne({ slug });
    
    if (!caseStudy) {
      return null;
    }
    
    // Obtener las versiones
    const versions = await VersionService.getVersions(caseStudy.id, limit, skip);
    
    return versions;
  }
  
  /**
   * Obtiene una versión específica de un caso de estudio
   * @param slug Slug del caso de estudio
   * @param versionNumber Número de versión
   */
  static async getCaseStudyVersion(slug: string, versionNumber: number) {
    await connectToDatabase();
    
    // Obtener el caso de estudio
    const caseStudy = await CaseStudyModel.findOne({ slug });
    
    if (!caseStudy) {
      return null;
    }
    
    // Obtener la versión
    const version = await VersionService.getVersion(caseStudy.id, versionNumber);
    
    return version;
  }
  
  /**
   * Restaura una versión anterior de un caso de estudio
   * @param slug Slug del caso de estudio
   * @param versionNumber Número de versión a restaurar
   * @param createVersion Si es true, crea una nueva versión al restaurar (por defecto: true)
   * @param restoredBy Usuario que restauró la versión (opcional)
   */
  static async restoreCaseStudyVersion(
    slug: string,
    versionNumber: number,
    createVersion: boolean = true,
    restoredBy?: string
  ): Promise<CaseStudyDataV4 | null> {
    await connectToDatabase();
    
    // Obtener el caso de estudio
    const caseStudy = await CaseStudyModel.findOne({ slug });
    
    if (!caseStudy) {
      return null;
    }
    
    // Obtener la versión a restaurar
    const version = await VersionService.getVersion(caseStudy.id, versionNumber);
    
    if (!version) {
      return null;
    }
    
    // Restaurar los datos de la versión
    const versionData = version.data;
    
    // Mantener el ID y slug originales
    const updatedCaseStudy = await CaseStudyModel.findOneAndUpdate(
      { slug },
      {
        ...versionData,
        id: caseStudy.id,
        slug: caseStudy.slug,
        updated_at: new Date().toISOString()
      },
      { new: true }
    );
    
    if (updatedCaseStudy && createVersion) {
      // Crear nueva versión
      await VersionService.createVersion(
        updatedCaseStudy.id,
        updatedCaseStudy.toJSON(),
        `Restaurada versión ${versionNumber}`,
        restoredBy
      );
    }
    
    return updatedCaseStudy;
  }
}
