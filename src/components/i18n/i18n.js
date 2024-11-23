import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "AI Powered Assistance": "AI Powered Assistance",
      "Search for tasks or content...": "Search for tasks or content...",
      "Submit": "Submit",
      "Response": "Response",
      "English": "English",
      "Spanish": "Spanish",
      // Add other translations here
    },
  },
  es: {
    translation: {
      "AI Powered Assistance": "Asistencia impulsada por IA",
      "Search for tasks or content...": "Buscar tareas o contenido...",
      "Submit": "Enviar",
      "Response": "Respuesta",
      "English": "Inglés",
      "Spanish": "Español",
      // Add other translations here
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',  // Set the default language to English
  interpolation: {
    escapeValue: false,  // React already escapes HTML
  },
});

export default i18n;
