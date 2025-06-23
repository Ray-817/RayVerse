import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import jp from "./locales/jp.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: en,
      jp: jp,
    },
    fallbackLng: "en", // 当当前语言没有翻译时，使用的备用语言
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    // **添加语言检测配置**
    detection: {
      order: ["querystring", "localStorage", "navigator"], // 优先级：URL 查询参数 > localStorage > 浏览器语言
      lookupQuerystring: "lang", // 从 URL 参数 'lang' 中查找语言
      lookupLocalStorage: "i18nextLng", // 从 localStorage 的 'i18nextLng' 中查找语言
      caches: ["localStorage"], // 将检测到的语言缓存到 localStorage
    },
  });

export default i18n;
