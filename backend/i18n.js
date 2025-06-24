const i18n = require("i18n");
const path = require("path"); // Node.js 内置模块，用于处理文件路径

i18n.configure({
  locales: ["en", "jp"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  cookie: "lang",
  queryParameter: "lang",
  header: "accept-language",
  register: global,
  autoReload: true,
  syncFiles: true,
});

module.exports = i18n; // 导出配置好的 i18n 实例
