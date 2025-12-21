import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Función para cargar archivos JSON dinámicamente
import profileData from "./assets/data/profile.json";
import homeData from "./assets/data/home.json";
import errorData from "./assets/data/404.json";
import categoriesData from "./assets/data/categories.json";
import productData from "./assets/data/productosTaller.json";
import formData from './assets/data/formulario.json';

const resources = {
  en: {
    profile: profileData.en,
    home: homeData.en,
    error: errorData.en,
    market: {
      ...categoriesData.en,
      ...productData.en,
    },
    formulario: formData.en,

  },
  es: {
    profile: profileData.es,
    home: homeData.es,
    error: errorData.es,
    market: {
      ...categoriesData.es,
      ...productData.es
    },
    formulario: formData.es,
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: i18n.language || "es",
    fallbackLng: "es",
    ns: ['home', 'profile', 'error', 'market', 'formulario'],
    defaultNS: 'home',
    interpolation: { escapeValue: false }
  });

export default i18n;
