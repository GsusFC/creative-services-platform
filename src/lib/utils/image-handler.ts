import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface SaveImageOptions {
  caseStudySlug: string;
  imageType?: 'hero' | 'avatar' | 'cover' | 'gallery';
  originalFilename?: string;
}

export async function downloadAndSaveImage(
  imageUrl: string,
  options: SaveImageOptions
): Promise<string> {
  try {
    // Crear el directorio para el case study si no existe
    const baseDir = path.join(process.cwd(), 'public', 'images', options.caseStudySlug);
    await fs.mkdir(baseDir, { recursive: true });

    // Obtener la extensión del archivo original o de la URL
    const ext = options.originalFilename
      ? path.extname(options.originalFilename)
      : path.extname(imageUrl) || '.jpg';

    // Generar un nombre único para la imagen
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex').slice(0, 8);
    const filename = `${options.imageType || 'image'}-${hash}${ext}`;
    const filePath = path.join(baseDir, filename);

    // Descargar la imagen
    console.log(`Descargando imagen desde ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Error al descargar la imagen: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Devolver la ruta relativa para usar en la aplicación
    const relativePath = `/images/${options.caseStudySlug}/${filename}`;
    console.log(`Imagen guardada como: ${relativePath}`);
    return relativePath;

  } catch (error) {
    console.error('Error procesando imagen:', error);
    return imageUrl; // En caso de error, devolvemos la URL original
  }
}
