/* eslint-disable indent */
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Icon from "@components/ui/Icon";
import config from "../../config/appConfig";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation(); // 使用 useLocation 获取当前 URL 信息

  const languages = [
    { code: "en", name: "English" },
    { code: "jp", name: "日本語" },
  ];

  // 从 URL 查询参数中获取当前语言
  const getCurrentLangFromUrl = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("lang") || config.DEFAULT_LANG; // 优先从 URL 获取，否则使用默认语言
  }, [location.search]);

  // 使用状态来同步 URL 中的语言，并确保 i18n 也是这个语言
  const [currentSelectedLang, setCurrentSelectedLang] = React.useState(
    getCurrentLangFromUrl()
  );

  // 监听 URL 语言变化，并更新 i18n 语言
  useEffect(() => {
    const urlLang = getCurrentLangFromUrl();
    if (urlLang !== i18n.language) {
      i18n.changeLanguage(urlLang);
    }
    setCurrentSelectedLang(urlLang);
  }, [location.search, i18n, getCurrentLangFromUrl]);

  const changeLanguage = (newLangCode) => {
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
    // 注意：这里我们只改变查询参数，不改变 pathname
    const newUrl = `${location.pathname}?${currentParams.toString()}`;
    navigate(newUrl); // 导航到新的 URL
  };

  const currentLangName =
    languages.find((l) => l.code === currentSelectedLang)?.name || "Language"; // 使用 currentSelectedLang 来显示当前语言名称

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-4xl md:text-3xl px-4 py-8 bg-background-light border-0"
        >
          <Icon name="globe" className="size-9 fill-logo" />
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
              text-4xl md:text-3xl mx-2 my-3
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
