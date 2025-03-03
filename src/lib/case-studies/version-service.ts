import { connectToDatabase } from '../db/mongodb';
import { CaseStudyVersionModel, CaseStudyVersion } from './version-schema';
import { CaseStudyDataV4 } from './mapper-utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para gestionar el versionado de casos de estudio
 */
export class VersionService {
  /**
   * Crea una nueva versión de un caso de estudio
   * @param caseStudyId ID del caso de estudio
   * @param data Datos completos del caso de estudio
   * @param comment Comentario opcional sobre los cambios realizados
   * @param createdBy Usuario que creó la versión (opcional)
   */
  static async createVersion(
    caseStudyId: string,
    data: CaseStudyDataV4,
    comment?: string,
    createdBy?: string
  ): Promise<CaseStudyVersion> {
    await connectToDatabase();
    
    // Obtener el número de la última versión
    const lastVersion = await CaseStudyVersionModel
      .findOne({ caseStudyId })
      .sort({ versionNumber: -1 });
    
    const versionNumber = lastVersion ? lastVersion.versionNumber + 1 : 1;
    
    // Crear la nueva versión
    const newVersion = new CaseStudyVersionModel({
      versionId: uuidv4(),
      caseStudyId,
      versionNumber,
      createdAt: new Date().toISOString(),
      createdBy,
      data,
      comment
    });
    
    await newVersion.save();
    
    return newVersion;
  }
  
  /**
   * Obtiene todas las versiones de un caso de estudio
   * @param caseStudyId ID del caso de estudio
   * @param limit Número máximo de versiones a devolver
   * @param skip Número de versiones a saltar (para paginación)
   */
  static async getVersions(
    caseStudyId: string,
    limit: number = 10,
    skip: number = 0
  ): Promise<CaseStudyVersion[]> {
    await connectToDatabase();
    
    const versions = await CaseStudyVersionModel
      .find({ caseStudyId })
      .sort({ versionNumber: -1 })
      .limit(limit)
      .skip(skip);
    
    return versions;
  }
  
  /**
   * Obtiene una versión específica de un caso de estudio
   * @param caseStudyId ID del caso de estudio
   * @param versionNumber Número de versión
   */
  static async getVersion(
    caseStudyId: string,
    versionNumber: number
  ): Promise<CaseStudyVersion | null> {
    await connectToDatabase();
    
    const version = await CaseStudyVersionModel.findOne({
      caseStudyId,
      versionNumber
    });
    
    return version;
  }
  
  /**
   * Obtiene la última versión de un caso de estudio
   * @param caseStudyId ID del caso de estudio
   */
  static async getLatestVersion(
    caseStudyId: string
  ): Promise<CaseStudyVersion | null> {
    await connectToDatabase();
    
    const version = await CaseStudyVersionModel
      .findOne({ caseStudyId })
      .sort({ versionNumber: -1 });
    
    return version;
  }
  
  /**
   * Elimina todas las versiones de un caso de estudio
   * @param caseStudyId ID del caso de estudio
   */
  static async deleteAllVersions(
    caseStudyId: string
  ): Promise<{ deletedCount: number }> {
    await connectToDatabase();
    
    const result = await CaseStudyVersionModel.deleteMany({ caseStudyId });
    
    return { deletedCount: result.deletedCount || 0 };
  }
}
