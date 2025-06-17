const i18n = require("i18n");
const path = require("path"); // Node.js 内置模块，用于处理文件路径

i18n.configure({
  locales: ["en", "jp"], // 支持的语言列表
  directory: path.join(__dirname, "..", "locales"), // __dirname 是当前文件所在目录，'..' 返回上一级，然后进入 'locales'
  defaultLocale: "en", // 默认语言
  cookie: "lang", // 用于存储语言的 cookie 名称
  queryParameter: "lang", // 用于从查询参数获取语言
  header: "accept-language", // 用于从请求头获取语言
  register: global, // 可选：将 __() 和 __n() 方法注册到 global，方便直接使用
  autoReload: true, // 开发环境下自动重新加载翻译文件
  syncFiles: true, // 自动创建缺失的翻译文件
});

module.exports = i18n; // 导出配置好的 i18n 实例
