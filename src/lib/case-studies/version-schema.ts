import mongoose, { Schema, Document } from 'mongoose';
import { CaseStudyDataV4 } from './mapper-utils';

// Interfaz para la versión de un caso de estudio
export interface CaseStudyVersion {
  versionId: string;
  caseStudyId: string;
  versionNumber: number;
  createdAt: string;
  createdBy?: string;
  data: CaseStudyDataV4;
  comment?: string;
}

// Interfaz para el documento de Mongoose
export interface CaseStudyVersionDocument extends Omit<CaseStudyVersion, 'data'>, Document {
  data: CaseStudyDataV4;
}

// Esquema para las versiones de casos de estudio
const CaseStudyVersionSchema = new Schema<CaseStudyVersionDocument>({
  versionId: { type: String, required: true, unique: true },
  caseStudyId: { type: String, required: true, index: true },
  versionNumber: { type: Number, required: true },
  createdAt: { type: String, required: true },
  createdBy: { type: String },
  data: { type: Schema.Types.Mixed, required: true },
  comment: { type: String }
}, {
  timestamps: false,
  toJSON: {
    transform(_, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índice compuesto para buscar por caseStudyId y versionNumber
CaseStudyVersionSchema.index({ caseStudyId: 1, versionNumber: 1 }, { unique: true });

// Modelo para las versiones de casos de estudio
export const CaseStudyVersionModel = mongoose.models.CaseStudyVersion || 
  mongoose.model<CaseStudyVersionDocument>('CaseStudyVersion', CaseStudyVersionSchema);
