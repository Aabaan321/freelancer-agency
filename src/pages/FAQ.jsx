import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/ScrollAnimations';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  { q: "How much does a website cost?", a: "Our projects start at AED 1,000 for a clean, professional landing page. Pricing scales based on pages, features, and complexity. We're always 40–50% below what a typical agency would charge for the same quality. We'll give you a clear quote after a free discovery call." },
  { q: "How long does a project take?", a: "Most websites are delivered in 2–4 weeks. Simpler projects can be done in under 2 weeks. We'll give you a clear timeline before we start." },
  { q: "Why only 5 clients at a time?", a: "Because we refuse to compromise on quality. When you work with us, you're not one of 50 clients. You're one of 5. That means faster communication, more attention to detail, and a better final product." },
  { q: "Do you use templates or page builders?", a: "Never. Every website we build is custom-coded from scratch using React, Next.js, and Tailwind CSS. No Wix, no WordPress templates, no drag-and-drop shortcuts." },
  { q: "Will my website work on mobile?", a: "Yes — fully responsive design is standard on every single project we deliver. We test on all major screen sizes and devices." },
  { q: "What happens after the website launches?", a: "We provide 30 days of post-launch support for all projects. Any bugs, tweaks, or small updates during that period are handled at no extra cost." },
  { q: "Can you help with content (text and images)?", a: "We can guide you on content structure and copywriting direction. For photography, we recommend using professional stock photography or your own brand images, which we'll help you select." },
  { q: "How do I get started?", a: "Simply book a free 30-minute call using the Contact page. We'll discuss your project, answer any questions, and tell you if we're a good fit." },
  { q: "Do you offer ongoing maintenance?", a: "Yes. We offer monthly maintenance retainers for updates, security, and performance monitoring. Pricing starts at AED 200/month." },
  { q: "Are you based in Dubai?", a: "Yes — we're a Dubai-based team! However, we work with clients across the UAE and internationally via Zoom/Google Meet." }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">Common Questions</span></FadeIn>
          <FadeIn delay={0.1}><h1>Answers You Need.</h1></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>FAQ</span></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <FadeIn>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
                  <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                    {faq.q}
                    <ChevronDown size={20} className="chevron" />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div className="faq-answer">{faq.a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section final-cta">
        <div className="container">
          <FadeIn>
            <h2>Still Have Questions?</h2>
            <p>Our team is ready to answer them on a quick call.</p>
            <Link to="/contact" className="btn btn-primary">Book a Free Call <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
