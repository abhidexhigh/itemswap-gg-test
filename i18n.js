// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next.
  .use(HttpApi) // HttpApi to load translation files
  .use(LanguageDetector) // Automatically detects user language
  .init({
    supportedLngs: ["en", "ko", "zh-CN", "ja", "vi", "es", "ru"],
    fallbackLng: "en",
    returnObjects: true,
    detection: {
      order: ["path", "cookie", "htmlTag"],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to the translation files
    },
    react: { useSuspense: false },
  });

export default i18n;
