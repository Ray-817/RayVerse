/* eslint-disable no-unused-vars */
// src/renderer/_default.page.server.jsx
import React from "react";
import ReactDOMServer from "react-dom/server";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import logoUrl from "../../public/favicon.ico"; // 如果你有网站 Logo 等静态资源，可以这样导入
import { I18nextProvider } from "react-i18next"; // 确保导入 I18nextProvider
import { StaticRouter } from "react-router-dom";
import i18nServer from "../i18n/i18n.server"; // 导入服务器端的 i18n 配置
import Loader from "@components/ui/Loader";

export { render };
// 导出 onBeforeRender 函数，可以用于全局的数据预加载或身份验证
// export { onBeforeRender };

async function render(pageContext) {
  const { Page, exports, documentProps, urlOriginal } = pageContext;

  await i18nServer.init();

  // 同时渲染你的应用和 Loader 组件
  // 注意：我们将 Loader 和 Page 放在一起，并都作为 pageHtml 的一部分
  const pageHtml = ReactDOMServer.renderToString(
    <I18nextProvider i18n={i18nServer}>
      <StaticRouter location={urlOriginal}>
        {/* <AlertProvider> */}
        <Loader /> {/* <-- 在这里渲染 Loader 组件 */}
        <div id="page-view-content">
          {" "}
          {/* <-- 为你的主要内容创建一个新 ID */}
          <Page />
        </div>
        {/* </AlertProvider> */}
      </StaticRouter>
    </I18nextProvider>
  );

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
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap" rel="stylesheet"/>
      </head>
      <body>
        ${dangerouslySkipEscape(pageHtml)}
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {},
  };
}
