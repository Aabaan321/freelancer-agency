import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import aabaanImg from '../assets/aabaan.jpeg';

export default function AiService() {
  const { t } = useTranslation();

  const blocks = [
    {
      tag: t('aiService.block1Tag'),
      title: t('aiService.block1Title'),
      body: t('aiService.block1Body'),
      bullets: t('aiService.block1Bullets', { returnObjects: true }) || [],
    },
    {
      tag: t('aiService.block2Tag'),
      title: t('aiService.block2Title'),
      body: t('aiService.block2Body'),
      bullets: t('aiService.block2Bullets', { returnObjects: true }) || [],
    },
    {
      tag: t('aiService.block3Tag'),
      title: t('aiService.block3Title'),
      body: t('aiService.block3Body'),
      bullets: t('aiService.block3Bullets', { returnObjects: true }) || [],
    },
    {
      tag: t('aiService.block4Tag'),
      title: t('aiService.block4Title'),
      body: t('aiService.block4Body'),
      bullets: t('aiService.block4Bullets', { returnObjects: true }) || [],
    }
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">AI & Automation</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('aiService.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p>{t('aiService.heroSubtitle')}</p></FadeIn>
          <div className="breadcrumb">
            <Link to="/">{t('nav.home')}</Link> <span>/</span> <Link to="/services">{t('nav.services')}</Link> <span>/</span> <span>AI & Automation</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div style={{ display: 'grid', gap: '80px' }}>
            {blocks.map((block, i) => (
              <FadeIn key={i}>
                <div className="glass-card" style={{ padding: '48px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'var(--gold)', opacity: 0.05, filter: 'blur(80px)', borderRadius: '50%' }}></div>
                  <span className="label" style={{ marginBottom: '16px', display: 'block' }}>{block.tag}</span>
                  <h2 style={{ fontSize: '32px', marginBottom: '24px', maxWidth: '800px' }}>{block.title}</h2>
                  <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '800px' }}>
                    {block.body}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {block.bullets && block.bullets.map((bullet, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <CheckCircle2 size={20} style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '15px' }}>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="glass-card" style={{ marginTop: '80px', padding: '56px', textAlign: 'center', border: '1px solid var(--border-gold)', background: 'linear-gradient(145deg, rgba(8,8,14,0.95) 0%, rgba(20,20,25,0.95) 100%)' }}>
               <div style={{ width: '100px', height: '100px', margin: '0 auto 24px', borderRadius: '50%', padding: '4px', border: '2px solid var(--gold)' }}>
                  <img src={aabaanImg} alt="Aabaan" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
               </div>
               <h3 style={{ fontSize: '28px', color: 'var(--gold-light)', marginBottom: '16px' }}>{t('aiService.specialistTitle')}</h3>
               <p style={{ fontSize: '16px', lineHeight: 1.8, color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 32px' }}>
                  {t('aiService.specialistBody')}
               </p>
               <a href="https://wa.me/971551212310?text=Hi%20Aabaan!%20I'm%20interested%20in%20building%20an%20AI%20system%20for%20my%20business." target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                 {t('aiService.specialistCta')} <ArrowRight size={16} />
               </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
