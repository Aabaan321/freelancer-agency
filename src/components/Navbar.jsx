import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../i18n';
import { useCurrency } from '../context/CurrencyContext';
import aureoLogo from '../assets/aureo.jpeg';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { currency, setCurrency, currentCurrency, CURRENCIES } = useCurrency();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const langRef = useRef(null);
  const currRef = useRef(null);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/how-we-work', label: t('nav.howWeWork') },
    { to: '/about', label: t('nav.about') },
    { to: '/projects', label: t('nav.projects') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/faq', label: t('nav.faq') },
  ];

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target)) setCurrOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('aureo_lang', code);
    setLangOpen(false);
  };

  const changeCurr = (code) => {
    setCurrency(code);
    setCurrOpen(false);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="logo">
            <img src={aureoLogo} alt="Aureo" style={{ height: '40px', width: 'auto', borderRadius: '4px' }} />
          </Link>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.to}>
                <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                  {l.label}
                </NavLink>
              </li>
            ))}

            {/* Language Switcher */}
            <li className="switcher-item" ref={langRef}>
              <button className="switcher-btn" onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}>
                {currentLang.flag} {currentLang.short} <ChevronDown size={14} className={`chev ${langOpen ? 'open' : ''}`} />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div className="switcher-dropdown" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                    {LANGUAGES.map(l => (
                      <button key={l.code} className={`switcher-option${i18n.language === l.code ? ' active' : ''}`} onClick={() => changeLang(l.code)}>
                        <span className="flag">{l.flag}</span> {l.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Currency Switcher */}
            <li className="switcher-item" ref={currRef}>
              <button className="switcher-btn" onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}>
                {currentCurrency.flag} {currentCurrency.code} <ChevronDown size={14} className={`chev ${currOpen ? 'open' : ''}`} />
              </button>
              <AnimatePresence>
                {currOpen && (
                  <motion.div className="switcher-dropdown" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}>
                    {CURRENCIES.map(c => (
                      <button key={c.code} className={`switcher-option${currency === c.code ? ' active' : ''}`} onClick={() => changeCurr(c.code)}>
                        <span className="flag">{c.flag}</span> {c.name} <span className="code">({c.code})</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <Link to="/contact" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>
                {t('nav.bookCall')}
              </Link>
            </li>
          </ul>
          <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#F5F5F5' }}>
              <X size={28} />
            </button>

            {/* Mobile Language + Currency — top right */}
            <div className="mobile-switchers">
              <div className="mobile-switcher">
                <select value={i18n.language} onChange={(e) => changeLang(e.target.value)}>
                  {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                </select>
              </div>
              <div className="mobile-switcher">
                <select value={currency} onChange={(e) => changeCurr(e.target.value)}>
                  {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.code})</option>)}
                </select>
              </div>
            </div>

            {links.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <NavLink to={l.to} onClick={() => setMobileOpen(false)} end={l.to === '/'}>{l.label}</NavLink>
              </motion.div>
            ))}
            <Link to="/contact" className="btn btn-primary" onClick={() => setMobileOpen(false)}>{t('nav.bookCall')}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
