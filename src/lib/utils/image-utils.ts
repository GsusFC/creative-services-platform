import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function saveBase64Image(base64String: string, directory: string = 'public/images'): Promise<string> {
  try {
    // Verificar si es una cadena base64 válida
    if (!base64String.includes(';base64,')) {
      console.log('No es una imagen base64, retornando URL original');
      return base64String;
    }

    // Extraer el tipo de imagen y los datos
    const parts = base64String.split(';base64,');
    if (parts.length !== 2) {
      throw new Error('Formato de base64 inválido');
    }

    const [header, base64Data] = parts;
    const mimeTypeParts = header.split('/');
    if (mimeTypeParts.length !== 2) {
      throw new Error('Tipo MIME inválido');
    }

    const fileType = mimeTypeParts[1];

    // Generar un nombre de archivo único
    const hash = crypto.createHash('md5').update(base64Data || '').digest('hex');
    const fileName = `${hash}.${fileType}`;
    const filePath = path.join(directory, fileName);

    // Asegurarnos de que el directorio existe
    await fs.mkdir(directory, { recursive: true });

    // Guardar la imagen
    await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));

    console.log(`Imagen guardada como: ${filePath}`);
    return `/images/${fileName}`;
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return base64String;
  }
}
