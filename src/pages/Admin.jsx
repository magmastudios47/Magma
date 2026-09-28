import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Eye, EyeOff, Save, Check } from 'lucide-react';

export default function Admin() {
  const { content, updateContent } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Local state for editing to avoid constant re-renders during typing
  const [formData, setFormData] = useState(content);
  const [isSaved, setIsSaved] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'magma' && password === 'Magmamia2001') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleSave = () => {
    updateContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Helper for array modifications (like creations)
  const handleArrayChange = (arrayName, index, field, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addCreation = () => {
    setFormData(prev => ({
      ...prev,
      creations: [...prev.creations, { title: 'Nuevo Proyecto', link: 'https://' }]
    }));
  };
  
  const removeCreation = (index) => {
    setFormData(prev => ({
      ...prev,
      creations: prev.creations.filter((_, i) => i !== index)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} className="glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', letterSpacing: '2px' }}>MAGMA ADMIN</h2>
          {error && <p style={{ color: 'var(--orange)', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}
          
          <input 
            type="text" 
            placeholder="Usuario" 
            value={username} 
            onChange={e => setUsername(e.target.value)}
            style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
          />
          
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              placeholder="Contraseña" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', paddingRight: '2.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px' }}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" style={{ padding: '1rem', background: 'var(--orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}>
            INGRESAR
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '2rem 5rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h2>Panel de Control</h2>
        <button 
          onClick={handleSave}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: isSaved ? '#10b981' : 'var(--orange)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSaved ? <><Check size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* SECTION: INICIO (Cinematic) */}
        <div className="glass" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3>Textos del Video Inicial</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            {formData.cinematic_stages.map((stage, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '4px' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--orange)' }}>Fase {idx + 1}</h4>
                <input type="text" placeholder="Título" value={stage.title} onChange={e => handleArrayChange('cinematic_stages', idx, 'title', e.target.value)} className="admin-input" />
                <input type="text" placeholder="Subtítulo" value={stage.subtitle} onChange={e => handleArrayChange('cinematic_stages', idx, 'subtitle', e.target.value)} className="admin-input" />
                <textarea placeholder="Descripción" value={stage.desc} onChange={e => handleArrayChange('cinematic_stages', idx, 'desc', e.target.value)} className="admin-input" rows="2" />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: NOSOTROS */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Sección: Nosotros</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <label>Título (Parte 1 y 2)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={formData.about_title1} onChange={e => handleChange('about_title1', e.target.value)} className="admin-input" />
              <input type="text" value={formData.about_title2} onChange={e => handleChange('about_title2', e.target.value)} className="admin-input" />
            </div>
            
            <label>Subtítulo</label>
            <input type="text" value={formData.about_subtitle} onChange={e => handleChange('about_subtitle', e.target.value)} className="admin-input" />
            
            <label>Párrafos de descripción</label>
            <textarea value={formData.about_p1} onChange={e => handleChange('about_p1', e.target.value)} className="admin-input" rows="3" />
            <textarea value={formData.about_p2} onChange={e => handleChange('about_p2', e.target.value)} className="admin-input" rows="3" />
            <textarea value={formData.about_p3} onChange={e => handleChange('about_p3', e.target.value)} className="admin-input" rows="3" />
          </div>
        </div>

        {/* SECTION: EQUIPO */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Equipo (Tarjetas)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <h4>Socio 1</h4>
            <input type="text" placeholder="Nombre" value={formData.team_name1} onChange={e => handleChange('team_name1', e.target.value)} className="admin-input" />
            <input type="text" placeholder="Rol" value={formData.team_role1} onChange={e => handleChange('team_role1', e.target.value)} className="admin-input" />
            <textarea placeholder="Descripción" value={formData.team_desc1} onChange={e => handleChange('team_desc1', e.target.value)} className="admin-input" rows="2" />
            
            <h4 style={{ marginTop: '1rem' }}>Socio 2</h4>
            <input type="text" placeholder="Nombre" value={formData.team_name2} onChange={e => handleChange('team_name2', e.target.value)} className="admin-input" />
            <input type="text" placeholder="Rol" value={formData.team_role2} onChange={e => handleChange('team_role2', e.target.value)} className="admin-input" />
            <textarea placeholder="Descripción" value={formData.team_desc2} onChange={e => handleChange('team_desc2', e.target.value)} className="admin-input" rows="2" />
          </div>
        </div>

        {/* SECTION: CREACIONES */}
        <div className="glass" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3>Sección: Nuestras Creaciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={formData.creations_title1} onChange={e => handleChange('creations_title1', e.target.value)} className="admin-input" />
              <input type="text" value={formData.creations_title2} onChange={e => handleChange('creations_title2', e.target.value)} className="admin-input" />
            </div>
            <input type="text" value={formData.creations_subtitle} onChange={e => handleChange('creations_subtitle', e.target.value)} className="admin-input" />
            
            <h4 style={{ marginTop: '1rem' }}>Proyectos</h4>
            {formData.creations.map((creation, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input type="text" placeholder="Título" value={creation.title} onChange={e => handleArrayChange('creations', idx, 'title', e.target.value)} className="admin-input" style={{ flex: 1 }} />
                <input type="text" placeholder="Link" value={creation.link} onChange={e => handleArrayChange('creations', idx, 'link', e.target.value)} className="admin-input" style={{ flex: 2 }} />
                <button onClick={() => removeCreation(idx)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>Eliminar</button>
              </div>
            ))}
            <button onClick={addCreation} style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Agregar Proyecto</button>
          </div>
        </div>

        {/* SECTION: CONTACTO */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3>Sección: Contacto</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <label>Título (Parte 1 y 2)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={formData.contact_title1} onChange={e => handleChange('contact_title1', e.target.value)} className="admin-input" />
              <input type="text" value={formData.contact_title2} onChange={e => handleChange('contact_title2', e.target.value)} className="admin-input" />
            </div>
            
            <label>Descripción</label>
            <textarea value={formData.contact_desc} onChange={e => handleChange('contact_desc', e.target.value)} className="admin-input" rows="3" />
            
            <label>Instagram Socio 1 (usuario sin @)</label>
            <input type="text" value={formData.contact_instagram1 || ''} onChange={e => handleChange('contact_instagram1', e.target.value)} className="admin-input" />
            
            <label>Instagram Socio 2 (usuario sin @)</label>
            <input type="text" value={formData.contact_instagram2 || ''} onChange={e => handleChange('contact_instagram2', e.target.value)} className="admin-input" />
            
            <label>Email</label>
            <input type="email" value={formData.contact_email} onChange={e => handleChange('contact_email', e.target.value)} className="admin-input" />
          </div>
        </div>

      </div>

      <style>{`
        .admin-input {
          padding: 0.8rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          border-radius: 4px;
          font-family: inherit;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--orange);
        }
      `}</style>
    </div>
  );
}
