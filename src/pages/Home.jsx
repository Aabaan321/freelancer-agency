import { Link } from 'react-router-dom';
import { Code, Layers, TrendingUp, ChevronDown, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 6}s`,
  size: `${1 + Math.random() * 2}px`,
}));

export default function Home() {
  const { t } = useTranslation();
  const { convert } = useCurrency();

  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-particles">
          {particles.map(p => (
            <span key={p.id} className="particle" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }} />
          ))}
        </div>
        <div className="hero-content">
          <FadeIn><span className="label">{t('home.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1 style={{ marginTop: '20px' }}>{t('home.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p className="subtitle">{t('home.heroSubtitle')}</p></FadeIn>
          <FadeIn delay={0.3}>
            <div className="hero-btns">
              <Link to="/contact" className="btn btn-primary">{t('home.bookFreeCall')} <ArrowRight size={16} /></Link>
              <Link to="/projects" className="btn btn-outline">{t('home.seeOurWork')}</Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="trust-badges">
              <span><span className="check">✓</span> {t('home.trustStarting')} {convert(1000)}</span>
              <span><span className="check">✓</span> {t('home.trust5Clients')}</span>
              <span><span className="check">✓</span> {t('home.trustSessions')}</span>
              <span><span className="check">✓</span> {t('home.trustCustom')}</span>
            </div>
          </FadeIn>
        </div>
        <div className="scroll-indicator"><ChevronDown size={24} /></div>
      </section>

      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '40', suffix: '–50%', label: t('home.statBelowMarket') },
              { num: '5', suffix: '', label: t('home.statMaxClients') },
              { num: '1', suffix: 'K', label: t('home.statStartingPrice') },
              { num: '100', suffix: '%', label: t('home.statCustomBuilt') },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="stat-number"><CountUp end={parseInt(s.num)} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('home.whatWeDo')}</h2></FadeIn>
          <StaggerContainer className="services-grid">
            {[
              { icon: <Code size={32} />, title: t('home.svcWebDev'), desc: t('home.svcWebDevDesc'), tags: ['React', 'Tailwind', 'Next.js', 'Webflow'] },
              { icon: <Layers size={32} />, title: t('home.svcDesign'), desc: t('home.svcDesignDesc'), tags: ['Figma', 'Prototyping', 'Brand Identity'] },
              { icon: <TrendingUp size={32} />, title: t('home.svcMarketing'), desc: t('home.svcMarketingDesc'), tags: ['SEO', 'Social', 'Strategy', 'Outreach'] },
            ].map((svc, i) => (
              <StaggerItem key={i}>
                <div className="glass-card service-card">
                  <div className="icon">{svc.icon}</div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <div className="tags">{svc.tags.map(tg => <span key={tg}>{tg}</span>)}</div>
                  <Link to="/services" className="card-link">{t('home.exploreService')} <ArrowRight size={14} /></Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(198,168,75,0.03) 0%, transparent 60%)' }}>
        <div className="container">
          <div className="split">
            <FadeIn direction="left">
              <div>
                <h2>{t('home.notAvgAgency')}</h2>
                <p style={{ marginTop: '20px' }}>{t('home.notAvgAgencyDesc')}</p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <ul className="feature-list">
                {[t('home.featureLimit'), t('home.featureDirect'), t('home.featureCustom'), t('home.featureTransparent'), t('home.featureSupport')].map((f, i) => (
                  <li key={i}><CheckCircle size={20} className="icon" />{f}</li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('home.howWeWorkTitle')}</h2></FadeIn>
          <FadeIn delay={0.1}>
            <div className="timeline-h">
              {[
                { num: '01', title: t('home.processDiscovery'), desc: t('home.processDiscoveryDesc') },
                { num: '02', title: t('home.processDesign'), desc: t('home.processDesignDesc') },
                { num: '03', title: t('home.processBuild'), desc: t('home.processBuildDesc') },
                { num: '04', title: t('home.processLaunch'), desc: t('home.processLaunchDesc') },
              ].map((s, i) => (
                <div className="timeline-step" key={i}>
                  <div className="num">{s.num}</div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/how-we-work" className="btn btn-outline">{t('home.seeFullProcess')} <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="glass-card" style={{ textAlign: 'center', padding: '64px 32px', maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>{t('home.availabilityTitle')}</h2>
              <div className="slots-visual">
                {[true, true, true, false, false].map((taken, i) => (
                  <div key={i} className={`slot ${taken ? 'taken' : 'available'}`}>{taken ? '✓' : '○'}</div>
                ))}
              </div>
              <p style={{ maxWidth: '480px', margin: '0 auto 24px' }}>{t('home.availabilityDesc')}</p>
              <Link to="/contact" className="btn btn-primary">{t('home.checkAvailability')} <ArrowRight size={14} /></Link>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>{t('home.spotsRefresh')}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>{t('home.whatClientsSay')}</h2></FadeIn>
          <StaggerContainer className="testimonials-grid">
            {[
              { quote: t('home.testimonial1'), name: t('home.testimonial1Name'), role: t('home.testimonial1Role'), initials: 'AR' },
              { quote: t('home.testimonial2'), name: t('home.testimonial2Name'), role: t('home.testimonial2Role'), initials: 'SM' },
              { quote: t('home.testimonial3'), name: t('home.testimonial3Name'), role: t('home.testimonial3Role'), initials: 'KT' },
            ].map((tm, i) => (
              <StaggerItem key={i}>
                <div className="glass-card testimonial-card">
                  <div className="stars">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#C6A84B" />)}</div>
                  <blockquote>"{tm.quote}"</blockquote>
                  <div className="author">
                    <div className="avatar">{tm.initials}</div>
                    <div>
                      <div className="author-name">{tm.name}</div>
                      <div className="author-role">{tm.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>{t('home.finalCtaTitle')}</h2>
            <p>{t('home.finalCtaDesc')}</p>
            <Link to="/contact" className="btn btn-primary">{t('home.bookYourFreeCall')} <ArrowRight size={14} /></Link>
            <div className="privacy">{t('home.privacy')}</div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
