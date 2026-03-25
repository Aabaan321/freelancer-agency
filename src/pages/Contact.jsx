import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import { FadeIn } from '../components/ScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../context/CurrencyContext';

export default function Contact() {
  const { t } = useTranslation();
  const { convert } = useCurrency();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    setSuccess(true);
  };

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
                <div className="detail"><Mail className="icon" size={20} /> <strong>{t('contact.email')}</strong> hello@luxestudio.com</div>
                <div className="detail"><Phone className="icon" size={20} /> <strong>{t('contact.whatsapp')}</strong> +971 XX XXX XXXX</div>
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
                    <div className="checkmark"><Check size={40} /></div>
                    <h3 style={{ marginBottom: '16px' }}>{t('contact.messageSent')}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>{t('contact.messageSentDesc')}</p>
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
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} disabled={isSubmitting}>
                      {isSubmitting ? t('contact.sending') : <>{t('contact.sendMessage')} <ArrowRight size={16} /></>}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>{t('contact.formPrivacy')}</p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

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
