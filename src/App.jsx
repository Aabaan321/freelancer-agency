import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from './i18n';
import { CurrencyProvider } from './context/CurrencyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Services from './pages/Services';
import HowWeWork from './pages/HowWeWork';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import AiService from './pages/AiService';
import './i18n';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
      <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
      <Route path="/services/ai" element={<PageWrapper><AiService /></PageWrapper>} />
      <Route path="/how-we-work" element={<PageWrapper><HowWeWork /></PageWrapper>} />
      <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
      <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
      <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
      <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
    </Routes>
  );
}

function RTLHandler() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = LANGUAGES.find(l => l.code === i18n.language);
    const isRTL = lang?.rtl || false;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);
  return null;
}

export default function App() {
  return (
    <CurrencyProvider>
      <Router>
        <RTLHandler />
        <ScrollToTop />
        <AnnouncementBar />
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
        <ChatWidget />
      </Router>
    </CurrencyProvider>
  );
}
