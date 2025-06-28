// src/i18n/i18n.client.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 直接导入翻译文件，这与你原先做法一致
import en from "../assets/locales/en.json";
import jp from "../assets/locales/jp.json";
import zhHans from "../assets/locales/zh-Hans.json";

const customDetector = {
  name: "customDetector",
  lookup() {
    // 确保在浏览器环境才访问 window
    if (typeof window !== "undefined") {
      const detected =
        window.localStorage.getItem("i18nextLng") ||
        new URLSearchParams(window.location.search).get("lang");

      if (detected === "zh-Hans" || detected === "zh-hans") return "zhHans";
      return detected;
    }
    return undefined; // 在非浏览器环境不进行检测
  },
  cacheUserLanguage(lng) {
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lng);
    }
  },
};

i18n
  .use({
    type: "languageDetector",
    async: false, // For custom detectors, async: false is common
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

// 仅在客户端运行此逻辑
if (typeof window !== "undefined") {
  if (i18n.language === "zh-Hans" || i18n.language === "zh-hans") {
    i18n.changeLanguage("zhHans");
  }
}

export default i18n;
