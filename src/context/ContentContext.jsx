import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize Supabase if both URL and Key are present
let supabase = null;
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (err) {
    console.warn('Error inicializando cliente de Supabase:', err);
  }
}

// Default texts to use as fallback
export const defaultContent = {
  // Cinematic / Hero
  cinematic_stages: [
    { title: 'MAGMA STUDIOS', subtitle: 'Desarrollo Web Premium', desc: 'Las ideas nacen en la superficie.' },
    { title: '', subtitle: 'Tu visión. Nuestra tecnología.', desc: 'Las llevamos más lejos.' },
    { title: '', subtitle: 'Entramos en lo profundo.', desc: 'Donde la creatividad se fusiona con el código.' },
    { title: '', subtitle: 'Construimos desde adentro.', desc: 'Cada pixel tiene propósito. Cada animación, intención.' },
    { title: '', subtitle: 'Forjamos tu presencia digital.', desc: 'Donde la tecnología se convierte en impacto.' }
  ],
  // Nosotros
  about_title1: 'Quiénes',
  about_title2: 'Somos',
  about_subtitle: 'Dos desarrolladores apasionados por hacer que tu negocio brille en la web.',
  about_p1: 'Somos Magma Studios, un equipo de dos desarrolladores web que construye experiencias digitales únicas desde cero. Creemos que cada negocio merece una presencia online tan poderosa como la fuerza que hay detrás de él.',
  about_p2: 'Esta página no es solo nuestra presentación: es una demostración en vivo de lo que somos capaces de hacer. Desde animaciones 3D hasta interfaces minimalistas, nos adaptamos a cada visión.',
  about_p3: 'Personalizamos absolutamente todo — sin plantillas, sin atajos. Solo código hecho a medida para vos.',
  team_name1: '[Tu Nombre]',
  team_role1: 'Co-Founder · Full-Stack Developer',
  team_desc1: 'Especialista en arquitectura web y experiencias interactivas. Convierte ideas complejas en código limpio y eficiente.',
  team_name2: '[Nombre Socio]',
  team_role2: 'Co-Founder · UI/UX Designer',
  team_desc2: 'Domina el diseño visual y las microinteracciones. Hace que cada pixel cuente y cada animación tenga propósito.',
  
  // Servicios
  services_title1: 'Qué',
  services_title2: 'Hacemos',
  services_subtitle: 'Todo lo que tu negocio necesita para dominar el mundo digital.',
  services: [
    { icon: 'Code2', title: 'Desarrollo a Medida', desc: 'Programamos cada sitio desde cero. Sin plantillas, sin límites. Tu visión hecha código.' },
    { icon: 'Palette', title: 'Diseño Personalizado', desc: 'Interfaces modernas y atractivas que capturan la esencia de tu marca y enamoran a tus clientes.' },
    { icon: 'Zap', title: 'Alto Rendimiento', desc: 'Sitios ultrarrápidos optimizados para SEO y velocidad. Cada segundo cuenta.' },
    { icon: 'Smartphone', title: 'Responsive Total', desc: 'Tu web se verá perfecta en cualquier dispositivo — móvil, tablet o desktop.' },
    { icon: 'Globe', title: 'Despliegue & Dominio', desc: 'Nos encargamos de publicar tu sitio, configurar tu dominio y dejarlo listo para el mundo.' },
    { icon: 'Shield', title: 'Soporte Continuo', desc: 'No desaparecemos al entregar. Estamos disponibles para actualizaciones y mejoras.' }
  ],

  // Creaciones
  creations_title1: 'Nuestras',
  creations_title2: 'Creaciones',
  creations_subtitle: 'Explorá los proyectos donde ya hemos encendido la chispa.',
  creations: [
    { title: 'Proyecto Alpha', link: 'https://example.com' },
    { title: 'Proyecto Beta', link: 'https://example.com' },
    { title: 'Proyecto Gamma', link: 'https://example.com' }
  ],

  // Contacto
  contact_title1: 'Encendamos la',
  contact_title2: 'chispa',
  contact_desc: '¿Listo para llevar tu negocio al siguiente nivel? Escribinos y en menos de 24 hs te respondemos con ideas para tu proyecto.',
  contact_instagram1: 'instagram_socio1',
  contact_instagram2: 'instagram_socio2',
  contact_email: 'tu_correo@gmail.com'
};

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      let serverData = null;

      // 1. Intentar cargar desde la API del servidor (/api/content)
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const apiJson = await res.json();
          if (apiJson && Object.keys(apiJson).length > 0 && !apiJson.error) {
            serverData = apiJson;
          }
        }
      } catch {
        // Fallback a archivo estático public/data/content.json si /api falla
        try {
          const staticRes = await fetch('/data/content.json');
          if (staticRes.ok) {
            const staticJson = await staticRes.json();
            if (staticJson && Object.keys(staticJson).length > 0) {
              serverData = staticJson;
            }
          }
        } catch {
          // No hay datos estáticos disponibles
        }
      }

      // 2. Si Supabase está disponible, intentar consultar de forma protegida
      let supaData = null;
      if (supabase) {
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Supabase timeout')), 3000)
          );
          const fetchPromise = supabase.from('site_content').select('*').single();
          const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
          if (!error && data && data.content && Object.keys(data.content).length > 0) {
            supaData = data.content;
          }
        } catch (supaErr) {
          console.warn('Supabase no disponible (usando servidor local/almacenamiento):', supaErr.message || supaErr);
        }
      }

      // 3. Revisar localStorage por si hay cambios en este navegador
      let localData = null;
      try {
        const savedLocal = localStorage.getItem('magma_content');
        if (savedLocal) {
          localData = JSON.parse(savedLocal);
        }
      } catch (localErr) {
        console.warn('Error leyendo localStorage:', localErr);
      }

      // Consolidar fuentes de datos respetando orden de precedencia:
      // defaultContent -> serverData -> supaData -> localData
      const merged = {
        ...defaultContent,
        ...(serverData || {}),
        ...(supaData || {}),
        ...(localData || {})
      };

      setContent(merged);

      // Si localStorage tenía datos que el servidor aún no tenía, sincronizarlos con el servidor
      if (localData && (!serverData || Object.keys(serverData).length === 0)) {
        try {
          await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(merged)
          });
        } catch {
          // No se pudo sincronizar en este intento
        }
      }
    } catch (err) {
      console.error('Error fetching content:', err);
      // Fallback final: intentar recuperar de localStorage
      try {
        const fallbackLocal = localStorage.getItem('magma_content');
        if (fallbackLocal) {
          setContent({ ...defaultContent, ...JSON.parse(fallbackLocal) });
        }
      } catch {
        // Fallback no disponible
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (newContent) => {
    const updated = { ...content, ...newContent };
    setContent(updated);

    // 1. Guardar en localStorage siempre (garantiza persistencia inmediata en el navegador)
    let localSaved = false;
    try {
      localStorage.setItem('magma_content', JSON.stringify(updated));
      localSaved = true;
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }

    // 2. Guardar en el servidor (/api/content) para persistencia en disco
    let serverSaved = false;
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        serverSaved = true;
      }
    } catch (err) {
      console.warn('No se pudo guardar en /api/content:', err);
    }

    // 3. Si Supabase está disponible, guardar también en Supabase
    let supabaseSaved = false;
    if (supabase) {
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Supabase timeout')), 4000)
        );
        const upsertPromise = supabase.from('site_content').upsert({ id: 1, content: updated });
        const { error } = await Promise.race([upsertPromise, timeoutPromise]);
        if (!error) {
          supabaseSaved = true;
        } else {
          console.warn('Error al guardar en Supabase:', error);
        }
      } catch (supaErr) {
        console.warn('Supabase no disponible al guardar:', supaErr.message || supaErr);
      }
    }

    return {
      success: true,
      serverSaved,
      supabaseSaved,
      localSaved
    };
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, defaultContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};
