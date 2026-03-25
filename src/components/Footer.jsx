import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">Aureon</div>
            <p style={{ fontStyle: 'italic', color: '#E8D5A3', fontSize: '14px', marginBottom: '8px' }}>{t('footer.tagline')}</p>
            <p>{t('footer.desc')}</p>
            <div className="social-links" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <a href="https://instagram.com/aureon_studio._" target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>
          <div>
            <h4>{t('footer.quickLinks')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('nav.home')}</Link></li>
              <li><Link to="/services">{t('nav.services')}</Link></li>
              <li><Link to="/how-we-work">{t('nav.howWeWork')}</Link></li>
              <li><Link to="/about">{t('nav.about')}</Link></li>
              <li><Link to="/projects">{t('nav.projects')}</Link></li>
              <li><Link to="/contact">{t('nav.contact')}</Link></li>
              <li><Link to="/faq">{t('nav.faq')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('footer.servicesTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/services">{t('footer.webDev')}</Link></li>
              <li><Link to="/services">{t('footer.uiux')}</Link></li>
              <li><Link to="/services">{t('footer.digitalMarketing')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('footer.contactTitle')}</h4>
            <ul className="footer-links">
              <li>📧 help@aureon-studio.com</li>
              <li>📱 +971 54 339 7190</li>
              <li>📍 Dubai, UAE</li>
            </ul>
            <Link to="/contact" className="btn btn-outline" style={{ marginTop: '16px', padding: '10px 20px', fontSize: '13px' }}>
              {t('footer.bookFreeCall')}
            </Link>
          </div>
        </div>
        <div className="footer-bottom">{t('footer.copyright')}</div>
      </div>
    </footer>
  );
}
