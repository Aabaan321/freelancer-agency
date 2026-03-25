import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

import aabaanImg from '../assets/aabaan.jpeg';
import shubhanImg from '../assets/shubhan.jpeg';

const founders = [
  { name: 'Shubhan Naik', role: 'CEO & Board of Director', tag: 'DEVELOPMENT & LEADERSHIP', initials: 'SN', image: shubhanImg,
    bio: "A full-stack web developer and the acting CEO. Shubhan drives the overall vision while also writing clean, production-ready code alongside the technical team.",
    skills: ['Web Development', 'React', 'Leadership', 'Strategy'] },
  { name: 'Aabaan Rahil Ghaffar', role: 'CTO & Board of Director', tag: 'TECHNICAL ARCHITECTURE', initials: 'AG', image: aabaanImg,
    bio: "Head of the technical team and lead web developer. Aabaan heads the planning strategy, technical architecture, and leadership of all development projects from end to end.",
    skills: ['React', 'Planning Strategy', 'Leadership', 'Full-Stack'] },
  { name: 'Abhay Shetty', role: 'CSO & Board of Director', tag: 'CLIENT RELATIONS & OPS', initials: 'AS', image: null,
    bio: "Handles all client relations, communication, and business development. Abhay ensures every client receives a premium, transparent, and seamless experience.",
    skills: ['Client Relations', 'Sales', 'Strategy', 'Operations'] },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">Our Story</span></FadeIn>
          <FadeIn delay={0.1}><h1>We're Not an Agency. We're Builders.</h1></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>About</span></div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="split">
            <FadeIn direction="left">
              <div>
                <p style={{ fontSize: '18px', lineHeight: 1.8 }}>We started Luxe Studio because we were tired of seeing small businesses overpaying for websites that looked like everyone else's. We're a team of three friends who are obsessed with quality, fairness, and doing work we're actually proud of.</p>
                <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px' }}>We keep our client list small on purpose. We'd rather do 5 things perfectly than 50 things badly.</p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--gold-light)', fontStyle: 'italic', lineHeight: 1.5 }}>"We'd rather do 5 things perfectly than 50 things badly."</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px' }}>— The Founders, Luxe Studio</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>What We Stand For</h2></FadeIn>
          <StaggerContainer className="values-grid">
            {[
              { title: 'Quality Over Volume', desc: 'We limit clients so every project gets our full attention. No rushing, no cutting corners.' },
              { title: 'Radical Transparency', desc: "You always know what we're doing and why. No black boxes, no vague timelines." },
              { title: 'Fair Pricing', desc: 'Premium output should not require a premium price. Great design is a right, not a luxury.' },
            ].map((v, i) => (
              <StaggerItem key={i}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--gold)', marginBottom: '12px' }}>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founders */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '8px' }}>The Founders</h2></FadeIn>
          <FadeIn delay={0.1}><p style={{ textAlign: 'center', marginBottom: '56px' }}>You work with us — not an account manager.</p></FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {founders.map((f, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="glass-card founder-card">
                  {f.image ? (
                    <div className="photo" style={{ padding: 0, overflow: 'hidden' }}>
                      <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div className="photo">{f.initials}</div>
                  )}
                  <div>
                    <h3>{f.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{f.role}</p>
                    <span className="role-tag">{f.tag}</span>
                    <p>{f.bio}</p>
                    <div className="skills">{f.skills.map(s => <span key={s}>{s}</span>)}</div>
                    <a href="#" className="btn btn-outline" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '12px' }}>in LinkedIn</a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>Want to Work With Us?</h2>
            <p>We'd love to hear about your project. Book a free call and let's chat.</p>
            <Link to="/contact" className="btn btn-primary">Book a Free Call <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
