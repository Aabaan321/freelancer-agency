import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import hi from './locales/hi.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import tr from './locales/tr.json';
import nl from './locales/nl.json';
import ur from './locales/ur.json';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN', rtl: false },
  { code: 'ar', name: 'العربية', flag: '🇦🇪', short: 'AR', rtl: true },
  { code: 'zh', name: '中文', flag: '🇨🇳', short: 'ZH', rtl: false },
  { code: 'es', name: 'Español', flag: '🇪🇸', short: 'ES', rtl: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', short: 'FR', rtl: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', short: 'DE', rtl: false },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', short: 'HI', rtl: false },
  { code: 'pt', name: 'Português', flag: '🇵🇹', short: 'PT', rtl: false },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', short: 'RU', rtl: false },
  { code: 'ja', name: '日本語', flag: '🇯🇵', short: 'JA', rtl: false },
  { code: 'ko', name: '한국어', flag: '🇰🇷', short: 'KO', rtl: false },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', short: 'IT', rtl: false },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', short: 'TR', rtl: false },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', short: 'NL', rtl: false },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', short: 'UR', rtl: true },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar }, zh: { translation: zh }, es: { translation: es }, fr: { translation: fr }, de: { translation: de }, hi: { translation: hi }, pt: { translation: pt }, ru: { translation: ru }, ja: { translation: ja }, ko: { translation: ko }, it: { translation: it }, tr: { translation: tr }, nl: { translation: nl }, ur: { translation: ur } },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'aureon_lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
