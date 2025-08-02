/* eslint-disable indent */
// src/components/layout/LanguageSelector.jsx (或你实际存放的路径)
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom"; // 这些钩子本身在 SSR 环境下在 StaticRouter 内是安全的

import { Button } from "@/components/ui/Button"; // 注意：如果你有这个别名，确保 Vite 配置正确
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";

import Icon from "@components/ui/Icon";
import config from "../../config/appConfig";

function LanguageSelector() {
  const { i18n } = useTranslation();
  // 这些钩子在 StaticRouter 内部会提供一个模拟的 location/navigate 对象
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { code: "en", name: "English" },
    { code: "jp", name: "日本語" },
    { code: "zhHans", name: "简体中文" },
  ];

  // 从 URL 查询参数中获取当前语言
  const getCurrentLangFromUrl = useCallback(() => {
    // !! 关键修改 !! 仅在客户端环境执行
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(location.search);
      return params.get("lang") || config.DEFAULT_LANG;
    }
    // 在服务器端，根据预渲染的默认语言返回
    return i18n.language || config.DEFAULT_LANG; // 使用 i18n 实例当前的语言，或 fallback
  }, [location.search, i18n.language]); // 依赖 i18n.language 以便在 SSR 时获取已设置的语言

  // 使用状态来同步 URL 中的语言，并确保 i18n 也是这个语言
  // 初始状态值也需要考虑 SSR 情况
  const [currentSelectedLang, setCurrentSelectedLang] = React.useState(() => {
    if (typeof window !== "undefined") {
      return getCurrentLangFromUrl();
    }
    // 服务器端直接使用 i18n 已设置的语言
    return i18n.language || config.DEFAULT_LANG;
  });

  // 监听 URL 语言变化，并更新 i18n 语言
  useEffect(() => {
    // !! 关键修改 !! 仅在客户端环境执行
    if (typeof window !== "undefined") {
      const urlLang = getCurrentLangFromUrl();
      if (urlLang !== i18n.language) {
        i18n.changeLanguage(urlLang);
      }
      setCurrentSelectedLang(urlLang);
    }
  }, [location.search, i18n, getCurrentLangFromUrl]); // 依赖项不变

  const changeLanguage = (newLangCode) => {
    // !! 关键修改 !! 仅在客户端环境执行
    if (typeof window !== "undefined") {
      // 如果选择的语言已经是当前语言，则不执行任何操作
      if (newLangCode === currentSelectedLang) {
        return;
      }

      // 更新 i18n 语言 (i18next 的内部状态)
      i18n.changeLanguage(newLangCode);

      // 获取当前的 URL 查询参数
      const currentParams = new URLSearchParams(location.search);
      currentParams.set("lang", newLangCode); // 设置新的语言参数

      // 构建新的 URL（只保留路径，然后拼接查询参数）
      const newUrl = `${location.pathname}?${currentParams.toString()}`;
      navigate(newUrl); // 导航到新的 URL
    }
  };

  const currentLangName =
    languages.find((l) => l.code === currentSelectedLang)?.name || "Language";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-6xl md:text-4xl px-4 py-8 bg-background-light border-0"
        >
          <Icon name="globe" className="size-18 fill-logo md:size-10" />
          {currentLangName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-100 min-w-[max-content] max-w-[calc(100vw-2rem)] sm:max-w-xs md:max-w-sm lg:max-w-md">
        {" "}
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => changeLanguage(language.code)}
            className={`
              text-6xl md:text-4xl mx-2 my-3
              ${
                language.code === currentSelectedLang
                  ? "font-semibold text-text-my"
                  : ""
              }
            `}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSelector;
