import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./assets/locales/en.json";
import jp from "./assets/locales/jp.json";
import zhHans from "./assets/locales/zh-Hans.json"; // 可改文件名也行

const customDetector = {
  name: "customDetector",
  lookup() {
    const detected =
      window.localStorage.getItem("i18nextLng") ||
      new URLSearchParams(window.location.search).get("lang");

    if (detected === "zh-Hans" || detected === "zh-hans") return "zhHans";
    return detected;
  },
  cacheUserLanguage(lng) {
    localStorage.setItem("i18nextLng", lng);
  },
};

i18n
  .use({
    type: "languageDetector",
    async: false,
    init: () => {},
    detect: customDetector.lookup,
    cacheUserLanguage: customDetector.cacheUserLanguage,
  })
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      jp: jp,
      zhHans: zhHans,
    },
    fallbackLng: "en",
    supportedLngs: ["en", "jp", "zhHans"],
    cleanCode: false,
    lowerCaseLng: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["customDetector", "querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

if (i18n.language === "zh-Hans" || i18n.language === "zh-hans") {
  i18n.changeLanguage("zhHans");
}

export default i18n;
