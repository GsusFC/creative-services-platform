/**
 * Guía de convenciones de nomenclatura para tipos en el proyecto
 * 
 * Este archivo establece las convenciones de nomenclatura que deben seguirse
 * en todo el proyecto para mantener la consistencia.
 */

/**
 * Convenciones generales:
 * 
 * 1. Usar camelCase para nombres de propiedades en interfaces y tipos
 *    - Correcto: userId, createdAt, mediaItems
 *    - Incorrecto: user_id, created_at, media_items
 * 
 * 2. Usar PascalCase para nombres de interfaces, tipos y enums
 *    - Correcto: UserProfile, MediaItem, ApiResponse
 *    - Incorrecto: userProfile, mediaItem, apiResponse
 * 
 * 3. Usar interfaces para API pública y objetos extensibles
 *    - Ejemplo: export interface UserProfile { ... }
 * 
 * 4. Usar type para uniones, intersecciones y tipos utilitarios
 *    - Ejemplo: export type UserRole = 'admin' | 'editor' | 'viewer';
 * 
 * 5. Prefijos y sufijos:
 *    - Sufijo 'Props' para props de componentes: ButtonProps
 *    - Sufijo 'Response' para respuestas de API: LoginResponse
 *    - Sufijo 'Request' para peticiones a API: UpdateUserRequest
 * 
 * 6. Valores opcionales:
 *    - Usar el operador '?' para propiedades opcionales, no '| undefined'
 *    - Ejemplo: description?: string;  // Correcto
 *    - Ejemplo: description: string | undefined;  // Incorrecto
 * 
 * 7. Valores nulos:
 *    - Usar '| null' solo cuando un valor puede ser explícitamente nulo
 *    - Ejemplo: deletedAt: Date | null;  // Puede ser una fecha o explícitamente null
 * 
 * 8. Enumeraciones:
 *    - Usar PascalCase para el nombre del enum
 *    - Usar UPPER_SNAKE_CASE para los valores del enum
 *    - Ejemplo: enum HttpStatus { OK = 200, NOT_FOUND = 404 }
 * 
 * 9. Tipo 'any':
 *    - Evitar el uso de 'any'. Usar 'unknown' cuando sea necesario
 *    - Implementar type guards para trabajar con 'unknown'
 */

// Exportamos un tipo de ejemplo siguiendo las convenciones
export type NamingConvention = 'camelCase' | 'PascalCase' | 'UPPER_SNAKE_CASE';
