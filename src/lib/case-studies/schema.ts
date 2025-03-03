import mongoose, { Schema, Document } from 'mongoose';
import { CaseStudyDataV4 } from './mapper-utils';

// Extender la interfaz CaseStudyDataV4 para incluir métodos de documento de Mongoose
// Omitimos 'id' para evitar conflictos entre CaseStudyDataV4 y Document
export interface CaseStudyDocument extends Omit<CaseStudyDataV4, 'id'>, Document {}

// Crear el esquema de Mongoose basado en la interfaz CaseStudyDataV4
const CaseStudySchema = new Schema<CaseStudyDocument>(
  {
    // Metadatos y gestión
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    published: { type: Boolean, default: false },
    
    // Sección HERO
    hero_image: { type: String, required: true },
    
    // Sección MAIN_INFO
    project_name: { type: String, required: true },
    tagline: { type: String },
    description: { type: String, required: true },
    services: { type: [String] },
    client_name: { type: String },
    client_logo: { type: String },
    
    // Sección GALLERY
    gallery: { type: [String] },
    
    // Categorización
    category: { type: String },
    tags: { type: [String] },
    
    // Información adicional
    challenge: { type: String },
    solution: { type: String },
    results: { type: [String] },
    
    // SEO
    seo_title: { type: String },
    seo_description: { type: String },
    seo_keywords: { type: [String] }
  },
  {
    timestamps: true, // Esto añadirá automáticamente createdAt y updatedAt
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Middleware pre-save para actualizar el campo updated_at
CaseStudySchema.pre('save', function(next) {
  this.updated_at = new Date().toISOString();
  next();
});

// Crear y exportar el modelo
export const CaseStudyModel = mongoose.models.CaseStudy || 
  mongoose.model<CaseStudyDocument>('CaseStudy', CaseStudySchema);
