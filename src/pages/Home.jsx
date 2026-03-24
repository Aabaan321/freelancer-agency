import { Link } from 'react-router-dom';
import { Code, Layers, TrendingUp, ChevronDown, ArrowRight, Star, CheckCircle } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from '../components/ScrollAnimations';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 6}s`,
  size: `${1 + Math.random() * 2}px`,
}));

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-particles">
          {particles.map(p => (
            <span key={p.id} className="particle" style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }} />
          ))}
        </div>
        <div className="hero-content">
          <FadeIn>
            <span className="label">✦ BOUTIQUE DIGITAL STUDIO — DUBAI</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{ marginTop: '20px' }}>Your Business Deserves a Website That Actually Converts.</h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="subtitle">We design and build premium custom websites for ambitious businesses — at 40% below the price of traditional agencies. Only 5 clients accepted per month.</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="hero-btns">
              <Link to="/contact" className="btn btn-primary">Book a Free Call <ArrowRight size={16} /></Link>
              <Link to="/projects" className="btn btn-outline">See Our Work</Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <div className="trust-badges">
              <span><span className="check">✓</span> Starting from AED 1,000</span>
              <span><span className="check">✓</span> 5 Clients Max</span>
              <span><span className="check">✓</span> 1-on-1 Sessions</span>
              <span><span className="check">✓</span> Full Custom — No Templates</span>
            </div>
          </FadeIn>
        </div>
        <div className="scroll-indicator"><ChevronDown size={24} /></div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '40', suffix: '–50%', label: 'Below Market Price' },
              { num: '5', suffix: '', label: 'Max Active Clients' },
              { num: '1', suffix: 'K', label: 'AED Starting Price' },
              { num: '100', suffix: '%', label: 'Custom Built' },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="stat-number"><CountUp end={parseInt(s.num)} suffix={s.suffix} /></div>
                <div className="stat-label">{s.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES OVERVIEW ── */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>What We Do</h2></FadeIn>
          <StaggerContainer className="services-grid">
            {[
              { icon: <Code size={32} />, title: 'Custom Website Development', desc: 'From sleek landing pages to full multi-page business websites. Mobile-first, lightning-fast, and built to turn visitors into customers.', tags: ['React', 'Tailwind', 'Next.js', 'Webflow'] },
              { icon: <Layers size={32} />, title: 'UI/UX Design & Branding', desc: "We obsess over every pixel. Clean layouts, intuitive flows, and a visual identity that makes your brand look more expensive than it is.", tags: ['Figma', 'Prototyping', 'Brand Identity'] },
              { icon: <TrendingUp size={32} />, title: 'Digital Marketing & Outreach', desc: 'Beautiful websites need to be found. We handle SEO strategy, social presence, and outreach campaigns that drive real leads.', tags: ['SEO', 'Social', 'Strategy', 'Outreach'] },
            ].map((svc, i) => (
              <StaggerItem key={i}>
                <div className="glass-card service-card">
                  <div className="icon">{svc.icon}</div>
                  <h3>{svc.title}</h3>
                  <p>{svc.desc}</p>
                  <div className="tags">{svc.tags.map(t => <span key={t}>{t}</span>)}</div>
                  <Link to="/services" className="card-link">Explore Service <ArrowRight size={14} /></Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(198,168,75,0.03) 0%, transparent 60%)' }}>
        <div className="container">
          <div className="split">
            <FadeIn direction="left">
              <div>
                <h2>Not Your Average Agency.</h2>
                <p style={{ marginTop: '20px' }}>Most agencies charge AED 5,000–15,000 for websites that look like templates. We're different. We're a small, focused team of 3 — two developers and one marketing expert — who treat every project like it's our own business. You work directly with the founders. Every time.</p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.15}>
              <ul className="feature-list">
                {[
                  'Limited to 5 clients — your project gets our full focus',
                  'Direct founder access — no account managers, no middlemen',
                  'Custom-coded — zero page builders or cheap templates',
                  'Transparent pricing — no hidden fees, ever',
                  "Post-launch support — we don't disappear after delivery",
                ].map((f, i) => (
                  <li key={i}><CheckCircle size={20} className="icon" />{f}</li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── PROCESS PREVIEW ── */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>How We Work</h2></FadeIn>
          <FadeIn delay={0.1}>
            <div className="timeline-h">
              {[
                { num: '01', title: 'Discovery', desc: 'Free call to understand your goals' },
                { num: '02', title: 'Design', desc: 'Pixel-perfect Figma mockups' },
                { num: '03', title: 'Build', desc: 'Clean custom code, no shortcuts' },
                { num: '04', title: 'Launch', desc: 'Go live with full support' },
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
              <Link to="/how-we-work" className="btn btn-outline">See Full Process <ArrowRight size={14} /></Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── AVAILABILITY ── */}
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="glass-card" style={{ textAlign: 'center', padding: '64px 32px', maxWidth: '700px', margin: '0 auto' }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>We Work With 5 Clients at a Time. That's It.</h2>
              <div className="slots-visual">
                {[true, true, true, false, false].map((taken, i) => (
                  <div key={i} className={`slot ${taken ? 'taken' : 'available'}`}>{taken ? '✓' : '○'}</div>
                ))}
              </div>
              <p style={{ maxWidth: '480px', margin: '0 auto 24px' }}>Our small team model means every client gets premium attention. When we're full, intake closes.</p>
              <Link to="/contact" className="btn btn-primary">Check Availability & Book Your Spot <ArrowRight size={14} /></Link>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px' }}>Spots refresh monthly. Next opening: April 2025.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>What Clients Say</h2></FadeIn>
          <StaggerContainer className="testimonials-grid">
            {[
              { quote: 'They redesigned our entire online presence in 2 weeks. The result was beyond what we expected — and the price was honestly shocking for the quality.', name: 'Ahmed R.', role: 'Restaurant Owner', initials: 'AR' },
              { quote: 'Finally an agency that actually listens. They sat with us for an hour just to understand our brand before touching anything. Professional from start to finish.', name: 'Sarah M.', role: 'Boutique Owner', initials: 'SM' },
              { quote: "Our old website was embarrassing. This one makes us look like a million-dollar company. Worth every dirham.", name: 'Khalid T.', role: 'Real Estate Consultant', initials: 'KT' },
            ].map((t, i) => (
              <StaggerItem key={i}>
                <div className="glass-card testimonial-card">
                  <div className="stars">{[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#C6A84B" />)}</div>
                  <blockquote>"{t.quote}"</blockquote>
                  <div className="author">
                    <div className="avatar">{t.initials}</div>
                    <div>
                      <div className="author-name">{t.name}</div>
                      <div className="author-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>Ready to Build Something Premium?</h2>
            <p>Book a free 30-minute discovery call. No pressure. No pitch. Just a real conversation about your business.</p>
            <Link to="/contact" className="btn btn-primary">Book Your Free Call <ArrowRight size={14} /></Link>
            <div className="privacy">🔒 100% Free. No commitment required.</div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
