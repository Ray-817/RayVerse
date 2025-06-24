/* eslint-disable no-unused-vars */
/* eslint-disable react/button-has-type */
import clsx from "clsx";
import { useState, useEffect } from "react";
import ButtonMy from "@components/ui/ButtonMy";
import Icon from "@components/ui/Icon";
import NavLinks from "@components/ui/NavLinks";
import LanguageSelector from "@components/ui/LanguageSelector";
import { useTranslation } from "react-i18next";
import { getResumeDownloadLink } from "@services/resumeService";
import { useAlert } from "@hooks/useAlert";

function Navbar() {
  // State to manage the open/close state of the mobile menu
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { showAlert } = useAlert();

  // Control the body overflow when the menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Function to toggle the mobile menu open/close state
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 函数：获取 URL 中的查询参数 (这个逻辑仍然留在组件或一个更通用的 utils 中)
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    const currentLanguage = getQueryParam("lang") || "en";

    try {
      const downloadUrl = await getResumeDownloadLink(currentLanguage);
      showAlert(
        "success",
        "💛Download Successful",
        "Resume is ready! Please check the new tab for download.",
        3000
      );

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `RayResume_${currentLanguage}.pdf`); // 设置下载文件名
      link.setAttribute("target", "_blank"); // <-- 这行确保在新标签页打开
      link.setAttribute("rel", "noopener noreferrer"); // <-- 安全性最佳实践

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showAlert(
        "destructive",
        `⛔Download Failed`,
        "Please check your network and try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  // Navbar styles
  const navClasses = clsx(
    "flex justify-between items-center",
    "py-4 px-10",
    "sticky top-0 z-100",
    "bg-background-light",
    "border-b border-gray-200"
  );

  // Toggle layer styles for the mobile menu
  const toggleLayerClasses = clsx(
    "fixed inset-0 bg-white bg-opacity-50 z-40 transition-opacity duration-200",
    isOpen ? "opacity-50 visible" : "opacity-0 invisible"
  );

  const mobileMenuClasses = clsx(
    "fixed top-0 left-0 h-full bg-white bg-opacity-50 shadow-lg z-50",
    "transform transition-transform duration-300 ease-in-out",
    "w-[60%]",
    isOpen ? "translate-x-0" : "-translate-x-full",
    "p-auto"
  );

  // Links container styles for bigger screens
  const linkDesktopContainerClasses = clsx(
    "gap-12",
    "items-center justify-between"
  );

  // // Links container styles for mobile screens
  const linkMobileContainerClasses = clsx(
    "flex flex-col items-center justify-center text-center",
    "gap-[8vh]",
    "w-full h-full"
  );

  // Navbar's Links styles
  const linkDesktopClasses = clsx("cursor: pointer;", "interactive-scale");

  const linkMobileClasses = clsx("text-6xl", "interactive-scale");

  // SVG icon styles
  const svgClasses = clsx(
    "w-25 h-25",
    "interactive-scale",

    {
      "rotate-90": isOpen,
    }
  );

  const buttonContainerClasses = clsx("flex items-center justify-center gap-6");

  return (
    <nav className={navClasses}>
      {/* Mobile navigation links */}
      <div className="z-60 md:hidden">
        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          aria-expanded={isOpen ? "true" : "false"}
          aria-controls="mobile-menu"
        >
          <Icon name={isOpen ? "close" : "menu"} className={svgClasses} />
        </button>
      </div>

      {/* Toggle layer for mobile menu that will appear when the menu is opened*/}
      <div className={toggleLayerClasses} onClick={toggleMenu} />

      {/* Mobile menu */}
      <div className={mobileMenuClasses}>
        <div className={linkMobileContainerClasses}>
          <NavLinks linkClassName={linkMobileClasses} onClick={toggleMenu} />
        </div>
      </div>

      {/* Desktop navigation links */}
      <div className={clsx("hidden", "md:flex", linkDesktopContainerClasses)}>
        <NavLinks linkClassName={linkDesktopClasses} />
      </div>

      <div className={buttonContainerClasses}>
        <ButtonMy
          label={t("resume")}
          onClick={handleDownload}
          disabled={loading}
        />
        <LanguageSelector />
      </div>
    </nav>
  );
}

export default Navbar;
