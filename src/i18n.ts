import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LIST_Lang, type TYPE_Lang } from '@/config/TYPE_Lang';

const checkPathLang = {
  name: 'checkPath',
  lookup() {
    const path = window.location.pathname || '';
    const firstParam = path.split('/')[1] || '';
    if (LIST_Lang.includes(firstParam as TYPE_Lang)) {
      return firstParam;
    }
    return null;
  },
};

const detectLang = new LanguageDetector();
detectLang.addDetector(checkPathLang as never);

i18n
  .use(detectLang)
  .use(initReactI18next)
  .init({
    fallbackLng: 'tw',
    interpolation: { escapeValue: false },
    resources: {},
    detection: {
      order: ['querystring', 'checkPath', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'webLang',
      lookupLocalStorage: 'webLang',
      lookupCookie: 'webLang',
    },
  });

export default i18n;
