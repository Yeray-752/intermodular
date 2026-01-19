import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

// Importación de datos JSON
import profileData from "./assets/data/profile.json";
import headerData from "./assets/data/header.json";
import footerData from "./assets/data/footer.json";
import homeData from "./assets/data/home.json";
import errorData from "./assets/data/404.json";
import formData from './assets/data/formulario.json';
import servicesData from './assets/data/services.json';
import legalesData from './assets/data/legales.json';
import signupData from './assets/data/signUp.json';
import loginData from './assets/data/login.json';
import aboutData from './assets/data/about.json';
import ratingData from './assets/data/rating.json';
import marketData from './assets/data/market.json';

// Configuración de los recursos de traducción

const resources = {
  en: { 
    profile: profileData.en,
    home: homeData.en,
    header: headerData.en,
    footer: footerData.en,
    error: errorData.en,
    formulario: formData.en,
    servicios: servicesData.en,
    legales: legalesData.en,
    signup: signupData.en,
    login: loginData.en,
    about: aboutData.en,
    rating: ratingData.en,
    market: marketData.en
  },
  es: {
    profile: profileData.es,
    home: homeData.es,
    header: headerData.es,
    footer: footerData.es,
    error: errorData.es,
    formulario: formData.es,
    servicios: servicesData.es,
    legales: legalesData.es,
    signup: signupData.es,
    login: loginData.es,
    about: aboutData.es,
    rating: ratingData.es,
    market: marketData.es
  }
};

i18n
  .use(LanguageDetector) // Detecta el idioma y lo guarda en LocalStorage
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    resources,
    fallbackLng: "es", // Si no encuentra el idioma, usa español

    // Configuración del detector
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'navigator'],
      caches: ['localStorage'], // Guarda la elección del usuario aquí
    },

    // Namespaces (archivos virtuales de traducción)
  ns: ['home','header', 'footer', 'profile', 'error', 'formulario', 'servicios','legales','signup','login','about', 'rating','market'],
    defaultNS: 'home',

    interpolation: {
      escapeValue: false // No es necesario para React (evita XSS automáticamente)
    }
  });

export default i18n;