// src/i18n/i18n.server.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 直接导入翻译文件，这在服务器端预渲染时是可行的
import en from "../assets/locales/en.json";
import jp from "../assets/locales/jp.json";
import zhHans from "../assets/locales/zh-Hans.json";

// 在服务器端预渲染时，我们通常选择一个默认语言进行渲染
// 如果你需要预渲染多种语言的静态页面，你需要为每种语言运行一次预渲染过程
// 或者在 onBeforeRender 中动态设置语言并传递给 i18n
const DEFAULT_PRE_RENDER_LANG = "en"; // 或者 "zhHans" 或 "jp"

i18n.use(initReactI18next).init({
  resources: {
    en: en,
    jp: jp,
    zhHans: zhHans,
  },
  lng: DEFAULT_PRE_RENDER_LANG, // 设置预渲染的语言
  fallbackLng: "en", // 备用语言
  supportedLngs: ["en", "jp", "zhHans"],
  cleanCode: false,
  lowerCaseLng: false,
  interpolation: {
    escapeValue: false,
  },
  // 服务器端不使用语言检测器，因为没有浏览器环境
  // detection: { ... } 部分在服务器端是无效且可能导致错误的
});

// 在服务器端，通常不需要在初始化后立即 changeLanguage
// 语言已经在 init 的 lng 属性中设置了

export default i18n;
