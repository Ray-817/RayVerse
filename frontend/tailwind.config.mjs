// tailwind.config.mjs
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  // 这告诉 Tailwind CSS 哪些文件需要扫描来生成样式
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  // 在这里启用插件
  plugins: [typography],
};
