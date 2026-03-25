import { Link } from 'react-router-dom';
import { Code, Layers, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

export default function Services() {
  const { t } = useTranslation();
  const { convert } = useCurrency();

  const services = [
    { tag: t('services.svc1Tag'), title: t('services.svc1Title'), body: t('services.svc1Body'), includes: t('services.svc1Includes', { returnObjects: true }), price: convert(1000), timeline: t('services.svc1Timeline'), tools: ['React', 'Next.js', 'Tailwind', 'Framer Motion', 'Vercel'], icon: <Code size={40} /> },
    { tag: t('services.svc2Tag'), title: t('services.svc2Title'), body: t('services.svc2Body'), includes: t('services.svc2Includes', { returnObjects: true }), price: convert(800), timeline: t('services.svc2Timeline'), tools: ['Figma', 'Adobe Suite', 'Framer'], icon: <Layers size={40} /> },
    { tag: t('services.svc3Tag'), title: t('services.svc3Title'), body: t('services.svc3Body'), includes: t('services.svc3Includes', { returnObjects: true }), price: convert(600), timeline: t('services.svc3Timeline'), tools: ['Google Analytics', 'SEMrush', 'Notion', 'Meta Ads'], icon: <TrendingUp size={40} /> },
  ];

  const tiers = [
    { name: t('services.starter'), price: convert(1000), features: t('services.starterFeatures', { returnObjects: true }) },
    { name: t('services.growth'), price: convert(2500), popular: true, features: t('services.growthFeatures', { returnObjects: true }) },
    { name: t('services.premium'), price: t('services.customQuote'), features: t('services.premiumFeatures', { returnObjects: true }) },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">{t('services.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('services.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p>{t('services.heroSubtitle')}</p></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.services')}</span></div>
        </div>
      </section>

      {services.map((svc, i) => (
        <section key={i} className="service-detail" style={{ background: i % 2 === 1 ? 'var(--bg-secondary)' : 'transparent' }}>
          <div className="container">
            <div className="split" style={{ direction: i % 2 === 1 ? 'rtl' : 'ltr' }}>
              <FadeIn direction={i % 2 === 0 ? 'left' : 'right'}>
                <div style={{ direction: 'ltr' }}>
                  <span className="label tag">{svc.tag}</span>
                  <h2>{svc.title}</h2>
                  <p>{svc.body}</p>
                  <ul className="includes-list">
                    {(Array.isArray(svc.includes) ? svc.includes : []).map((item, j) => (
                      <li key={j}><span className="dot" />{item}</li>
                    ))}
                  </ul>
                  <div className="pricing-card">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t('services.startingFrom')}</span>
                      <span className="price">{svc.price}</span>
                    </div>
                    <div className="timeline-info">{t('services.timeline')}: {svc.timeline}</div>
                    <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('services.getCustomQuote')} <ArrowRight size={14} /></Link>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {svc.tools.map(tl => <span key={tl} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{tl}</span>)}
                  </div>
                </div>
              </FadeIn>
              <FadeIn direction={i % 2 === 0 ? 'right' : 'left'} delay={0.15}>
                <div style={{ direction: 'ltr', background: 'var(--surface)', borderRadius: '16px', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                  <div style={{ color: 'var(--gold)', opacity: 0.3 }}>{svc.icon}</div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '16px' }}>{t('services.pricingTitle')}</h2></FadeIn>
          <FadeIn delay={0.1}><p style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 56px' }}>{t('services.pricingSubtitle')}</p></FadeIn>
          <StaggerContainer className="pricing-grid">
            {tiers.map((tier, i) => (
              <StaggerItem key={i}>
                <div className={`pricing-tier${tier.popular ? ' popular' : ''}`}>
                  {tier.popular && <div className="badge">{t('services.mostPopular')}</div>}
                  <h3>{tier.name}</h3>
                  <div className="price">{tier.price}</div>
                  <ul>
                    {(Array.isArray(tier.features) ? tier.features : []).map((f, j) => (
                      <li key={j}><Check size={16} className="check" />{f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{t('services.getStarted')} <ArrowRight size={14} /></Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
