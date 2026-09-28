import { motion } from 'framer-motion';
import { Code2, Palette, Zap, Smartphone, Globe, Shield, Mail, ExternalLink } from 'lucide-react';
import CinematicScroll from '../components/CinematicScroll';
import { useContent } from '../context/ContentContext';
import '../index.css';

/* ── Custom Instagram SVG ── */
function InstagramIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

/* ── Framer variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const iconMap = {
  Code2: <Code2 className="service-icon" size={32} />,
  Palette: <Palette className="service-icon" size={32} />,
  Zap: <Zap className="service-icon" size={32} />,
  Smartphone: <Smartphone className="service-icon" size={32} />,
  Globe: <Globe className="service-icon" size={32} />,
  Shield: <Shield className="service-icon" size={32} />
};

export default function Landing() {
  const { content } = useContent();

  return (
    <>
      {/* ────── NAVBAR ────── */}
      <nav>
        <a href="#inicio" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpeg" alt="Magma Studios Logo" style={{ height: '40px', width: 'auto', borderRadius: '50%' }} />
          MAGMA<span>.</span>
        </a>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#servicios">Servicios</a>
          {content.creations && content.creations.length > 0 && (
            <a href="#creaciones">Creaciones</a>
          )}
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      {/* ────── CINEMATIC SCROLL EXPERIENCE ────── */}
      <div id="inicio">
        <CinematicScroll />
      </div>

      {/* ────── MAIN CONTENT ────── */}
      <main className="app-content">

        {/* ── ABOUT ── */}
        <section id="nosotros">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-120px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="section-divider" />
              <h2 className="section-title">
                {content.about_title1} <span className="text-gradient">{content.about_title2}</span>
              </h2>
              <p className="section-subtitle">
                {content.about_subtitle}
              </p>
            </motion.div>

            <motion.div className="about-grid" variants={stagger}>
              <motion.div className="about-body glass" variants={fadeUp}>
                <p dangerouslySetInnerHTML={{ __html: content.about_p1.replace('Magma Studios', '<strong>Magma Studios</strong>') }} />
                <p>{content.about_p2}</p>
                <p>{content.about_p3}</p>
              </motion.div>

              <motion.div className="team-stack" variants={stagger}>
                <motion.div className="team-card glass" variants={fadeUp}>
                  <p className="team-card-role">{content.team_role1}</p>
                  <h4 className="team-card-name">{content.team_name1}</h4>
                  <p className="team-card-desc">{content.team_desc1}</p>
                </motion.div>
                <motion.div className="team-card glass" variants={fadeUp}>
                  <p className="team-card-role">{content.team_role2}</p>
                  <h4 className="team-card-name">{content.team_name2}</h4>
                  <p className="team-card-desc">{content.team_desc2}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── SERVICES ── */}
        <section id="servicios">
          <motion.div
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-120px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
              <div className="section-divider" style={{ margin: '0 auto 2rem auto' }} />
              <h2 className="section-title">
                {content.services_title1} <span className="text-gradient">{content.services_title2}</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '0 auto' }}>
                {content.services_subtitle}
              </p>
            </motion.div>

            <motion.div className="services-grid" variants={stagger}>
              {content.services.map((service, i) => (
                <motion.div key={i} className="service-card glass" variants={fadeUp}>
                  {iconMap[service.icon]}
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── CREACIONES ── */}
        {content.creations && content.creations.length > 0 && (
          <section id="creaciones">
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: '-120px' }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                <div className="section-divider" style={{ margin: '0 auto 2rem auto' }} />
                <h2 className="section-title">
                  {content.creations_title1} <span className="text-gradient">{content.creations_title2}</span>
                </h2>
                <p className="section-subtitle" style={{ margin: '0 auto' }}>
                  {content.creations_subtitle}
                </p>
              </motion.div>

              <motion.div className="creations-grid" variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
                {content.creations.map((project, i) => (
                  <motion.div key={i} className="creation-card glass" variants={fadeUp} style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', transition: 'transform 0.3s ease', cursor: 'pointer' }} whileHover={{ y: -10 }}>
                    <h3 style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>{project.title}</h3>
                    <a href={project.link} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', color: 'white', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s ease' }}>
                      Visitar <ExternalLink size={16} />
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </section>
        )}

        {/* ── CONTACT (Magma Core) ── */}
        <section id="contacto" className="contact-section" style={{ maxWidth: '100%', padding: 0, marginTop: '8rem' }}>
          <motion.div
            className="contact-inner"
            initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <div className="section-divider" style={{ margin: '0 auto 2rem auto' }} />
              <h2 className="section-title" style={{ textAlign: 'center' }}>
                {content.contact_title1} <span className="text-gradient">{content.contact_title2}</span>
              </h2>
              <p className="section-subtitle" style={{ margin: '0 auto 4rem auto', textAlign: 'center' }}>
                {content.contact_desc}
              </p>
            </motion.div>

            <motion.div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }} variants={stagger}>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <motion.a href={`https://instagram.com/${content.contact_instagram1}`} target="_blank" rel="noreferrer" className="contact-link" variants={fadeUp}>
                  <InstagramIcon size={20} />
                  @{content.contact_instagram1}
                </motion.a>

                <motion.a href={`https://instagram.com/${content.contact_instagram2}`} target="_blank" rel="noreferrer" className="contact-link" variants={fadeUp}>
                  <InstagramIcon size={20} />
                  @{content.contact_instagram2}
                </motion.a>
              </div>

              <motion.a href={`mailto:${content.contact_email}`} className="contact-link" variants={fadeUp}>
                <Mail size={20} />
                Contactar por Email
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

      </main>

      {/* ────── FOOTER ────── */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">MAGMA<span>.</span></div>
          <p className="footer-tagline">Construyendo el futuro de la web.</p>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Magma Studios. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}
