import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const resources = {
  ja: { translation: ja },
  en: { translation: en },
};

// Get device locale and extract language code
const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";

// Check if the device language is supported, fallback to English
const supportedLanguages = ["ja", "en"];
const defaultLanguage = supportedLanguages.includes(deviceLocale) ? deviceLocale : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
