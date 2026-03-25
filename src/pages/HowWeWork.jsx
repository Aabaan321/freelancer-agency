import { Link } from 'react-router-dom';
import { Phone, Map, PenTool, Code, CheckCircle, Rocket, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';

const tools = ['Figma', 'React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'GitHub', 'Notion', 'Google Analytics', 'Calendly'];

export default function HowWeWork() {
  const { t } = useTranslation();

  const steps = [
    { num: t('howWeWork.step1Num'), icon: <Phone size={24} />, title: t('howWeWork.step1Title'), day: t('howWeWork.step1Day'), duration: t('howWeWork.step1Duration'), body: t('howWeWork.step1Body'), deliverables: t('howWeWork.step1Deliverables') },
    { num: t('howWeWork.step2Num'), icon: <Map size={24} />, title: t('howWeWork.step2Title'), day: t('howWeWork.step2Day'), duration: t('howWeWork.step2Duration'), body: t('howWeWork.step2Body'), deliverables: t('howWeWork.step2Deliverables') },
    { num: t('howWeWork.step3Num'), icon: <PenTool size={24} />, title: t('howWeWork.step3Title'), day: t('howWeWork.step3Day'), duration: t('howWeWork.step3Duration'), body: t('howWeWork.step3Body'), deliverables: t('howWeWork.step3Deliverables') },
    { num: t('howWeWork.step4Num'), icon: <Code size={24} />, title: t('howWeWork.step4Title'), day: t('howWeWork.step4Day'), duration: t('howWeWork.step4Duration'), body: t('howWeWork.step4Body'), deliverables: t('howWeWork.step4Deliverables') },
    { num: t('howWeWork.step5Num'), icon: <CheckCircle size={24} />, title: t('howWeWork.step5Title'), day: t('howWeWork.step5Day'), duration: t('howWeWork.step5Duration'), body: t('howWeWork.step5Body'), deliverables: t('howWeWork.step5Deliverables') },
    { num: t('howWeWork.step6Num'), icon: <Rocket size={24} />, title: t('howWeWork.step6Title'), day: t('howWeWork.step6Day'), duration: t('howWeWork.step6Duration'), body: t('howWeWork.step6Body'), deliverables: t('howWeWork.step6Deliverables') },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">{t('howWeWork.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('howWeWork.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p>{t('howWeWork.heroSubtitle')}</p></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.howWeWork')}</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="v-timeline">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="v-step">
                  <span className="step-num">{s.num} — {s.day}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="deliverables">📦 {t('howWeWork.deliverables')}: {s.deliverables}</div>
                  <span className="duration-badge">⏱ {s.duration}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('howWeWork.commTitle')}</h2></FadeIn>
          <StaggerContainer className="comm-grid">
            {[
              { emoji: '🗓', title: t('howWeWork.comm1Title'), desc: t('howWeWork.comm1Desc') },
              { emoji: '💬', title: t('howWeWork.comm2Title'), desc: t('howWeWork.comm2Desc') },
              { emoji: '📋', title: t('howWeWork.comm3Title'), desc: t('howWeWork.comm3Desc') },
            ].map((c, i) => (
              <StaggerItem key={i}>
                <div className="glass-card comm-card">
                  <div className="emoji">{c.emoji}</div>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('howWeWork.toolsTitle')}</h2></FadeIn>
          <StaggerContainer className="tools-grid">
            {tools.map((tl, i) => (
              <StaggerItem key={i}>
                <div className="tool-item glass-card" style={{ padding: '20px 12px' }}>
                  <div className="tool-icon"><Code size={20} /></div>
                  <span>{tl}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>{t('howWeWork.ctaTitle')}</h2>
            <p>{t('howWeWork.ctaDesc')}</p>
            <Link to="/contact" className="btn btn-primary">{t('howWeWork.bookYourFreeCall')} <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
