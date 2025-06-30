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

  // Hydrate 你的 React 应用到新的 ID 'page-view-content'
  // 这是为了确保 Loader 和主要内容可以独立处理
  hydrateRoot(
    document.getElementById("page-view-content"), // <-- 注意这里是新的 ID
    <PageContext.Provider value={pageContext}>
      <I18nextProvider i18n={i18nClient}>
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      </I18nextProvider>
    </PageContext.Provider>
  );

  // 在 hydrate 完成后隐藏加载动画
  if (typeof window !== "undefined") {
    const loaderWrapper = document.getElementById("loader-wrapper");
    if (loaderWrapper) {
      loaderWrapper.classList.add("loader-hidden");
      // 动画结束后从 DOM 中移除
      loaderWrapper.addEventListener(
        "transitionend",
        () => {
          loaderWrapper.remove();
        },
        { once: true }
      );
    }
  }
}
