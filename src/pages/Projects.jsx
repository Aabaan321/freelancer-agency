import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';

export default function Projects() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const projects = [
    { id: 1, title: t('projects.proj1Title'), category: 'Websites', desc: t('projects.proj1Desc'), challenge: t('projects.proj1Challenge'), solution: t('projects.proj1Solution'), results: t('projects.proj1Results'), tech: ['React', 'Framer Motion', 'Vercel'] },
    { id: 2, title: t('projects.proj2Title'), category: 'Websites', desc: t('projects.proj2Desc'), challenge: t('projects.proj2Challenge'), solution: t('projects.proj2Solution'), results: t('projects.proj2Results'), tech: ['Next.js', 'Tailwind', 'Calendly'] },
    { id: 3, title: t('projects.proj3Title'), category: 'Branding', desc: t('projects.proj3Desc'), challenge: t('projects.proj3Challenge'), solution: t('projects.proj3Solution'), results: t('projects.proj3Results'), tech: ['Figma', 'Shopify', 'Instagram'] },
    { id: 4, title: t('projects.proj4Title'), category: 'Websites', desc: t('projects.proj4Desc'), challenge: t('projects.proj4Challenge'), solution: t('projects.proj4Solution'), results: t('projects.proj4Results'), tech: ['React', 'Three.js', 'Vercel'] },
    { id: 5, title: t('projects.proj5Title'), category: 'Websites', desc: t('projects.proj5Desc'), challenge: t('projects.proj5Challenge'), solution: t('projects.proj5Solution'), results: t('projects.proj5Results'), tech: ['Next.js', 'Tailwind', 'Cal.com'] },
    { id: 6, title: t('projects.proj6Title'), category: 'Marketing', desc: t('projects.proj6Desc'), challenge: t('projects.proj6Challenge'), solution: t('projects.proj6Solution'), results: t('projects.proj6Results'), tech: ['React', 'Google Ads', 'SEO'] },
  ];

  const filters = [t('projects.all'), t('projects.websites'), t('projects.branding'), t('projects.marketing')];
  const filterMap = { [t('projects.all')]: 'All', [t('projects.websites')]: 'Websites', [t('projects.branding')]: 'Branding', [t('projects.marketing')]: 'Marketing' };
  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">{t('projects.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('projects.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p>{t('projects.heroSubtitle')}</p></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.projects')}</span></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <FadeIn>
            <div className="filter-tabs">
              {filters.map(f => (
                <button key={f} className={`filter-tab${(filterMap[f] || f) === filter ? ' active' : ''}`} onClick={() => setFilter(filterMap[f] || f)}>{f}</button>
              ))}
            </div>
          </FadeIn>

          <StaggerContainer className="projects-grid">
            {filtered.map((p) => (
              <StaggerItem key={p.id}>
                <div className="glass-card project-card" onClick={() => setSelected(p)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="image-placeholder">
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('projects.projectPreview')}</span>
                  </div>
                  <div className="card-body">
                    <div className="category">{p.category}</div>
                    <h3>{p.title}</h3>
                    <p style={{ fontSize: '14px' }}>{p.desc}</p>
                    <span className="card-link">{t('projects.viewCaseStudy')} <ArrowRight size={14} /></span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={24} /></button>
              <span className="label" style={{ marginBottom: '8px', display: 'block' }}>{selected.category}</span>
              <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>{selected.title}</h2>
              <div style={{ background: 'var(--surface)', borderRadius: '12px', aspectRatio: '16/9', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t('projects.projectMockup')}</span>
              </div>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>{t('projects.theChallenge')}</h3><p>{selected.challenge}</p></div>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>{t('projects.ourSolution')}</h3><p>{selected.solution}</p></div>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>{t('projects.results')}</h3><p>{selected.results}</p></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '24px 0' }}>
                {selected.tech.map(tg => <span key={tg} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{tg}</span>)}
              </div>
              <Link to="/contact" className="btn btn-primary" onClick={() => setSelected(null)}>{t('projects.bookSimilar')} <ArrowRight size={14} /></Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
