import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import Icon from "@components/ui/Icon";

function LanguageSelector() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();

  const languages = [
    { code: "en", name: "English" },
    { code: "jp", name: "日本語" },
  ];

  const changeLanguage = (newLangCode) => {
    if (newLangCode === i18n.language) {
      return;
    }

    i18n.changeLanguage(newLangCode);

    const currentPath = window.location.pathname;
    const pathParts = currentPath.split("/").filter((part) => part !== "");

    const isLangInPath = languages.some((l) => l.code === pathParts[0]);

    if (isLangInPath) {
      pathParts[0] = newLangCode;
    } else {
      pathParts.unshift(newLangCode);
    }

    const newPath = "/" + pathParts.join("/");
    navigate(newPath);
  };

  const currentLangName =
    languages.find((l) => l.code === (lang || i18n.language))?.name ||
    "Language";

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
              ${language.code === (lang || i18n.language) ? "font-semibold text-text-my" : ""}
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
