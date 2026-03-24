import { Link } from 'react-router-dom';
import { Code, Layers, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

const services = [
  {
    tag: '01 — Web Development', title: "Websites Built to Convert, Not Just to Look Pretty.",
    body: "We build every website from scratch — no page builders, no bloated themes. Every project is coded with React, Next.js, and Tailwind CSS for blazing performance, full SEO readiness, and mobile-first responsiveness. Your site will load fast, rank well, and actually convert visitors into paying customers.",
    includes: ['Custom design (no templates)', 'Mobile responsive (all screen sizes)', 'Fast loading (optimised assets, clean code)', 'SEO foundations built in', 'Contact forms & integrations', 'CMS setup (if needed)', 'Post-launch support (30 days)'],
    price: 'AED 1,000', timeline: '1–3 weeks',
    tools: ['React', 'Next.js', 'Tailwind', 'Framer Motion', 'Vercel'],
    icon: <Code size={40} />,
  },
  {
    tag: '02 — Design & Branding', title: 'Design That Makes Your Brand Look Worth 10x More.',
    body: "We design every page in Figma first — full desktop and mobile layouts with interactive prototypes. From wireframes to final brand identity, we obsess over every pixel so your business looks polished, premium, and unforgettable. You review and approve everything before we write a single line of code.",
    includes: ['Full UI/UX design in Figma', 'Brand identity & visual direction', 'Interactive prototypes', 'Component design system', 'Mobile-first layout design', 'Revision rounds included', 'Design handoff documentation'],
    price: 'AED 800', timeline: '1–2 weeks',
    tools: ['Figma', 'Adobe Suite', 'Framer'],
    icon: <Layers size={40} />,
  },
  {
    tag: '03 — Marketing & Growth', title: 'Get Found. Get Leads. Get Results.',
    body: "A beautiful website that nobody visits is just art. We handle SEO strategy, social media presence, and outreach campaigns that drive real, qualified leads to your business. From Google rankings to Instagram growth — we make sure the right people find you.",
    includes: ['SEO audit & strategy', 'Google Business optimisation', 'Social media strategy', 'Content planning', 'Outreach campaigns', 'Monthly performance reports', 'Ongoing consulting'],
    price: 'AED 600', timeline: '/month',
    tools: ['Google Analytics', 'SEMrush', 'Notion', 'Meta Ads'],
    icon: <TrendingUp size={40} />,
  },
];

const tiers = [
  { name: 'Starter', price: 'AED 1,000', features: ['1–3 page website', 'Basic UI design', 'Mobile responsive', 'Contact form', '2 revision rounds', '2 weeks delivery'] },
  { name: 'Growth', price: 'AED 2,500', popular: true, features: ['Up to 7 pages', 'Custom UI/UX design', 'SEO foundations', 'CMS integration', 'Animations & interactions', '3 weeks delivery', '30-day support'] },
  { name: 'Premium', price: 'Custom Quote', features: ['Unlimited pages', 'Full brand identity', 'Marketing strategy', 'Advanced features', 'Ongoing retainer available', 'Priority support'] },
];

export default function Services() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">What We Offer</span></FadeIn>
          <FadeIn delay={0.1}><h1>Our Services</h1></FadeIn>
          <FadeIn delay={0.2}><p>Three core disciplines. One focused team. Premium results across the board.</p></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Services</span></div>
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
                    {svc.includes.map((item, j) => (
                      <li key={j}><span className="dot" />{item}</li>
                    ))}
                  </ul>
                  <div className="pricing-card">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Starting from</span>
                      <span className="price">{svc.price}</span>
                    </div>
                    <div className="timeline-info">Timeline: {svc.timeline}</div>
                    <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get a Custom Quote <ArrowRight size={14} /></Link>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                    {svc.tools.map(t => <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{t}</span>)}
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

      {/* Pricing */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '16px' }}>Simple, Transparent Pricing</h2></FadeIn>
          <FadeIn delay={0.1}><p style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto 56px' }}>No hidden fees. No surprises. Just honest pricing for premium work.</p></FadeIn>
          <StaggerContainer className="pricing-grid">
            {tiers.map((tier, i) => (
              <StaggerItem key={i}>
                <div className={`pricing-tier${tier.popular ? ' popular' : ''}`}>
                  {tier.popular && <div className="badge">Most Popular</div>}
                  <h3>{tier.name}</h3>
                  <div className="price">{tier.price}</div>
                  <ul>
                    {tier.features.map((f, j) => (
                      <li key={j}><Check size={16} className="check" />{f}</li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started <ArrowRight size={14} /></Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
