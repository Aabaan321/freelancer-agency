import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, Check, X } from 'lucide-react';
import { FadeIn } from '../components/ScrollAnimations';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

import aabaanImg from '../assets/aabaan.jpeg';
import shubhanImg from '../assets/shubhan.jpeg';

const TEAM = {
  abhay: { name: "Abhay Shetty", role: "Co-Founder & CSO — Client Relations", number: "+971543397190", avatar: "AS", image: null },
  aabaan: { name: "Aabaan Rahil Ghaffar", role: "Co-Founder & CTO — Technical", number: "+971551212310", avatar: "ARG", image: aabaanImg },
  shubhan: { name: "Shubhan Naik", role: "Co-Founder & CEO — General", number: "+971529910516", avatar: "SN", image: shubhanImg },
};

const ROUTING = {
  "New Website": "abhay",
  "Website Redesign": "abhay",
  "UI/UX Design Only": "aabaan",
  "Marketing Package": "abhay",
  "Full Package": "abhay",
};

function getRecommended(projectType) {
  return ROUTING[projectType] || "abhay";
}

function buildWhatsAppUrl(member, data) {
  const firstName = member.name.split(' ')[0];
  let msg = `Hi ${firstName}! 👋\n\nI found Aureo and I'm interested in working together.\n\nHere are my details:\n\n👤 Name: ${data.name}\n📧 Email: ${data.email}`;
  if (data.phone) msg += `\n📱 Phone: ${data.phone}`;
  msg += `\n\n🛠 Project Type: ${data.projectType || 'Not specified'}\n💰 Budget: ${data.budget || 'Not specified'}`;
  if (data.message) msg += `\n\n📝 What I'm looking for:\n${data.message}`;
  msg += `\n\nLooking forward to hearing from you!`;
  const number = member.number.replace(/\+/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export default function Contact() {
  const { t } = useTranslation();
  const { convert } = useCurrency();
  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [waUrl, setWaUrl] = useState('');

  const onSubmit = (data) => {
    setFormData(data);
    setShowModal(true);
  };

  const handleSelectMember = (key) => {
    const member = TEAM[key];
    const url = buildWhatsAppUrl(member, formData);
    setWaUrl(url);
    setSelectedMember(member);
    setShowModal(false);
    setSuccess(true);
    window.open(url, '_blank');
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData(null);
    setSelectedMember(null);
    setWaUrl('');
    reset();
  };

  const recommended = formData ? getRecommended(formData.projectType) : 'abhay';
  const orderedKeys = [recommended, ...Object.keys(TEAM).filter(k => k !== recommended)];

  const budgetRanges = [
    `${convert(1000)} – ${convert(2000)}`,
    `${convert(2000)} – ${convert(5000)}`,
    `${convert(5000)} – ${convert(10000)}`,
    `${convert(10000)}+`,
    t('contact.budgetNotSure'),
  ];

  const projectTypes = t('contact.projectTypes', { returnObjects: true });

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <FadeIn><span className="label">{t('contact.heroLabel')}</span></FadeIn>
          <FadeIn delay={0.1}><h1>{t('contact.heroTitle')}</h1></FadeIn>
          <FadeIn delay={0.2}><p>{t('contact.heroSubtitle')}</p></FadeIn>
          <div className="breadcrumb"><Link to="/">{t('nav.home')}</Link> <span>/</span> <span>{t('nav.contact')}</span></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="contact-split">
            <FadeIn direction="left">
              <div className="contact-info">
                <div className="detail"><Mail className="icon" size={20} /> <strong>{t('contact.email')}</strong> hello@aureo.com</div>
                <div className="detail"><Phone className="icon" size={20} /> <strong>{t('contact.whatsapp')}</strong> +971 54 339 7190</div>
                <div className="detail"><MapPin className="icon" size={20} /> <strong>{t('contact.location')}</strong> {t('contact.locationValue')}</div>
                <div className="detail"><Clock className="icon" size={20} /> <strong>{t('contact.responseTime')}</strong> {t('contact.responseValue')}</div>
                <div className="glass-card" style={{ marginTop: '48px', padding: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>{t('contact.currentAvailability')}</h3>
                  <div className="slots-visual" style={{ margin: '0 0 16px' }}>
                    {[true, true, true, false, false].map((taken, i) => (
                      <div key={i} className={`slot ${taken ? 'taken' : 'available'}`} style={{ width: '40px', height: '40px' }}>{taken ? '✓' : '○'}</div>
                    ))}
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>{t('contact.spotsOpen')}</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div className="contact-form">
                {success ? (
                  <div className="success-message">
                    <div className="wa-checkmark"><Check size={40} /></div>
                    <h3 style={{ marginBottom: '12px' }}>Opening WhatsApp now! 🎉</h3>
                    <p style={{ color: 'var(--text-body)', fontSize: '15px', marginBottom: '24px' }}>
                      Your message has been pre-filled for <strong style={{ color: 'var(--gold)' }}>{selectedMember?.name}</strong>. Just hit send and they'll reply shortly.
                    </p>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      Didn't open? Click here to try again <ArrowRight size={12} />
                    </a>
                    <button className="btn btn-outline" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }} onClick={handleReset}>
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label>{t('contact.fullName')}</label>
                      <input {...register('name', { required: t('contact.nameRequired') })} placeholder={t('contact.namePlaceholder')} />
                      {errors.name && <span className="error-msg">{errors.name.message}</span>}
                    </div>
                    <div className="form-group">
                      <label>{t('contact.emailAddress')}</label>
                      <input type="email" {...register('email', { required: t('contact.emailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('contact.emailInvalid') } })} placeholder={t('contact.emailPlaceholder')} />
                      {errors.email && <span className="error-msg">{errors.email.message}</span>}
                    </div>
                    <div className="form-group">
                      <label>{t('contact.phone')}</label>
                      <input {...register('phone')} placeholder={t('contact.phonePlaceholder')} />
                    </div>
                    <div className="form-group">
                      <label>{t('contact.projectType')}</label>
                      <select {...register('projectType')}>
                        {(Array.isArray(projectTypes) ? projectTypes : []).map((pt, i) => <option key={i} value={pt}>{pt}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t('contact.budgetRange')}</label>
                      <select {...register('budget')}>
                        {budgetRanges.map((br, i) => <option key={i} value={br}>{br}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>{t('contact.projectDesc')}</label>
                      <textarea {...register('message', { required: t('contact.descRequired') })} rows={5} placeholder={t('contact.descPlaceholder')} />
                      {errors.message && <span className="error-msg">{errors.message.message}</span>}
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                      {t('contact.sendMessage')} <ArrowRight size={16} />
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>💬 Opens WhatsApp directly — no bots, no delays.</p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* WhatsApp Team Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="wa-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <motion.div
              className="wa-modal"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="wa-modal-close" onClick={() => setShowModal(false)}><X size={22} /></button>
              <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Who would you like to reach?</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '14px' }}>Message goes directly to their personal WhatsApp — no bots, no delays.</p>

              <div className="wa-team-grid">
                {orderedKeys.map(key => {
                  const member = TEAM[key];
                  const isRec = key === recommended;
                  return (
                    <motion.div
                      key={key}
                      className={`wa-team-card${isRec ? ' recommended' : ''}`}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isRec && <div className="wa-rec-badge">✦ Recommended for you</div>}
                      <div className="wa-avatar-ring">
                        {member.image ? (
                          <img src={member.image} alt={member.name} />
                        ) : (
                          <span>{member.avatar}</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{member.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--gold-light)', marginBottom: '16px' }}>{member.role}</p>
                      <button className="btn btn-primary wa-msg-btn" onClick={() => handleSelectMember(key)}>
                        Message on WhatsApp <ArrowRight size={14} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="section calendly-section">
        <div className="container">
          <FadeIn>
            <h2>{t('contact.calendlyTitle')}</h2>
            <p style={{ marginTop: '16px' }}>{t('contact.calendlyDesc')}</p>
            <div className="calendly-embed">
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '16px' }}>
                <Phone size={48} style={{ color: 'var(--gold)', opacity: 0.5 }} />
                <span>{t('contact.calendlyPlaceholder')}</span>
                <span className="label">{t('contact.calendlyHint')}</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
