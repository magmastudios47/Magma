import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Default texts to use as fallback
const defaultContent = {
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
  contact_title2: 'chispa', // Replaced "Hagamos que erupcione"
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

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      if (supabase) {
        // Fetch from Supabase
        const { data, error } = await supabase.from('site_content').select('*').single();
        if (data) {
          setContent({ ...defaultContent, ...data.content });
        }
      } else {
        // Fallback to localStorage if no Supabase keys
        const localData = localStorage.getItem('magma_content');
        if (localData) {
          setContent({ ...defaultContent, ...JSON.parse(localData) });
        }
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent) => {
    const updated = { ...content, ...newContent };
    setContent(updated);
    
    if (supabase) {
      // Upsert to Supabase
      await supabase.from('site_content').upsert({ id: 1, content: updated });
    } else {
      // Fallback to localStorage
      localStorage.setItem('magma_content', JSON.stringify(updated));
    }
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, defaultContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};
