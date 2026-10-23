-- ==============================================================
-- CONFIGURACIÓN DE TABLA PARA SUPABASE (Magma Studios)
-- ==============================================================
-- Ejecuta este script en el SQL Editor del panel de Supabase.

-- 1. Eliminar la tabla anterior si tenía columnas incorrectas
-- DROP TABLE IF EXISTS public.site_content;

-- 2. Crea la tabla con la estructura correcta (id numérico y columna content de tipo JSONB)
CREATE TABLE IF NOT EXISTS public.site_content (
  id integer PRIMARY KEY DEFAULT 1,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- 3. Desactivar RLS (Row Level Security) para permitir lectura/escritura pública del panel admin
ALTER TABLE public.site_content DISABLE ROW LEVEL SECURITY;

-- 4. Otorgar permisos de lectura y escritura para los roles anónimos y autenticados
GRANT ALL ON TABLE public.site_content TO anon, authenticated, service_role;

-- 5. Insertar la fila inicial por defecto con id = 1
INSERT INTO public.site_content (id, content, updated_at)
VALUES (1, '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;
