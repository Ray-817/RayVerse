/* eslint-disable no-unused-vars */
// src/renderer/_default.page.server.jsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import logoUrl from "../../public/favicon.ico"; // 如果你有网站 Logo 等静态资源，可以这样导入
import { I18nextProvider } from "react-i18next"; // 确保导入 I18nextProvider
import { StaticRouter } from "react-router-dom";
import i18nServer from "../i18n/i18n.server"; // 导入服务器端的 i18n 配置

export { render };
// 导出 onBeforeRender 函数，可以用于全局的数据预加载或身份验证
// export { onBeforeRender };

async function render(pageContext) {
  const { Page, exports, documentProps, urlOriginal } = pageContext;

  const pageHtml = (
    <I18nextProvider i18n={i18nServer}>
      {/* 使用 StaticRouter 包裹你的应用 */}
      {/* StaticRouter 需要一个 location 属性，通常是当前页面的 URL */}
      <StaticRouter location={urlOriginal}>
        {/* 你的 AlertProvider 和其他顶层 Context Providers */}
        {/* <AlertProvider> */}
        <Page />
        {/* </AlertProvider> */}
      </StaticRouter>
    </I18nextProvider>
  );

  await i18nServer.init();
  // 可以从页面组件的 exports 中获取标题等信息
  const title = (documentProps && documentProps.title) || "RAY's World";
  const description =
    (documentProps && documentProps.description) ||
    "This website is a glimpse into Ray's journey as a full-stack developer—projects, skills, and inspirations.";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
        <link rel="preload" href="/fonts/my-font-bold.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/my-font-thin.woff2" as="font" type="font/woff2" crossorigin>
        </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
        </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // 可以在这里传递一些数据到客户端
    },
  };
}
