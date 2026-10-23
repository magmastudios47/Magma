import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// URL de conexión de Neon (soporta variable de entorno en Vercel o conexión directa configurada)
const NEON_URL = process.env.DATABASE_URL 
  || process.env.POSTGRES_URL 
  || 'postgresql://neondb_owner:npg_xOZdjbAt5Mi3@ep-small-breeze-b61vzz3d-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require';

function getStaticFallback() {
  try {
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const publicPath = path.join(process.cwd(), 'public', 'data', 'content.json');
    if (fs.existsSync(contentPath)) {
      return JSON.parse(fs.readFileSync(contentPath, 'utf-8'));
    }
    if (fs.existsSync(publicPath)) {
      return JSON.parse(fs.readFileSync(publicPath, 'utf-8'));
    }
  } catch (e) {
    console.warn('Error leyendo fallback estático:', e);
  }
  return {};
}

export default async function handler(req, res) {
  // Configurar cabeceras CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Obtener el contenido del sitio
  if (req.method === 'GET') {
    try {
      if (NEON_URL) {
        const sql = neon(NEON_URL);
        
        // Asegurar que la tabla y columnas existan
        await sql.query(`
          CREATE TABLE IF NOT EXISTS site_content (
            id integer PRIMARY KEY DEFAULT 1,
            content jsonb NOT NULL DEFAULT '{}'::jsonb,
            updated_at timestamptz DEFAULT now()
          )
        `);

        const rows = await sql.query('SELECT content FROM site_content WHERE id = 1 LIMIT 1');
        if (rows && rows.length > 0 && rows[0].content) {
          const raw = rows[0].content;
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (parsed && Object.keys(parsed).length > 0) {
            return res.status(200).json(parsed);
          }
        }
      }
    } catch (dbErr) {
      console.warn('Fallo al consultar Neon DB en GET, usando fallback estático:', dbErr.message || dbErr);
    }

    // Fallback si la DB no responde o está vacía
    const staticData = getStaticFallback();
    return res.status(200).json(staticData);
  }

  // POST: Guardar el contenido del sitio
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const dataToSave = typeof body === 'string' ? JSON.parse(body) : body;

      if (!dataToSave || typeof dataToSave !== 'object') {
        return res.status(400).json({ error: 'Payload de datos inválido' });
      }

      let savedInDb = false;

      // 1. Guardar permanentemente en Neon PostgreSQL
      if (NEON_URL) {
        try {
          const sql = neon(NEON_URL);
          await sql.query(`
            CREATE TABLE IF NOT EXISTS site_content (
              id integer PRIMARY KEY DEFAULT 1,
              content jsonb NOT NULL DEFAULT '{}'::jsonb,
              updated_at timestamptz DEFAULT now()
            )
          `);

          const jsonStr = JSON.stringify(dataToSave);
          await sql.query(`
            INSERT INTO site_content (id, content, updated_at)
            VALUES (1, $1::jsonb, now())
            ON CONFLICT (id) DO UPDATE SET content = $1::jsonb, updated_at = now()
          `, [jsonStr]);

          savedInDb = true;
        } catch (dbErr) {
          console.error('Error guardando en Neon DB:', dbErr.message || dbErr);
        }
      }

      // 2. Guardar en disco local cuando el entorno lo permite (ej: dev server / node server)
      try {
        const contentPath = path.join(process.cwd(), 'data', 'content.json');
        const publicPath = path.join(process.cwd(), 'public', 'data', 'content.json');
        const dataDir = path.join(process.cwd(), 'data');
        const publicDir = path.join(process.cwd(), 'public', 'data');
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
        const jsonFormatted = JSON.stringify(dataToSave, null, 2);
        fs.writeFileSync(contentPath, jsonFormatted, 'utf-8');
        fs.writeFileSync(publicPath, jsonFormatted, 'utf-8');
      } catch {
        // En Vercel el filesystem es efímero/read-only
      }

      return res.status(200).json({ 
        success: true, 
        savedInDb,
        message: savedInDb ? 'Guardado permanentemente en base de datos Neon' : 'Guardado'
      });
    } catch (err) {
      console.error('Error procesando POST /api/content:', err);
      return res.status(500).json({ error: err.message || 'Error al guardar contenido' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
