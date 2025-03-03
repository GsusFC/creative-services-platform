import mongoose from 'mongoose';

// Declarar una variable global para la conexión
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Inicializar la variable global si no existe
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Función para conectar a MongoDB
 * Utiliza una conexión global para evitar múltiples conexiones durante el desarrollo
 */
export async function connectToDatabase() {
  // Si ya estamos conectados, devolver la conexión existente
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Si no hay una promesa de conexión en curso, crear una nueva
  if (!global.mongoose.promise) {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creative-services';

    // Opciones de conexión
    const options = {
      bufferCommands: false,
    };

    // Iniciar la conexión
    global.mongoose.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    // Esperar a que se complete la conexión
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    // En caso de error, limpiar la promesa para intentar de nuevo en la próxima llamada
    global.mongoose.promise = null;
    throw error;
  }
}
