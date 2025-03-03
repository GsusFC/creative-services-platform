import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para gestionar archivos de casos de estudio
 */
export class FileService {
  private static readonly UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'case-studies');
  
  /**
   * Guarda un archivo en el sistema de archivos
   * @param file Archivo a guardar
   * @param slug Slug del caso de estudio
   * @returns URL relativa del archivo guardado
   */
  static async saveFile(
    file: File,
    slug: string
  ): Promise<string> {
    // Asegurarse de que el directorio existe
    await this.ensureDirectoryExists(slug);
    
    // Generar un nombre único para el archivo
    const fileName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
    
    // Ruta completa del archivo
    const filePath = path.join(this.UPLOAD_DIR, slug, fileName);
    
    // Convertir el archivo a un Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Guardar el archivo
    fs.writeFileSync(filePath, buffer);
    
    // Devolver la URL relativa
    return `/uploads/case-studies/${slug}/${fileName}`;
  }
  
  /**
   * Elimina un archivo del sistema de archivos
   * @param fileUrl URL relativa del archivo a eliminar
   * @returns true si se eliminó correctamente, false en caso contrario
   */
  static deleteFile(fileUrl: string): boolean {
    try {
      // Obtener la ruta completa del archivo
      const filePath = path.join(process.cwd(), 'public', fileUrl);
      
      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        return false;
      }
      
      // Eliminar el archivo
      fs.unlinkSync(filePath);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      return false;
    }
  }
  
  /**
   * Elimina todos los archivos de un caso de estudio
   * @param slug Slug del caso de estudio
   * @returns true si se eliminaron correctamente, false en caso contrario
   */
  static deleteAllFiles(slug: string): boolean {
    try {
      // Obtener la ruta del directorio
      const dirPath = path.join(this.UPLOAD_DIR, slug);
      
      // Verificar que el directorio existe
      if (!fs.existsSync(dirPath)) {
        return true; // No hay nada que eliminar
      }
      
      // Obtener todos los archivos del directorio
      const files = fs.readdirSync(dirPath);
      
      // Eliminar cada archivo
      for (const file of files) {
        fs.unlinkSync(path.join(dirPath, file));
      }
      
      // Eliminar el directorio
      fs.rmdirSync(dirPath);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar los archivos:', error);
      return false;
    }
  }
  
  /**
   * Se asegura de que el directorio para los archivos del caso de estudio existe
   * @param slug Slug del caso de estudio
   */
  private static async ensureDirectoryExists(slug: string): Promise<void> {
    // Crear el directorio base si no existe
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
    
    // Crear el directorio específico para el caso de estudio si no existe
    const caseStudyDir = path.join(this.UPLOAD_DIR, slug);
    if (!fs.existsSync(caseStudyDir)) {
      fs.mkdirSync(caseStudyDir, { recursive: true });
    }
  }
}
