import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="logo">Luxe Studio</div>
            <p style={{ fontStyle: 'italic', color: '#E8D5A3', fontSize: '14px', marginBottom: '8px' }}>Premium Digital Studio — Dubai</p>
            <p>We design and build premium custom websites for ambitious businesses — at 40–50% below market price. Only 5 clients at a time.</p>
            <div className="social-links" style={{ fontSize: '13px', fontWeight: 'bold' }}>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Twitter">X</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/how-we-work">How We Work</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4>Services</h4>
            <ul className="footer-links">
              <li><Link to="/services">Website Development</Link></li>
              <li><Link to="/services">UI/UX Design</Link></li>
              <li><Link to="/services">Digital Marketing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Contact</h4>
            <ul className="footer-links">
              <li>📧 hello@luxestudio.com</li>
              <li>📱 +971 XX XXX XXXX</li>
              <li>📍 Dubai, UAE</li>
            </ul>
            <Link to="/contact" className="btn btn-outline" style={{ marginTop: '16px', padding: '10px 20px', fontSize: '13px' }}>
              Book a Free Call
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 Luxe Studio. Crafted with precision.
        </div>
      </div>
    </footer>
  );
}
