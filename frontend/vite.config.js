// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ssr from "vite-plugin-ssr/plugin";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // 指向你的 Tailwind CSS 配置文件
      // 这是关键的一步！
      configFile: path.resolve(__dirname, "tailwind.config.mjs"),
    }),
    ssr({
      prerender: true,
      pageFiles: {
        paths: path.join(__dirname, "src", "pages"),
      },
    }),
  ],
  server: {
    proxy: {
      "/api/v1": {
        target: `http://localhost:3030`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@config": path.resolve(__dirname, "src/config"),
      "@services": path.resolve(__dirname, "src/services"),
      "@context": path.resolve(__dirname, "src/context"),
    },
  },
  build: {
    assetsInlineLimit: 25 * 1024,
  },
});
