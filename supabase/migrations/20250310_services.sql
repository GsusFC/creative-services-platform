-- Migración para la funcionalidad Do It Yourself
-- Creación de tablas para categorías y servicios

-- Tabla para categorías de servicios
CREATE TABLE IF NOT EXISTS service_categories (
  id VARCHAR PRIMARY KEY, -- ID tipo 'strategy', 'branding', etc.
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para servicios individuales
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR PRIMARY KEY, -- ID tipo 'strategy-brand', 'digital-web', etc.
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id VARCHAR NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para guardar presupuestos
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR UNIQUE NOT NULL, -- Código único de presupuesto (ej: P123456789)
  client_name VARCHAR NOT NULL,
  client_email VARCHAR NOT NULL,
  client_phone VARCHAR,
  client_company VARCHAR,
  project_description TEXT,
  project_timeline VARCHAR, -- 'urgent', 'short', 'medium', 'flexible'
  contact_preference VARCHAR, -- 'email', 'phone', 'videocall', 'meeting'
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para servicios incluidos en un presupuesto (relación muchos a muchos)
CREATE TABLE IF NOT EXISTS budget_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  service_id VARCHAR NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  service_name VARCHAR NOT NULL, -- Guardamos el nombre por si cambia en el futuro
  service_description TEXT, -- Guardamos la descripción por si cambia
  price DECIMAL(10, 2) NOT NULL, -- Guardamos el precio aplicado (puede tener descuento)
  notes TEXT, -- Notas específicas para este servicio en este presupuesto
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicamos el trigger a todas las tablas
CREATE TRIGGER update_service_categories_modtime
BEFORE UPDATE ON service_categories
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_services_modtime
BEFORE UPDATE ON services
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_budgets_modtime
BEFORE UPDATE ON budgets
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Datos iniciales para categorías
INSERT INTO service_categories (id, name, description, icon, order_num)
VALUES
  ('strategy', 'Estrategia', 'Planificación estratégica y consultoría de marca', 'trending-up', 10),
  ('branding', 'Branding', 'Servicios de identidad visual y diseño de marca', 'palette', 20),
  ('digital', 'Digital Product', 'Diseño y desarrollo de productos digitales', 'code', 30),
  ('motion', 'Motion', 'Animación y efectos visuales para video', 'video', 40)
ON CONFLICT (id) DO NOTHING;

-- Datos iniciales para servicios
INSERT INTO services (id, name, description, price, category_id, order_num)
VALUES
  -- Estrategia
  ('strategy-brand', 'Estrategia de Marca', 'Definición de posicionamiento, valores y propuesta de valor única para tu marca.', 2500, 'strategy', 10),
  ('strategy-research', 'Investigación', 'Análisis de mercado, competencia y audiencia para fundamentar decisiones estratégicas.', 1800, 'strategy', 20),
  ('strategy-naming', 'Naming', 'Creación de nombre para tu marca, producto o servicio con estudio de disponibilidad.', 950, 'strategy', 30),

  -- Branding
  ('branding-identity', 'Identidad Visual', 'Sistema visual completo con logo, colores, tipografía y elementos gráficos.', 3200, 'branding', 10),
  ('branding-logo', 'Logo Design', 'Diseño de símbolo visual que representa la esencia de tu marca.', 1200, 'branding', 20),
  ('branding-guidelines', 'Brand Guidelines', 'Manual de uso y aplicación de todos los elementos de identidad visual.', 800, 'branding', 30),

  -- Digital Product
  ('digital-ux', 'UX Design', 'Diseño de experiencia de usuario para productos digitales centrados en el usuario.', 2600, 'digital', 10),
  ('digital-ui', 'UI Design', 'Interfaz visual atractiva y funcional para aplicaciones web o móviles.', 2200, 'digital', 20),
  ('digital-web', 'Web Development', 'Desarrollo frontend y backend para sitios web y aplicaciones.', 4500, 'digital', 30),
  ('digital-mobile', 'App Design', 'Diseño y prototipado de aplicaciones móviles nativas o híbridas.', 3800, 'digital', 40),

  -- Motion
  ('motion-animation', 'Motion Graphics', 'Animación de gráficos y elementos visuales para dar vida a tu marca.', 1800, 'motion', 10),
  ('motion-video', 'Video Editing', 'Edición profesional de material audiovisual con corrección de color.', 1500, 'motion', 20),
  ('motion-3d', '3D Animation', 'Modelado y animación tridimensional para proyectos de alto impacto visual.', 3500, 'motion', 30)
ON CONFLICT (id) DO NOTHING;
