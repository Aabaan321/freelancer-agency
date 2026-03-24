import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

const projects = [
  { id: 1, title: 'Restaurant Website Redesign', category: 'Websites', desc: 'A complete redesign for a high-end Dubai restaurant, focused on reservations and menu experience.',
    challenge: 'The old site was slow, outdated, and had no online reservation system.', solution: 'Built a custom React site with integrated booking, animated menu, and mobile-first design.',
    results: '3x more online reservations in the first month.', tech: ['React', 'Framer Motion', 'Vercel'] },
  { id: 2, title: 'Real Estate Landing Page', category: 'Websites', desc: 'High-converting landing page for a luxury property developer in Dubai Marina.',
    challenge: 'Needed a premium page that conveyed luxury and captured leads effectively.', solution: 'Designed a cinematic hero section with property showcases and embedded inquiry forms.',
    results: '45% conversion rate on lead form.', tech: ['Next.js', 'Tailwind', 'Calendly'] },
  { id: 3, title: 'Boutique Fashion Brand', category: 'Branding', desc: 'Full brand identity and e-commerce website for a local fashion startup.',
    challenge: 'No existing brand identity — needed everything from logo to full web presence.', solution: 'Created complete brand guidelines, packaging design, and a Shopify-integrated website.',
    results: 'Launched to 500+ followers in week one.', tech: ['Figma', 'Shopify', 'Instagram'] },
  { id: 4, title: 'Tech Startup Homepage', category: 'Websites', desc: 'SaaS homepage for an AI-powered productivity tool launching in the UAE.',
    challenge: 'Complex product that needed to be explained simply and beautifully.', solution: 'Built an interactive product demo section with animated feature breakdowns.',
    results: '2,000 waitlist signups in 3 weeks.', tech: ['React', 'Three.js', 'Vercel'] },
  { id: 5, title: 'Medical Clinic Website', category: 'Websites', desc: 'Professional website for a multi-speciality clinic with online appointment booking.',
    challenge: 'Patients found it hard to book appointments and find doctor information.', solution: 'Clean, accessible design with doctor profiles, service pages, and booking integration.',
    results: '60% reduction in phone booking calls.', tech: ['Next.js', 'Tailwind', 'Cal.com'] },
  { id: 6, title: 'Local Gym Website', category: 'Marketing', desc: 'Website and digital marketing package for a boutique fitness studio.',
    challenge: 'Great facility but zero online presence and no lead generation.', solution: 'Built a vibrant website with class schedules, trainer profiles, and a Google Ads strategy.',
    results: '80 new members in the first 2 months.', tech: ['React', 'Google Ads', 'SEO'] },
];

const filters = ['All', 'Websites', 'Branding', 'Marketing'];

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">Portfolio</span></FadeIn>
          <FadeIn delay={0.1}><h1>Our Work</h1></FadeIn>
          <FadeIn delay={0.2}><p>Real projects. Real results. See what we've built for our clients.</p></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Projects</span></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <FadeIn>
            <div className="filter-tabs">
              {filters.map(f => (
                <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </FadeIn>

          <StaggerContainer className="projects-grid">
            {filtered.map((p) => (
              <StaggerItem key={p.id}>
                <div className="glass-card project-card" onClick={() => setSelected(p)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="image-placeholder">
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Project Preview</span>
                  </div>
                  <div className="card-body">
                    <div className="category">{p.category}</div>
                    <h3>{p.title}</h3>
                    <p style={{ fontSize: '14px' }}>{p.desc}</p>
                    <span className="card-link">View Case Study <ArrowRight size={14} /></span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)}><X size={24} /></button>
              <span className="label" style={{ marginBottom: '8px', display: 'block' }}>{selected.category}</span>
              <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>{selected.title}</h2>
              <div style={{ background: 'var(--surface)', borderRadius: '12px', aspectRatio: '16/9', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Project Mockup</span>
              </div>
              <div style={{ display: 'grid', gap: '24px' }}>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>The Challenge</h3><p>{selected.challenge}</p></div>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>Our Solution</h3><p>{selected.solution}</p></div>
                <div><h3 style={{ color: 'var(--gold)', fontSize: '16px', marginBottom: '8px' }}>Results</h3><p>{selected.results}</p></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '24px 0' }}>
                {selected.tech.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{t}</span>)}
              </div>
              <Link to="/contact" className="btn btn-primary" onClick={() => setSelected(null)}>Book a Similar Project <ArrowRight size={14} /></Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
