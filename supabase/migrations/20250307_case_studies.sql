-- Crear tabla de case studies
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  description TEXT NOT NULL,
  description2 TEXT,
  tags TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  featured_order INTEGER NOT NULL DEFAULT 999,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índices para búsquedas comunes
CREATE INDEX IF NOT EXISTS case_studies_slug_idx ON case_studies(slug);
CREATE INDEX IF NOT EXISTS case_studies_featured_idx ON case_studies(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS case_studies_status_idx ON case_studies(status);

-- Crear tabla de media items
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  video_type TEXT CHECK (video_type IN ('vimeo', 'local')),
  thumbnail_url TEXT,
  alt TEXT NOT NULL DEFAULT '',
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  display_mode TEXT CHECK (display_mode IN ('single', 'dual', 'dual_left', 'dual_right')),
  case_study_id UUID NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear índice para consultar media items por case study
CREATE INDEX IF NOT EXISTS media_items_case_study_id_idx ON media_items(case_study_id);

-- Crear tabla para registrar actividad de sincronización con Notion
CREATE TABLE IF NOT EXISTS notion_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'error')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear vista para case studies publicados (para consultas frontend)
CREATE OR REPLACE VIEW public_case_studies AS
SELECT 
  id, title, slug, client, description, description2, tags, 
  "order", featured, featured_order, created_at, updated_at
FROM 
  case_studies
WHERE 
  status = 'published';

-- Políticas de seguridad para las tablas (RLS)
-- Estas políticas se pueden ajustar según las necesidades específicas

-- Habilitar RLS
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notion_sync_log ENABLE ROW LEVEL SECURITY;

-- Crear políticas para el acceso a case studies
CREATE POLICY "Public can read published case studies" 
ON case_studies FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users can read all case studies" 
ON case_studies FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert case studies" 
ON case_studies FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update their case studies" 
ON case_studies FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete their case studies" 
ON case_studies FOR DELETE 
TO authenticated
USING (true);

-- Crear políticas para el acceso a media items
CREATE POLICY "Public can read media items for published case studies" 
ON media_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM case_studies 
    WHERE case_studies.id = media_items.case_study_id AND case_studies.status = 'published'
  )
);

CREATE POLICY "Authenticated users can read all media items" 
ON media_items FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert media items" 
ON media_items FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update media items" 
ON media_items FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete media items" 
ON media_items FOR DELETE 
TO authenticated
USING (true);

-- Crear políticas para el acceso a notion_sync_log
CREATE POLICY "Authenticated users can read notion_sync_log" 
ON notion_sync_log FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert notion_sync_log" 
ON notion_sync_log FOR INSERT 
TO authenticated
WITH CHECK (true);
