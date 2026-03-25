import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';
import aabaanImg from '../assets/aabaan.jpeg';
import shubhanImg from '../assets/shubhan.jpeg';
import abhayImg from '../assets/abhay.jpeg';

export default function About() {
  const { t } = useTranslation();

  const founders = [
    { name: t('about.founder1Name'), role: t('about.founder1Role'), tag: t('about.founder1Tag'), bio: t('about.founder1Bio'), image: shubhanImg, skills: ['Full-Stack Developer', 'Frontend UI/UX', 'Business Strategy', 'Team Leadership'] },
    { name: t('about.founder2Name'), role: t('about.founder2Role'), tag: t('about.founder2Tag'), bio: t('about.founder2Bio'), image: aabaanImg, skills: ['Full-Stack Developer', 'System Architecture', 'Technical Strategy', 'Project Planning'] },
    { name: t('about.founder3Name'), role: t('about.founder3Role'), tag: t('about.founder3Tag'), bio: t('about.founder3Bio'), image: abhayImg, skills: ['Client Relations', 'Sales', 'Strategy', 'Operations'] },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">{t('about.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('about.heroTitle')}</h1></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.about')}</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <FadeIn direction="left">
              <div>
                <p style={{ fontSize: '18px', lineHeight: 1.8 }}>{t('about.storyP1')}</p>
                <p style={{ fontSize: '18px', lineHeight: 1.8, marginTop: '20px' }}>{t('about.storyP2')}</p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <div className="glass-card" style={{ padding: '48px 36px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--gold-light)', fontStyle: 'italic', lineHeight: 1.5 }}>{t('about.quote')}</p>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px' }}>{t('about.quoteAttrib')}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('about.valuesTitle')}</h2></FadeIn>
          <StaggerContainer className="values-grid">
            {[
              { title: t('about.value1Title'), desc: t('about.value1Desc') },
              { title: t('about.value2Title'), desc: t('about.value2Desc') },
              { title: t('about.value3Title'), desc: t('about.value3Desc') },
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

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '8px' }}>{t('about.foundersTitle')}</h2></FadeIn>
          <FadeIn delay={0.1}><p style={{ textAlign: 'center', marginBottom: '56px' }}>{t('about.foundersSubtitle')}</p></FadeIn>
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
                    <a href="#" className="btn btn-outline" style={{ marginTop: '16px', padding: '8px 16px', fontSize: '12px' }}>{t('about.linkedin')}</a>
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
            <h2>{t('about.ctaTitle')}</h2>
            <p>{t('about.ctaDesc')}</p>
            <Link to="/contact" className="btn btn-primary">{t('about.bookFreeCall')} <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
