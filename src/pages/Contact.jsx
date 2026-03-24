import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, Check } from 'lucide-react';
import { FadeIn } from '../components/ScrollAnimations';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    setSuccess(true);
  };

  return (
    <>
      <section className="page-hero">
        <div className="container" style={{ maxWidth: '900px' }}>
          <FadeIn><span className="label">Contact</span></FadeIn>
          <FadeIn delay={0.1}><h1>Let's Talk.</h1></FadeIn>
          <FadeIn delay={0.2}><p>Tell us about your project and we'll get back to you within a few hours.</p></FadeIn>
          <div className="breadcrumb"><Link to="/">Home</Link> <span>/</span> <span>Contact</span></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="contact-split">
            {/* Info Side */}
            <FadeIn direction="left">
              <div className="contact-info">
                <div className="detail"><Mail className="icon" size={20} /> <strong>Email:</strong> hello@luxestudio.com</div>
                <div className="detail"><Phone className="icon" size={20} /> <strong>WhatsApp:</strong> +971 XX XXX XXXX</div>
                <div className="detail"><MapPin className="icon" size={20} /> <strong>Location:</strong> Dubai, UAE</div>
                <div className="detail"><Clock className="icon" size={20} /> <strong>Response time:</strong> Usually within 2–4 hours</div>
                
                <div className="glass-card" style={{ marginTop: '48px', padding: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '24px', textAlign: 'center' }}>Current Availability</h3>
                  <div className="slots-visual" style={{ margin: '0 0 16px' }}>
                    {[true, true, true, false, false].map((taken, i) => (
                      <div key={i} className={`slot ${taken ? 'taken' : 'available'}`} style={{ width: '40px', height: '40px' }}>{taken ? '✓' : '○'}</div>
                    ))}
                  </div>
                  <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>2 of 5 spots open</p>
                </div>
              </div>
            </FadeIn>

            {/* Form Side */}
            <FadeIn direction="right" delay={0.1}>
              <div className="contact-form">
                {success ? (
                  <div className="success-message">
                    <div className="checkmark"><Check size={40} /></div>
                    <h3 style={{ marginBottom: '16px' }}>Message Sent!</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. We will get back to you within 4 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" />
                      {errors.name && <span className="error-msg">{errors.name.message}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })} placeholder="john@company.com" />
                      {errors.email && <span className="error-msg">{errors.email.message}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number (WhatsApp preferred)</label>
                      <input {...register('phone')} placeholder="+971 50 123 4567" />
                    </div>
                    
                    <div className="form-group">
                      <label>Type of Project</label>
                      <select {...register('projectType')}>
                        <option value="New Website">New Website</option>
                        <option value="Website Redesign">Website Redesign</option>
                        <option value="UI/UX Design Only">UI/UX Design Only</option>
                        <option value="Marketing Package">Marketing Package</option>
                        <option value="Full Package">Full Package</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Budget Range</label>
                      <select {...register('budget')}>
                        <option value="AED 1,000 – 2,000">AED 1,000 – 2,000</option>
                        <option value="AED 2,000 – 5,000">AED 2,000 – 5,000</option>
                        <option value="AED 5,000 – 10,000">AED 5,000 – 10,000</option>
                        <option value="AED 10,000+">AED 10,000+</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Project Description</label>
                      <textarea {...register('message', { required: 'Please tell us a bit about your project' })} rows={5} placeholder="Tell us about your business and what you're looking to build..." />
                      {errors.message && <span className="error-msg">{errors.message.message}</span>}
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }} disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : <>Send Message <ArrowRight size={16} /></>}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>🔒 Your information is never shared. We respond within 4 hours.</p>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Calendly Embed Placeholder */}
      <section className="section calendly-section">
        <div className="container">
          <FadeIn>
            <h2>Or Book a Call Directly</h2>
            <p style={{ marginTop: '16px' }}>Select a 30-minute slot below — it's completely free.</p>
            <div className="calendly-embed">
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexDirection: 'column', gap: '16px' }}>
                <Phone size={48} style={{ color: 'var(--gold)', opacity: 0.5 }} />
                <span>Calendly Embed Placeholder</span>
                <span className="label">Add iframe from calendly.com/your-link</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
