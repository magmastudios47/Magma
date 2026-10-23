import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Eye, EyeOff, Save, Check, ExternalLink, LogOut, RefreshCw, AlertCircle, Plus, Trash2 } from 'lucide-react';

export default function Admin() {
  const { content, updateContent, loading } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('magma_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Local state for editing
  const [formData, setFormData] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Sync formData whenever context content updates
  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() === 'magma' && password === 'Magmamia2001') {
      setIsAuthenticated(true);
      sessionStorage.setItem('magma_admin_auth', 'true');
      setError('');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('magma_admin_auth');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await updateContent(formData);
      setSaveStatus({
        type: 'success',
        message: res.serverSaved
          ? '¡Cambios guardados con éxito en el servidor y en tu navegador!'
          : '¡Cambios guardados con éxito localmente!'
      });
      setTimeout(() => {
        setSaveStatus(null);
      }, 4000);
    } catch (err) {
      console.error('Error al guardar:', err);
      setSaveStatus({
        type: 'error',
        message: 'Hubo un inconveniente al guardar: ' + (err.message || 'Error desconocido')
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const list = formData[arrayName] ? [...formData[arrayName]] : [];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, [arrayName]: list }));
  };

  const addCreation = () => {
    setFormData(prev => ({
      ...prev,
      creations: [...(prev.creations || []), { title: 'Nuevo Proyecto', link: 'https://' }]
    }));
  };
  
  const removeCreation = (index) => {
    setFormData(prev => ({
      ...prev,
      creations: (prev.creations || []).filter((_, i) => i !== index)
    }));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <form onSubmit={handleLogin} className="glass" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ letterSpacing: '3px', margin: '0 0 0.5rem 0', color: 'white' }}>MAGMA ADMIN</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', margin: 0 }}>Panel de Control de Contenidos</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.9rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Usuario</label>
            <input 
              type="text" 
              placeholder="Ingresa tu usuario" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="admin-input"
              autoFocus
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Ingresa tu contraseña" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="admin-input"
                style={{ width: '100%', paddingRight: '2.8rem' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex' }}
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              marginTop: '0.5rem',
              padding: '1rem', 
              background: 'linear-gradient(135deg, #ff4500, #ff7700)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              letterSpacing: '1.5px',
              transition: 'opacity 0.2s'
            }}
          >
            INGRESAR
          </button>
        </form>
      </div>
    );
  }

  const stages = formData.cinematic_stages || [];
  const services = formData.services || [];
  const creations = formData.creations || [];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '2rem 3rem', color: 'white', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Top Navigation & Action Bar */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem', 
        paddingBottom: '1.5rem', 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        paddingTop: '0.5rem'
      }}>
        <div>
          <h2 style={{ margin: 0, letterSpacing: '1px' }}>MAGMA STUDIOS · Panel Admin</h2>
          <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Modifica los textos e información de tu sitio web
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.2rem', 
              background: 'rgba(255,255,255,0.06)', 
              color: 'white', 
              border: '1px solid rgba(255,255,255,0.15)', 
              borderRadius: '6px', 
              textDecoration: 'none', 
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            <ExternalLink size={16} /> Ver Sitio
          </a>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 1.8rem', 
              background: saveStatus?.type === 'success' ? '#10b981' : 'linear-gradient(135deg, #ff4500, #ff7700)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: isSaving ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontSize: '0.95rem',
              boxShadow: '0 4px 15px rgba(255, 69, 0, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {isSaving ? (
              <><RefreshCw size={18} className="spin" /> Guardando...</>
            ) : saveStatus?.type === 'success' ? (
              <><Check size={18} /> Guardado</>
            ) : (
              <><Save size={18} /> Guardar Cambios</>
            )}
          </button>

          <button 
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              padding: '0.75rem 1rem', 
              background: 'transparent', 
              color: 'rgba(255,255,255,0.6)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            <LogOut size={16} /> Salir
          </button>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveStatus && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1rem 1.5rem', 
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem',
          background: saveStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${saveStatus.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: saveStatus.type === 'success' ? '#a7f3d0' : '#fca5a5'
        }}>
          {saveStatus.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 500 }}>{saveStatus.message}</span>
        </div>
      )}

      {loading && (
        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>
          <RefreshCw size={16} className="spin" /> Sincronizando datos con el servidor...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '2rem' }}>
        
        {/* SECTION: INICIO (Cinematic) */}
        <div className="glass admin-card" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3 className="section-header">Textos del Video Inicial (Experiencia Cinematográfica)</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Estos textos aparecen secuencialmente a medida que el usuario hace scroll sobre el video de inicio.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            {stages.map((stage, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ margin: '0 0 0.3rem 0', color: 'var(--orange)', fontSize: '0.95rem' }}>Fase {idx + 1}</h4>
                <input 
                  type="text" 
                  placeholder="Título (opcional)" 
                  value={stage.title || ''} 
                  onChange={e => handleArrayChange('cinematic_stages', idx, 'title', e.target.value)} 
                  className="admin-input" 
                />
                <input 
                  type="text" 
                  placeholder="Subtítulo" 
                  value={stage.subtitle || ''} 
                  onChange={e => handleArrayChange('cinematic_stages', idx, 'subtitle', e.target.value)} 
                  className="admin-input" 
                />
                <textarea 
                  placeholder="Descripción" 
                  value={stage.desc || ''} 
                  onChange={e => handleArrayChange('cinematic_stages', idx, 'desc', e.target.value)} 
                  className="admin-input" 
                  rows="2" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: NOSOTROS */}
        <div className="glass admin-card" style={{ padding: '2rem' }}>
          <h3 className="section-header">Sección: Quiénes Somos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <label className="admin-label">Título principal (Parte 1 y 2)</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" value={formData.about_title1 || ''} onChange={e => handleChange('about_title1', e.target.value)} className="admin-input" placeholder="Quiénes" />
              <input type="text" value={formData.about_title2 || ''} onChange={e => handleChange('about_title2', e.target.value)} className="admin-input" placeholder="Somos" />
            </div>
            
            <label className="admin-label">Subtítulo destacado</label>
            <input type="text" value={formData.about_subtitle || ''} onChange={e => handleChange('about_subtitle', e.target.value)} className="admin-input" />
            
            <label className="admin-label">Párrafos de descripción</label>
            <textarea value={formData.about_p1 || ''} onChange={e => handleChange('about_p1', e.target.value)} className="admin-input" rows="3" placeholder="Párrafo 1" />
            <textarea value={formData.about_p2 || ''} onChange={e => handleChange('about_p2', e.target.value)} className="admin-input" rows="3" placeholder="Párrafo 2" />
            <textarea value={formData.about_p3 || ''} onChange={e => handleChange('about_p3', e.target.value)} className="admin-input" rows="3" placeholder="Párrafo 3" />
          </div>
        </div>

        {/* SECTION: EQUIPO */}
        <div className="glass admin-card" style={{ padding: '2rem' }}>
          <h3 className="section-header">Sección: Nuestro Equipo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h4 style={{ margin: 0, color: 'var(--orange)' }}>Socio 1</h4>
              <input type="text" placeholder="Nombre completo" value={formData.team_name1 || ''} onChange={e => handleChange('team_name1', e.target.value)} className="admin-input" />
              <input type="text" placeholder="Rol / Cargo" value={formData.team_role1 || ''} onChange={e => handleChange('team_role1', e.target.value)} className="admin-input" />
              <textarea placeholder="Descripción personal" value={formData.team_desc1 || ''} onChange={e => handleChange('team_desc1', e.target.value)} className="admin-input" rows="2" />
            </div>
            
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <h4 style={{ margin: 0, color: 'var(--orange)' }}>Socio 2</h4>
              <input type="text" placeholder="Nombre completo" value={formData.team_name2 || ''} onChange={e => handleChange('team_name2', e.target.value)} className="admin-input" />
              <input type="text" placeholder="Rol / Cargo" value={formData.team_role2 || ''} onChange={e => handleChange('team_role2', e.target.value)} className="admin-input" />
              <textarea placeholder="Descripción personal" value={formData.team_desc2 || ''} onChange={e => handleChange('team_desc2', e.target.value)} className="admin-input" rows="2" />
            </div>
          </div>
        </div>

        {/* SECTION: SERVICIOS */}
        <div className="glass admin-card" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3 className="section-header">Sección: Qué Hacemos (Servicios)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Título principal (Parte 1 y 2)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                  <input type="text" value={formData.services_title1 || ''} onChange={e => handleChange('services_title1', e.target.value)} className="admin-input" placeholder="Qué" />
                  <input type="text" value={formData.services_title2 || ''} onChange={e => handleChange('services_title2', e.target.value)} className="admin-input" placeholder="Hacemos" />
                </div>
              </div>
              <div>
                <label className="admin-label">Subtítulo de servicios</label>
                <input type="text" value={formData.services_subtitle || ''} onChange={e => handleChange('services_subtitle', e.target.value)} className="admin-input" style={{ marginTop: '0.3rem' }} />
              </div>
            </div>

            <h4 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--orange)' }}>Tarjetas de Servicios</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {services.map((svc, idx) => (
                <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Ícono: {svc.icon}</span>
                  <input 
                    type="text" 
                    placeholder="Título del Servicio" 
                    value={svc.title || ''} 
                    onChange={e => handleArrayChange('services', idx, 'title', e.target.value)} 
                    className="admin-input" 
                  />
                  <textarea 
                    placeholder="Descripción del Servicio" 
                    value={svc.desc || ''} 
                    onChange={e => handleArrayChange('services', idx, 'desc', e.target.value)} 
                    className="admin-input" 
                    rows="2" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION: CREACIONES */}
        <div className="glass admin-card" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-header" style={{ margin: 0 }}>Sección: Nuestras Creaciones</h3>
            <button 
              onClick={addCreation} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                padding: '0.5rem 1rem', 
                background: 'rgba(255,255,255,0.1)', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <Plus size={16} /> Agregar Proyecto
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
              <div>
                <label className="admin-label">Título (Parte 1 y 2)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                  <input type="text" value={formData.creations_title1 || ''} onChange={e => handleChange('creations_title1', e.target.value)} className="admin-input" placeholder="Nuestras" />
                  <input type="text" value={formData.creations_title2 || ''} onChange={e => handleChange('creations_title2', e.target.value)} className="admin-input" placeholder="Creaciones" />
                </div>
              </div>
              <div>
                <label className="admin-label">Subtítulo</label>
                <input type="text" value={formData.creations_subtitle || ''} onChange={e => handleChange('creations_subtitle', e.target.value)} className="admin-input" style={{ marginTop: '0.3rem' }} />
              </div>
            </div>
            
            <h4 style={{ margin: '1rem 0 0.3rem 0', color: 'var(--orange)' }}>Listado de Proyectos</h4>
            {creations.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No hay proyectos creados. Haz clic en &quot;Agregar Proyecto&quot;.</p>
            ) : (
              creations.map((creation, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Nombre del Proyecto" 
                    value={creation.title || ''} 
                    onChange={e => handleArrayChange('creations', idx, 'title', e.target.value)} 
                    className="admin-input" 
                    style={{ flex: 1 }} 
                  />
                  <input 
                    type="text" 
                    placeholder="URL (https://...)" 
                    value={creation.link || ''} 
                    onChange={e => handleArrayChange('creations', idx, 'link', e.target.value)} 
                    className="admin-input" 
                    style={{ flex: 2 }} 
                  />
                  <button 
                    onClick={() => removeCreation(idx)} 
                    title="Eliminar proyecto"
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      padding: '0.7rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECTION: CONTACTO */}
        <div className="glass admin-card" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3 className="section-header">Sección: Contacto</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="admin-label">Título (Parte 1 y 2)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={formData.contact_title1 || ''} onChange={e => handleChange('contact_title1', e.target.value)} className="admin-input" placeholder="Encendamos la" />
                <input type="text" value={formData.contact_title2 || ''} onChange={e => handleChange('contact_title2', e.target.value)} className="admin-input" placeholder="chispa" />
              </div>
              
              <label className="admin-label">Texto descriptivo de contacto</label>
              <textarea value={formData.contact_desc || ''} onChange={e => handleChange('contact_desc', e.target.value)} className="admin-input" rows="3" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <label className="admin-label">Instagram Socio 1 (usuario sin @)</label>
              <input type="text" value={formData.contact_instagram1 || ''} onChange={e => handleChange('contact_instagram1', e.target.value)} className="admin-input" placeholder="usuario_socio1" />
              
              <label className="admin-label">Instagram Socio 2 (usuario sin @)</label>
              <input type="text" value={formData.contact_instagram2 || ''} onChange={e => handleChange('contact_instagram2', e.target.value)} className="admin-input" placeholder="usuario_socio2" />
              
              <label className="admin-label">Correo electrónico de contacto</label>
              <input type="email" value={formData.contact_email || ''} onChange={e => handleChange('contact_email', e.target.value)} className="admin-input" placeholder="info@magmastudios.com" />
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .admin-card {
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .section-header {
          margin: 0;
          font-size: 1.25rem;
          letter-spacing: 0.5px;
          color: #fff;
        }
        .admin-label {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }
        .admin-input {
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: white;
          border-radius: 6px;
          font-family: inherit;
          font-size: 0.9rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--orange);
          background: rgba(255, 255, 255, 0.07);
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
