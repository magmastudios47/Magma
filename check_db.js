import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Cargar variables de entorno desde .env si no existen en process.env
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
        supabaseUrl = trimmed.substring('VITE_SUPABASE_URL='.length).trim();
      }
      if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
        supabaseKey = trimmed.substring('VITE_SUPABASE_ANON_KEY='.length).trim();
      }
    });
  }
}

console.log('=== Verificación de Conexión a Base de Datos (Supabase) ===');
console.log('URL de Supabase:', supabaseUrl || '(No configurada)');
console.log('Key:', supabaseKey ? supabaseKey.substring(0, 15) + '...' : '(No configurada)');

if (!supabaseUrl || !supabaseKey) {
  console.log('\n[AVISO] No se encontraron las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.');
  console.log('El sistema usará el servidor local y almacenamiento JSON (data/content.json).\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    console.log('\nConsultando tabla "site_content"...');
    const { data: readData, error: readError } = await supabase.from('site_content').select('*');
    
    if (readError) {
      console.log('Resultado: Error al leer la tabla:', readError.message || readError);
      return;
    }

    console.log('Datos leídos correctamente:', JSON.stringify(readData));

    if (!readData || readData.length === 0) {
      console.log('La tabla está vacía. Insertando fila inicial con id = 1...');
      const { data: insertData, error: insertError } = await supabase.from('site_content').upsert({ id: 1, content: {} }).select();
      if (insertError) {
        console.log('Error insertando fila inicial:', insertError.message || insertError);
      } else {
        console.log('Fila inicial insertada con éxito:', JSON.stringify(insertData));
      }
    } else {
      console.log('¡Conexión y tabla verificadas correctamente!');
    }
  } catch (err) {
    console.log('\n[ERROR DE RED O CONEXIÓN]');
    console.log('No se pudo conectar con el servidor de Supabase:', err.message || err);
    console.log('Posible causa: El proyecto de Supabase está pausado, la URL es incorrecta o no hay conexión.');
    console.log('La web continuará funcionando con el servidor local y localStorage de forma automática.');
  }
}

check();
