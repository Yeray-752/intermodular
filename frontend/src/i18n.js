import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Función para cargar archivos JSON dinámicamente
import profileData from "./assets/data/profile.json";
import homeData from "./assets/data/home.json";
import errorData from "./assets/data/404.json";

const resources = {
  en: {
    profile: profileData.en,
    home: homeData.en,
    error: errorData.en
  },
  es: {
    profile: profileData.es,
    home: homeData.es,
    error: errorData.es
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false }
  });

export default i18n;
