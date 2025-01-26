// src/i18n/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

i18n
  .use(initReactI18next) // подключаем react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
    },
    lng: "en", // начальный язык
    fallbackLng: "en", // язык по умолчанию
    interpolation: {
      escapeValue: false, // React уже защищает от XSS
    },
  });

export default i18n;
