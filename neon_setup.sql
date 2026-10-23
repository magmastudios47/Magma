-- ==============================================================
-- CONFIGURACIÓN DE TABLA PARA NEON POSTGRESQL (Magma Studios)
-- ==============================================================
-- Esta tabla ya fue creada y configurada automáticamente en Neon.
-- Si necesitas replicarla en otro proyecto de Neon, ejecuta este script en la consola SQL de Neon:

CREATE TABLE IF NOT EXISTS public.site_content (
  id integer PRIMARY KEY DEFAULT 1,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Asegurar que la fila 1 exista con el contenido inicial
INSERT INTO public.site_content (id, content, updated_at)
VALUES (1, '{}'::jsonb, now())
ON CONFLICT (id) DO NOTHING;
