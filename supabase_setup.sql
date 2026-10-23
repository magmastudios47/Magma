-- 1. Crea la tabla para almacenar el contenido
CREATE TABLE site_content (
  id integer PRIMARY KEY,
  content jsonb NOT NULL
);

-- 2. Inserta el contenido inicial por defecto (para asegurarnos de que la fila con id 1 exista)
INSERT INTO site_content (id, content)
VALUES (
  1,
  '{}'::jsonb
);

-- 3. Desactiva RLS para que podamos leer y escribir fácilmente desde la web sin autenticación
-- (En un entorno de producción estricto, es mejor usar políticas de seguridad, pero para este caso esto permitirá que funcione directo)
ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
