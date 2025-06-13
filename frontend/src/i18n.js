import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import jp from "./locales/jp.json";

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    jp: jp,
  },
  lng: "en", // 默认语言
  fallbackLng: "en", // 当当前语言没有翻译时，使用的备用语言
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
