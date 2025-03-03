import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio mock para gestionar archivos de casos de estudio (sin acceder al sistema de archivos)
 */
export class MockFileService {
  // Almacenamiento en memoria para los "archivos"
  private static readonly files: Record<string, string> = {};
  
  /**
   * Simula guardar un archivo (devuelve una URL ficticia)
   * @param file Archivo a "guardar"
   * @param slug Slug del caso de estudio
   * @returns URL relativa ficticia del archivo guardado
   */
  static async saveFile(
    file: File,
    slug: string
  ): Promise<string> {
    // Generar un nombre único para el archivo
    const fileName = `${Date.now()}-${uuidv4()}${file.name.substring(file.name.lastIndexOf('.'))}`;
    
    // URL relativa ficticia
    const fileUrl = `/uploads/case-studies/${slug}/${fileName}`;
    
    // Guardar en el almacenamiento en memoria
    this.files[fileUrl] = file.name;
    
    // Devolver la URL ficticia
    return fileUrl;
  }
  
  /**
   * Simula eliminar un archivo
   * @param fileUrl URL relativa del archivo a "eliminar"
   * @returns true siempre (simulación exitosa)
   */
  static deleteFile(fileUrl: string): boolean {
    // Eliminar del almacenamiento en memoria
    delete this.files[fileUrl];
    
    return true;
  }
  
  /**
   * Simula eliminar todos los archivos de un caso de estudio
   * @param slug Slug del caso de estudio
   * @returns true siempre (simulación exitosa)
   */
  static deleteAllFiles(slug: string): boolean {
    // Patrón para identificar archivos del caso de estudio
    const pattern = `/uploads/case-studies/${slug}/`;
    
    // Eliminar todos los archivos que coincidan con el patrón
    Object.keys(this.files).forEach(fileUrl => {
      if (fileUrl.startsWith(pattern)) {
        delete this.files[fileUrl];
      }
    });
    
    return true;
  }
  
  /**
   * Devuelve la lista de archivos "guardados" (para depuración)
   */
  static getFiles(): Record<string, string> {
    return { ...this.files };
  }
}
