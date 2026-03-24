import { Link } from 'react-router-dom';
import { Phone, Map, PenTool, Code, CheckCircle, Rocket, ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/ScrollAnimations';

const steps = [
  { num: 'STEP 01', icon: <Phone size={24} />, title: 'We Start by Listening.', day: 'Day 1', duration: '30–60 mins',
    body: "Every project begins with a free 30-minute call. We want to understand your business, your audience, your goals, and what success looks like for you. No templates. No assumptions.",
    deliverables: 'Project brief, scope of work, timeline' },
  { num: 'STEP 02', icon: <Map size={24} />, title: 'We Build the Blueprint.', day: 'Days 2–3', duration: '1–2 days',
    body: "Once we understand your goals, we create a full project roadmap — sitemap, content structure, and technical plan. You see and approve everything before we touch any design.",
    deliverables: 'Sitemap, content plan, tech stack decision' },
  { num: 'STEP 03', icon: <PenTool size={24} />, title: 'Pixel-Perfect Design in Figma.', day: 'Days 4–9', duration: '4–5 days',
    body: "We design every page in Figma first. Full desktop and mobile layouts. You get a live Figma link to review, comment, and approve. We don't move to development until you love it.",
    deliverables: 'Full Figma prototype, revision rounds' },
  { num: 'STEP 04', icon: <Code size={24} />, title: 'Clean Code. Zero Shortcuts.', day: 'Days 10–18', duration: '7–9 days',
    body: "We build your site from scratch — no page builders, no bloated plugins. Custom React components, optimised for speed, SEO, and mobile performance.",
    deliverables: 'Staged preview link, testing on all devices' },
  { num: 'STEP 05', icon: <CheckCircle size={24} />, title: "You're In Full Control.", day: 'Days 19–21', duration: '2–3 days',
    body: "We share a live staging link. You review everything. We make your requested changes. This process repeats until you're 100% satisfied.",
    deliverables: 'Revised staging site, client sign-off' },
  { num: 'STEP 06', icon: <Rocket size={24} />, title: 'We Go Live — Together.', day: 'Day 22–28', duration: 'Launch week',
    body: "Once you approve, we handle full deployment — domain connection, SSL, speed optimisation, and final SEO setup. We stay on call for 30 days post-launch.",
    deliverables: 'Live website, handover doc, 30-day support' },
];

const tools = ['Figma', 'React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'GitHub', 'Notion', 'Google Analytics', 'Calendly'];

export default function HowWeWork() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">Our Approach</span></FadeIn>
          <FadeIn delay={0.1}><h1>Our Process</h1></FadeIn>
          <FadeIn delay={0.2}><p>Transparent. Collaborative. Obsessively detailed.</p></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>How We Work</span></div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="v-timeline">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="v-step">
                  <span className="step-num">{s.num} — {s.day}</span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <div className="deliverables">📦 Deliverables: {s.deliverables}</div>
                  <span className="duration-badge">⏱ {s.duration}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Communication */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>How We Stay In Touch</h2></FadeIn>
          <StaggerContainer className="comm-grid">
            {[
              { emoji: '🗓', title: 'Weekly Check-ins', desc: 'Short calls to keep you updated on progress and next steps.' },
              { emoji: '💬', title: 'Direct WhatsApp', desc: 'Message the team anytime — no ticketing systems or delays.' },
              { emoji: '📋', title: 'Project Dashboard', desc: 'See real-time progress updates with full transparency.' },
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

      {/* Tools */}
      <section className="section">
        <div className="container">
          <FadeIn><h2 style={{ textAlign: 'center', marginBottom: '56px' }}>Tools We Use</h2></FadeIn>
          <StaggerContainer className="tools-grid">
            {tools.map((t, i) => (
              <StaggerItem key={i}>
                <div className="tool-item glass-card" style={{ padding: '20px 12px' }}>
                  <div className="tool-icon"><Code size={20} /></div>
                  <span>{t}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>Ready to Start Your Project?</h2>
            <p>Book a free discovery call and let's map out your project together.</p>
            <Link to="/contact" className="btn btn-primary">Book Your Free Call <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
