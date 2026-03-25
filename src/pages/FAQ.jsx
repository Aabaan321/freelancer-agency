import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { FadeIn } from '../components/ScrollAnimations';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useTranslation();
  const { convert } = useCurrency();

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1', { price: convert(1000) }) },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') },
    { q: t('faq.q9'), a: t('faq.a9', { price: convert(200) }) },
    { q: t('faq.q10'), a: t('faq.a10') },
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <FadeIn><span className="label">{t('faq.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('faq.heroTitle')}</h1></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.faq')}</span></div>
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
            <h2>{t('faq.ctaTitle')}</h2>
            <p>{t('faq.ctaDesc')}</p>
            <Link to="/contact" className="btn btn-primary">{t('faq.bookFreeCall')} <ArrowRight size={14} /></Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
