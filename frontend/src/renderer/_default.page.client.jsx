/* eslint-disable require-await */
// src/renderer/_default.page.client.jsx
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { PageContext } from "./pageContext"; // 创建一个 Context 来传递 pageContext
import { I18nextProvider } from "react-i18next"; // 确保导入 I18nextProvider
import i18nClient from "../i18n/i18n.client"; // 导入客户端的 i18n 配置

import { BrowserRouter } from "react-router-dom";
export { render };

async function render(pageContext) {
  const { Page } = pageContext;

  if (!i18nClient.isInitialized) {
    await i18nClient.init();
  }

  // React 18 的 hydrateRoot
  hydrateRoot(
    document.getElementById("page-view"),
    <PageContext.Provider value={pageContext}>
      <I18nextProvider i18n={i18nClient}>
        {/* 在客户端使用 BrowserRouter */}
        <BrowserRouter>
          {/* 你的 AlertProvider 和其他顶层 Context Providers */}
          {/* <AlertProvider> */}
          <Page />
          {/* </AlertProvider> */}
        </BrowserRouter>
      </I18nextProvider>
    </PageContext.Provider>
  );
}
